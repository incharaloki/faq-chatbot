/**
 * Chatbot Intelligence & Natural Language Matching Engine
 */

class FAQChatbotEngine {
  constructor(database) {
    this.database = database;
    this.stopWords = new Set([
      "a", "an", "the", "is", "are", "was", "were", "be", "been", "being",
      "have", "has", "had", "do", "does", "did", "to", "from", "in", "out",
      "on", "off", "over", "under", "again", "further", "then", "once", "here",
      "there", "when", "where", "why", "how", "all", "any", "both", "each",
      "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only",
      "own", "same", "so", "than", "too", "very", "can", "will", "just", "should",
      "now", "i", "me", "my", "we", "our", "you", "your", "it", "its", "please"
    ]);

    // Common greetings and small-talk
    this.smallTalk = [
      {
        triggers: ["hi", "hello", "hey", "greetings", "good morning", "good afternoon", "good evening", "howdy"],
        response: "Hello there! 👋 I'm your FAQ virtual assistant. How can I help you today? You can type your question or select from the suggestions below."
      },
      {
        triggers: ["thanks", "thank you", "thx", "appreciate it", "great thanks", "awesome"],
        response: "You're very welcome! 😊 Is there anything else I can help you with today?"
      },
      {
        triggers: ["bye", "goodbye", "see you", "exit", "farewell"],
        response: "Goodbye! Have a wonderful day, and feel free to reach out anytime if you need more help! ✨"
      },
      {
        triggers: ["who are you", "what is your name", "are you a bot", "are you human"],
        response: "I'm **FAQBot**, an interactive AI-style assistant built to answer your questions accurately and instantly! 🤖"
      },
      {
        triggers: ["help", "what can you do", "options", "menu"],
        response: "I can answer questions regarding **Getting Started**, **Account & Security**, **Billing & Plans**, **Features & Usage**, and **Technical Support**. Try asking a specific question, or click one of the suggested prompts below!"
      }
    ];
  }

  /**
   * Tokenizes text into lowercase cleaned words without punctuation
   */
  tokenize(text) {
    if (!text) return [];
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 0);
  }

  /**
   * Filter out common stop words to focus on meaningful tokens
   */
  getSignificantTokens(tokens) {
    return tokens.filter(t => !this.stopWords.has(t) && t.length > 1);
  }

  /**
   * Computes simple Levenshtein distance between two short words for typo tolerance
   */
  levenshteinDistance(s1, s2) {
    if (s1 === s2) return 0;
    if (s1.length === 0) return s2.length;
    if (s2.length === 0) return s1.length;

    const matrix = [];
    for (let i = 0; i <= s2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= s1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= s2.length; i++) {
      for (let j = 1; j <= s1.length; j++) {
        if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          );
        }
      }
    }
    return matrix[s2.length][s1.length];
  }

  /**
   * Check if two tokens are similar (handles typos like 'passwrd' -> 'password')
   */
  isTokenMatch(t1, t2) {
    if (t1 === t2) return true;
    if (t1.includes(t2) || t2.includes(t1)) return true;
    // Allow edit distance of 1 for words >= 4 chars, 2 for >= 7 chars
    const maxDist = t1.length >= 7 && t2.length >= 7 ? 2 : (t1.length >= 4 && t2.length >= 4 ? 1 : 0);
    if (maxDist > 0) {
      return this.levenshteinDistance(t1, t2) <= maxDist;
    }
    return false;
  }

  /**
   * Calculate relevance score between user query and an FAQ item
   */
  scoreFaq(queryTokens, querySignificant, rawQuery, faq) {
    const rawLower = rawQuery.toLowerCase().trim();
    const faqQuestionLower = faq.question.toLowerCase().trim();

    // 1. Exact string match
    if (rawLower === faqQuestionLower) {
      return 1.0;
    }

    // 2. Exact or substring match in predefined patterns
    for (const pattern of faq.patterns) {
      const patLower = pattern.toLowerCase();
      if (rawLower === patLower) return 0.98;
      if (rawLower.includes(patLower) || patLower.includes(rawLower)) {
        return 0.88;
      }
    }

    // 3. Question token overlap
    const questionTokens = this.tokenize(faq.question);
    const questionSignificant = this.getSignificantTokens(questionTokens);

    let matchedTokens = 0;
    for (const qToken of querySignificant) {
      if (questionSignificant.some(target => this.isTokenMatch(qToken, target))) {
        matchedTokens++;
      }
    }

    let tokenScore = 0;
    if (querySignificant.length > 0) {
      tokenScore = (matchedTokens / querySignificant.length) * 0.6;
    }

    // 4. Keyword boost
    let keywordScore = 0;
    if (faq.keywords && faq.keywords.length > 0) {
      let kwMatches = 0;
      for (const kw of faq.keywords) {
        const kwLower = kw.toLowerCase();
        if (rawLower.includes(kwLower)) {
          kwMatches += 1.5;
        } else {
          for (const qToken of queryTokens) {
            if (this.isTokenMatch(qToken, kwLower)) {
              kwMatches += 1;
              break;
            }
          }
        }
      }
      keywordScore = Math.min(0.4, (kwMatches / faq.keywords.length) * 0.4);
    }

    // 5. Pattern similarity checks
    let patternScore = 0;
    for (const pattern of faq.patterns) {
      const pTokens = this.getSignificantTokens(this.tokenize(pattern));
      let pMatches = 0;
      for (const qToken of querySignificant) {
        if (pTokens.some(target => this.isTokenMatch(qToken, target))) {
          pMatches++;
        }
      }
      const pRatio = pTokens.length > 0 ? pMatches / pTokens.length : 0;
      if (pRatio > patternScore) patternScore = pRatio * 0.35;
    }

    return Math.min(1.0, tokenScore + keywordScore + patternScore);
  }

  /**
   * Main query resolution method
   */
  processQuery(userInput) {
    const rawTrimmed = userInput.trim();
    if (!rawTrimmed) {
      return {
        type: "empty",
        message: "Please type a question or select one of the suggested FAQs."
      };
    }

    const cleanInput = rawTrimmed.toLowerCase();

    // Check Small Talk / Greetings first
    for (const item of this.smallTalk) {
      for (const trigger of item.triggers) {
        if (cleanInput === trigger || cleanInput === trigger + "!" || cleanInput.startsWith(trigger + " ") || cleanInput.endsWith(" " + trigger)) {
          return {
            type: "smalltalk",
            message: item.response,
            suggestions: this.getTopFaqSuggestions(3)
          };
        }
      }
    }

    const queryTokens = this.tokenize(rawTrimmed);
    const querySignificant = this.getSignificantTokens(queryTokens);

    // Score all FAQs
    const scoredList = this.database.map(faq => ({
      faq,
      score: this.scoreFaq(queryTokens, querySignificant, rawTrimmed, faq)
    }));

    // Sort by descending score
    scoredList.sort((a, b) => b.score - a.score);

    const bestMatch = scoredList[0];

    // High confidence answer
    if (bestMatch && bestMatch.score >= 0.42) {
      const relatedFaqs = (bestMatch.faq.related || [])
        .map(id => this.database.find(f => f.id === id))
        .filter(Boolean);

      return {
        type: "answer",
        faq: bestMatch.faq,
        score: bestMatch.score,
        answer: bestMatch.faq.answer,
        question: bestMatch.faq.question,
        category: bestMatch.faq.category,
        related: relatedFaqs
      };
    }

    // Medium confidence - suggest closest options
    const possibleMatches = scoredList.filter(item => item.score >= 0.20).slice(0, 3);
    if (possibleMatches.length > 0) {
      return {
        type: "clarification",
        message: "I couldn't find an exact answer for that, but here are the closest topics that might help:",
        suggestions: possibleMatches.map(m => m.faq.question)
      };
    }

    // Fallback response with helpful alternatives
    return {
      type: "fallback",
      message: "I'm sorry, I couldn't find a direct answer to that in our knowledge base. Would you like to check one of these common topics or rephrase your question?",
      suggestions: this.getTopFaqSuggestions(3)
    };
  }

  /**
   * Return top popular or default FAQ suggestions
   */
  getTopFaqSuggestions(count = 3) {
    return this.database.slice(0, count).map(f => f.question);
  }

  /**
   * Auto-complete / search matches for the input box
   */
  searchFaqs(searchTerm, limit = 5) {
    if (!searchTerm || searchTerm.trim().length < 2) return [];
    const term = searchTerm.toLowerCase().trim();

    return this.database
      .filter(faq => {
        return (
          faq.question.toLowerCase().includes(term) ||
          faq.category.toLowerCase().includes(term) ||
          faq.patterns.some(p => p.toLowerCase().includes(term)) ||
          faq.keywords.some(k => k.toLowerCase().includes(term))
        );
      })
      .slice(0, limit);
  }

  /**
   * Group all FAQs by Category for Knowledge Base browser
   */
  getCategories() {
    const categories = {};
    for (const faq of this.database) {
      if (!categories[faq.category]) {
        categories[faq.category] = [];
      }
      categories[faq.category].push(faq);
    }
    return categories;
  }
}
