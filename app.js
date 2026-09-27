/**
 * Main Application Controller for FAQ Chatbot Website
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Initialize Engine & DOM References
  const botEngine = new FAQChatbotEngine(FAQ_DATABASE);

  const messagesContainer = document.getElementById("messagesContainer");
  const typingIndicator = document.getElementById("typingIndicator");
  const welcomeHero = document.getElementById("welcomeHero");
  const heroPromptGrid = document.getElementById("heroPromptGrid");
  const chatForm = document.getElementById("chatForm");
  const chatInput = document.getElementById("chatInput");
  const sendBtn = document.getElementById("sendBtn");
  const quickPromptsBar = document.getElementById("quickPromptsBar");
  const autocompleteDropdown = document.getElementById("autocompleteDropdown");
  const categoryList = document.getElementById("categoryList");
  const quickFaqsContainer = document.getElementById("quickFaqsContainer");

  // Sidebar elements
  const sidebar = document.getElementById("sidebar");
  const sidebarBackdrop = document.getElementById("sidebarBackdrop");
  const openSidebarBtn = document.getElementById("openSidebarBtn");
  const closeSidebarBtn = document.getElementById("closeSidebarBtn");
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const themeIcon = document.getElementById("themeIcon");
  const themeLabel = document.getElementById("themeLabel");
  const clearChatBtn = document.getElementById("clearChatBtn");

  // Modal elements
  const knowledgeModal = document.getElementById("knowledgeModal");
  const openKnowledgeModalBtn = document.getElementById("openKnowledgeModalBtn");
  const closeKnowledgeModalBtn = document.getElementById("closeKnowledgeModalBtn");
  const modalSearchInput = document.getElementById("modalSearchInput");
  const modalBody = document.getElementById("modalBody");

  let activeAutocompleteIndex = -1;

  // -------------------------------------------------------------
  // Theme Management
  // -------------------------------------------------------------
  function initTheme() {
    const savedTheme = localStorage.getItem("faqbot-theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeUI(savedTheme);
  }

  function updateThemeUI(theme) {
    if (theme === "dark") {
      themeLabel.textContent = "Light Mode";
      themeIcon.innerHTML = `
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      `;
    } else {
      themeLabel.textContent = "Dark Mode";
      themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
    }
  }

  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("faqbot-theme", newTheme);
    updateThemeUI(newTheme);
  });

  // -------------------------------------------------------------
  // Sidebar & Mobile Drawer
  // -------------------------------------------------------------
  function openSidebar() {
    sidebar.classList.add("open");
    sidebarBackdrop.classList.add("open");
  }

  function closeSidebar() {
    sidebar.classList.remove("open");
    sidebarBackdrop.classList.remove("open");
  }

  if (openSidebarBtn) openSidebarBtn.addEventListener("click", openSidebar);
  if (closeSidebarBtn) closeSidebarBtn.addEventListener("click", closeSidebar);
  if (sidebarBackdrop) sidebarBackdrop.addEventListener("click", closeSidebar);

  // -------------------------------------------------------------
  // Populate Sidebar & Starter Prompts
  // -------------------------------------------------------------
  function populateSidebar() {
    const categorized = botEngine.getCategories();
    categoryList.innerHTML = "";

    // "All Topics" item
    const allItem = document.createElement("li");
    allItem.innerHTML = `
      <button class="category-item active" data-category="all">
        <span>All Knowledge Base</span>
        <span class="category-badge">${FAQ_DATABASE.length}</span>
      </button>
    `;
    categoryList.appendChild(allItem);

    // Categories
    Object.keys(categorized).forEach(cat => {
      const li = document.createElement("li");
      li.innerHTML = `
        <button class="category-item" data-category="${cat}">
          <span>${cat}</span>
          <span class="category-badge">${categorized[cat].length}</span>
        </button>
      `;
      categoryList.appendChild(li);
    });

    // Handle category filter click
    categoryList.addEventListener("click", (e) => {
      const btn = e.target.closest(".category-item");
      if (!btn) return;

      document.querySelectorAll(".category-item").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const catName = btn.getAttribute("data-category");
      openKnowledgeModalWithCategory(catName);
      if (window.innerWidth <= 900) closeSidebar();
    });

    // Populate Popular Quick Questions in Sidebar
    quickFaqsContainer.innerHTML = "";
    STARTER_PROMPTS.slice(0, 4).forEach(question => {
      const qBtn = document.createElement("button");
      qBtn.className = "quick-faq-btn";
      qBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
        <span>${escapeHtml(question)}</span>
      `;
      qBtn.addEventListener("click", () => {
        handleUserMessageSubmission(question);
        if (window.innerWidth <= 900) closeSidebar();
      });
      quickFaqsContainer.appendChild(qBtn);
    });

    // Populate Hero Prompts
    heroPromptGrid.innerHTML = "";
    STARTER_PROMPTS.forEach(prompt => {
      const card = document.createElement("button");
      card.className = "hero-prompt-card";
      card.textContent = prompt;
      card.addEventListener("click", () => handleUserMessageSubmission(prompt));
      heroPromptGrid.appendChild(card);
    });

    // Populate Bottom Quick Chips Bar
    quickPromptsBar.innerHTML = "";
    STARTER_PROMPTS.forEach(prompt => {
      const chip = document.createElement("button");
      chip.className = "prompt-chip";
      chip.textContent = prompt;
      chip.addEventListener("click", () => handleUserMessageSubmission(prompt));
      quickPromptsBar.appendChild(chip);
    });
  }

  // -------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------
  function escapeHtml(text) {
    const div = document.createElement("div");
    div.innerText = text;
    return div.innerHTML;
  }

  function formatTime(date = new Date()) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function scrollToBottom() {
    messagesContainer.scrollTo({
      top: messagesContainer.scrollHeight,
      behavior: "smooth"
    });
  }

  // -------------------------------------------------------------
  // Message Rendering
  // -------------------------------------------------------------
  function appendUserMessage(text) {
    const row = document.createElement("div");
    row.className = "message-row user";
    row.innerHTML = `
      <div class="avatar user">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </div>
      <div class="message-body">
        <div class="message-meta">
          <span>You</span> • <span>${formatTime()}</span>
        </div>
        <div class="bubble">${escapeHtml(text)}</div>
      </div>
    `;
    messagesContainer.insertBefore(row, typingIndicator);
    scrollToBottom();
  }

  function appendBotMessage(result) {
    const row = document.createElement("div");
    row.className = "message-row bot";

    let contentHtml = "";

    if (result.type === "answer") {
      contentHtml += `<span class="bubble-tag">${escapeHtml(result.category)}</span>`;
      contentHtml += `<div>${result.answer}</div>`;

      // Related suggestions if available
      if (result.related && result.related.length > 0) {
        contentHtml += `
          <div class="followup-suggestions">
            <span class="followup-title">Related questions:</span>
            <div class="suggestion-pill-list">
              ${result.related
                .map(
                  r => `
                <button class="suggestion-pill" data-question="${escapeHtml(r.question)}">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  ${escapeHtml(r.question)}
                </button>
              `
                )
                .join("")}
            </div>
          </div>
        `;
      }
    } else if (result.type === "clarification" || result.type === "fallback" || result.type === "smalltalk") {
      contentHtml += `<div>${result.message}</div>`;

      if (result.suggestions && result.suggestions.length > 0) {
        contentHtml += `
          <div class="followup-suggestions">
            <span class="followup-title">Suggested topics:</span>
            <div class="suggestion-pill-list">
              ${result.suggestions
                .map(
                  s => `
                <button class="suggestion-pill" data-question="${escapeHtml(s)}">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  ${escapeHtml(s)}
                </button>
              `
                )
                .join("")}
            </div>
          </div>
        `;
      }
    } else {
      contentHtml += `<div>${escapeHtml(result.message)}</div>`;
    }

    row.innerHTML = `
      <div class="avatar bot">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="11" width="18" height="10" rx="2"></rect>
          <circle cx="12" cy="5" r="2"></circle>
          <path d="M12 7v4"></path>
          <line x1="8" y1="16" x2="8" y2="16"></line>
          <line x1="16" y1="16" x2="16" y2="16"></line>
        </svg>
      </div>
      <div class="message-body">
        <div class="message-meta">
          <span>FAQ Assistant</span> • <span>${formatTime()}</span>
        </div>
        <div class="bubble">${contentHtml}</div>
        <div class="feedback-actions">
          <button class="feedback-btn like-btn" title="Helpful answer" aria-label="Helpful">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
          </button>
          <button class="feedback-btn dislike-btn" title="Not helpful" aria-label="Not helpful">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"></path></svg>
          </button>
        </div>
      </div>
    `;

    // Add click listeners to suggestions pills inside bubble
    row.querySelectorAll(".suggestion-pill").forEach(pill => {
      pill.addEventListener("click", () => {
        const query = pill.getAttribute("data-question");
        handleUserMessageSubmission(query);
      });
    });

    // Add feedback reaction listeners
    const likeBtn = row.querySelector(".like-btn");
    const dislikeBtn = row.querySelector(".dislike-btn");
    const feedbackActions = row.querySelector(".feedback-actions");

    if (likeBtn && dislikeBtn) {
      likeBtn.addEventListener("click", () => {
        likeBtn.classList.add("active");
        dislikeBtn.classList.remove("active");
        likeBtn.disabled = true;
        dislikeBtn.disabled = true;
        renderFeedbackToast(feedbackActions, "Glad this helped! 👍");
      });

      dislikeBtn.addEventListener("click", () => {
        dislikeBtn.classList.add("active");
        likeBtn.classList.remove("active");
        likeBtn.disabled = true;
        dislikeBtn.disabled = true;
        renderFeedbackToast(feedbackActions, "Thanks, we'll improve this! 💡");
      });
    }

    messagesContainer.insertBefore(row, typingIndicator);
    scrollToBottom();
  }

  function renderFeedbackToast(container, text) {
    const toast = document.createElement("span");
    toast.className = "feedback-toast";
    toast.textContent = text;
    container.appendChild(toast);
  }

  // -------------------------------------------------------------
  // Submission & Processing Flow
  // -------------------------------------------------------------
  function handleUserMessageSubmission(message) {
    if (!message || !message.trim()) return;

    const query = message.trim();
    chatInput.value = "";
    closeAutocomplete();

    // Hide welcome card if visible
    if (welcomeHero) {
      welcomeHero.style.display = "none";
    }

    // Display user message
    appendUserMessage(query);

    // Show typing indicator
    typingIndicator.style.display = "flex";
    scrollToBottom();

    // Simulate realistic response delay
    const delay = Math.min(800, Math.max(350, query.length * 15));
    setTimeout(() => {
      typingIndicator.style.display = "none";
      const result = botEngine.processQuery(query);
      appendBotMessage(result);
    }, delay);
  }

  // Form submit handler
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    handleUserMessageSubmission(chatInput.value);
  });

  // -------------------------------------------------------------
  // Autocomplete / Live Search Dropdown
  // -------------------------------------------------------------
  chatInput.addEventListener("input", (e) => {
    const val = e.target.value.trim();
    if (val.length < 2) {
      closeAutocomplete();
      return;
    }

    const matches = botEngine.searchFaqs(val, 5);
    renderAutocomplete(matches);
  });

  chatInput.addEventListener("keydown", (e) => {
    const items = autocompleteDropdown.querySelectorAll(".autocomplete-item");
    if (!items.length || !autocompleteDropdown.classList.contains("open")) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeAutocompleteIndex = (activeAutocompleteIndex + 1) % items.length;
      highlightAutocompleteItem(items);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeAutocompleteIndex = (activeAutocompleteIndex - 1 + items.length) % items.length;
      highlightAutocompleteItem(items);
    } else if (e.key === "Enter" && activeAutocompleteIndex > -1) {
      e.preventDefault();
      items[activeAutocompleteIndex].click();
    } else if (e.key === "Escape") {
      closeAutocomplete();
    }
  });

  function renderAutocomplete(matches) {
    if (!matches || !matches.length) {
      closeAutocomplete();
      return;
    }

    autocompleteDropdown.innerHTML = "";
    activeAutocompleteIndex = -1;

    matches.forEach(item => {
      const div = document.createElement("div");
      div.className = "autocomplete-item";
      div.innerHTML = `
        <span>${escapeHtml(item.question)}</span>
        <span class="autocomplete-cat">${escapeHtml(item.category)}</span>
      `;
      div.addEventListener("click", () => {
        handleUserMessageSubmission(item.question);
      });
      autocompleteDropdown.appendChild(div);
    });

    autocompleteDropdown.classList.add("open");
  }

  function highlightAutocompleteItem(items) {
    items.forEach((item, idx) => {
      if (idx === activeAutocompleteIndex) {
        item.classList.add("highlighted");
        item.scrollIntoView({ block: "nearest" });
      } else {
        item.classList.remove("highlighted");
      }
    });
  }

  function closeAutocomplete() {
    autocompleteDropdown.classList.remove("open");
    autocompleteDropdown.innerHTML = "";
    activeAutocompleteIndex = -1;
  }

  // Close dropdown on click outside
  document.addEventListener("click", (e) => {
    if (!chatInput.contains(e.target) && !autocompleteDropdown.contains(e.target)) {
      closeAutocomplete();
    }
  });

  // -------------------------------------------------------------
  // Knowledge Base Modal (Accordion View)
  // -------------------------------------------------------------
  function renderKnowledgeBaseModal(filterCategory = "all", searchTerm = "") {
    modalBody.innerHTML = "";
    const categorized = botEngine.getCategories();

    let totalRendered = 0;

    Object.keys(categorized).forEach(category => {
      if (filterCategory !== "all" && category.toLowerCase() !== filterCategory.toLowerCase()) {
        return;
      }

      let faqs = categorized[category];
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        faqs = faqs.filter(f => 
          f.question.toLowerCase().includes(term) || 
          f.answer.toLowerCase().includes(term) ||
          f.keywords.some(k => k.toLowerCase().includes(term))
        );
      }

      if (!faqs.length) return;

      totalRendered += faqs.length;

      const catHeader = document.createElement("div");
      catHeader.className = "accordion-category-title";
      catHeader.textContent = category;
      modalBody.appendChild(catHeader);

      faqs.forEach(faq => {
        const item = document.createElement("div");
        item.className = "accordion-item";
        item.innerHTML = `
          <div class="accordion-header">
            <span>${escapeHtml(faq.question)}</span>
            <svg class="accordion-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          <div class="accordion-content">
            <div style="margin-bottom: 12px;">${faq.answer}</div>
            <button class="icon-btn primary ask-in-chat-btn" data-question="${escapeHtml(faq.question)}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              <span>Ask in Chat</span>
            </button>
          </div>
        `;

        // Toggle Accordion on click
        const header = item.querySelector(".accordion-header");
        header.addEventListener("click", () => {
          item.classList.toggle("open");
        });

        // Ask in chat button click
        const askBtn = item.querySelector(".ask-in-chat-btn");
        askBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          closeKnowledgeModal();
          handleUserMessageSubmission(faq.question);
        });

        modalBody.appendChild(item);
      });
    });

    if (totalRendered === 0) {
      modalBody.innerHTML = `
        <div style="text-align: center; padding: 40px; color: var(--text-muted);">
          <p>No matching FAQs found for "${escapeHtml(searchTerm)}".</p>
        </div>
      `;
    }
  }

  function openKnowledgeModalWithCategory(cat = "all") {
    modalSearchInput.value = "";
    renderKnowledgeBaseModal(cat, "");
    knowledgeModal.classList.add("active");
  }

  function closeKnowledgeModal() {
    knowledgeModal.classList.remove("active");
  }

  openKnowledgeModalBtn.addEventListener("click", () => openKnowledgeModalWithCategory("all"));
  closeKnowledgeModalBtn.addEventListener("click", closeKnowledgeModal);

  knowledgeModal.addEventListener("click", (e) => {
    if (e.target === knowledgeModal) closeKnowledgeModal();
  });

  modalSearchInput.addEventListener("input", (e) => {
    renderKnowledgeBaseModal("all", e.target.value.trim());
  });

  // -------------------------------------------------------------
  // Reset / Clear Conversation
  // -------------------------------------------------------------
  clearChatBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to reset the conversation?")) {
      // Remove all messages except typing indicator and welcome hero
      const messages = messagesContainer.querySelectorAll(".message-row:not(#typingIndicator)");
      messages.forEach(m => m.remove());
      if (welcomeHero) welcomeHero.style.display = "block";
      closeAutocomplete();
      chatInput.value = "";
      if (window.innerWidth <= 900) closeSidebar();
    }
  });

  // -------------------------------------------------------------
  // Init
  // -------------------------------------------------------------
  initTheme();
  populateSidebar();
});
