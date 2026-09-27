# FAQBot - Interactive FAQ Chatbot Website

A clean, modern, and responsive FAQ Chatbot web application built purely with **HTML5, CSS3, and JavaScript (ES6+)**. It delivers instant answers to user questions, supports typo-tolerant natural language matching, live autocomplete suggestions, categorized knowledge browsing, and dark/light themes.

> **Zero Dependencies**: Runs completely locally in any modern browser without needing Firebase, Node packages, or external databases.

---

## 🌟 Key Features

1. **Intelligent Natural Language Matching**:
   - **Typo Tolerance**: Handles misspelled words (e.g., `"passwrd"`, `"refnd"`) using Levenshtein distance.
   - **Semantic & Keyword Scoring**: Matches queries against questions, alternate phrasing patterns, and weighted keyword tags.
   - **Confidence Fallbacks**: Suggests closest matching questions if a direct answer is not found.
   - **Interactive Follow-ups**: Provides related question pills directly below answers.

2. **Modern & Sleek UI/UX**:
   - Clean card-and-bubble layout inspired by modern design systems (Intercom, Linear, Stripe).
   - **Light & Dark Mode**: Seamless toggle with local storage persistence.
   - **Typing Indicator**: Lifelike animated typing feedback before bot replies.
   - **User Reaction Ratings**: Interactive Thumbs Up / Thumbs Down feedback buttons.

3. **Smart Autocomplete & Search**:
   - Live search dropdown as the user types questions into the chat input with keyboard navigation (`↑`, `↓`, `Enter`, `Esc`).

4. **Knowledge Base Browser**:
   - Full categorized accordion modal where users can browse all FAQs by category or search them dynamically.
   - "Ask in Chat" action on each FAQ item to jump straight into conversation.

5. **Fully Responsive**:
   - Works across desktops, tablets, and smartphones with a collapsible slide-over drawer on mobile screens.

---

## 📁 Project Structure

```
faq-chatbot/
│
├── index.html       # Semantic HTML5 layout with sidebar, chat area, and modal
├── style.css        # Modern CSS with custom properties, animations, and dark mode
├── faqs.js          # Knowledge base of predefined FAQs, patterns, and categories
├── chatbot.js       # Natural language matching engine, scoring & small talk
├── app.js           # UI controller, event listeners, autocomplete, and theme logic
└── README.md        # Documentation and quickstart instructions
```

---

## 🚀 How to Run Locally

You can run this project locally using any of the methods below:

### Option 1: Direct File Open (Easiest)
Simply double-click [`index.html`](file:///C:/Users/INCHARA%20L/.gemini/antigravity/scratch/faq-chatbot/index.html) or right-click it and select **Open with > Chrome / Edge / Firefox**.

### Option 2: Python Built-in HTTP Server
If you have Python installed, open PowerShell or Command Prompt in this folder and run:
```powershell
python -m http.server 8000
```
Then visit: `http://localhost:8000`

### Option 3: VS Code Live Server
If you use VS Code, right-click `index.html` and choose **"Open with Live Server"**.

---

## ✏️ How to Customize or Add FAQs

All FAQs are stored in [`faqs.js`](file:///C:/Users/INCHARA%20L/.gemini/antigravity/scratch/faq-chatbot/faqs.js). To add a new FAQ, simply insert an object into the `FAQ_DATABASE` array:

```javascript
{
  id: "custom-1",
  category: "Billing & Plans",
  question: "Do you offer annual discounts?",
  patterns: [
    "annual discount",
    "yearly billing discount",
    "save on yearly plan",
    "annual pricing"
  ],
  keywords: ["annual", "discount", "yearly", "save", "pricing"],
  answer: "Yes! Choosing annual billing saves you <strong>20%</strong> compared to month-to-month plans.",
  related: ["bill-1", "bill-2"]
}
```

The matching engine and knowledge base modal will automatically include your new questions!
