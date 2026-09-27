/**
 * Predefined FAQ Knowledge Base
 * Each FAQ includes an ID, category, primary question, alternate questions/phrases, keywords, and formatted answer.
 */
const FAQ_DATABASE = [
  // --- General & Getting Started ---
  {
    id: "gen-1",
    category: "Getting Started",
    question: "What is this service and how does it work?",
    patterns: [
      "what is this service",
      "what is this website",
      "how does it work",
      "about this platform",
      "what do you do",
      "tell me about yourself",
      "what are you"
    ],
    keywords: ["about", "service", "overview", "platform", "work", "explain", "intro", "introduction"],
    answer: "Welcome! Our platform provides intelligent, automated customer assistance and knowledge discovery. You can ask any question in natural language, explore frequently asked questions by category, or find quick solutions to common technical and account problems.",
    related: ["gen-2", "gen-3"]
  },
  {
    id: "gen-2",
    category: "Getting Started",
    question: "Is there a free trial available?",
    patterns: [
      "free trial",
      "can i try for free",
      "do you offer a trial",
      "test before buying",
      "free demo"
    ],
    keywords: ["free", "trial", "demo", "test", "cost", "pricing", "free tier"],
    answer: "Yes! We offer a <strong>14-day free trial</strong> with full access to all premium features. No credit card is required to sign up.",
    related: ["bill-1", "gen-3"]
  },
  {
    id: "gen-3",
    category: "Getting Started",
    question: "How do I create a new account?",
    patterns: [
      "create account",
      "how to sign up",
      "register new account",
      "join",
      "sign up process",
      "new user"
    ],
    keywords: ["create", "account", "register", "signup", "sign up", "join", "new"],
    answer: "Creating an account is simple: <ol><li>Click the <strong>Sign Up</strong> button in the top right corner.</li><li>Enter your email address and choose a strong password.</li><li>Verify your email with the confirmation link we send you.</li><li>You're all set to get started!</li></ol>",
    related: ["acc-1", "acc-2"]
  },

  // --- Account & Security ---
  {
    id: "acc-1",
    category: "Account & Security",
    question: "How do I reset my password?",
    patterns: [
      "reset password",
      "forgot password",
      "change password",
      "cannot login",
      "cant log in",
      "recover password"
    ],
    keywords: ["password", "reset", "forgot", "login", "recover", "change", "credentials"],
    answer: "If you forgot your password: <ul><li>Go to the <strong>Login</strong> page and click <em>Forgot Password?</em></li><li>Enter your registered email address.</li><li>Check your inbox for a secure reset link (valid for 30 minutes).</li><li>Click the link and choose your new password.</li></ul>",
    related: ["acc-2", "acc-3"]
  },
  {
    id: "acc-2",
    category: "Account & Security",
    question: "How can I enable Two-Factor Authentication (2FA)?",
    patterns: [
      "enable 2fa",
      "two factor authentication",
      "two step verification",
      "setup 2fa",
      "mfa",
      "security settings"
    ],
    keywords: ["2fa", "two-factor", "mfa", "security", "authenticator", "verification", "protect"],
    answer: "To enable 2FA for enhanced account security: Navigate to <strong>Settings &gt; Security</strong>, toggle on <em>Two-Factor Authentication</em>, and scan the QR code using Google Authenticator, Authy, or your preferred authenticator app.",
    related: ["acc-1", "acc-3"]
  },
  {
    id: "acc-3",
    category: "Account & Security",
    question: "How do I update my profile details or email address?",
    patterns: [
      "change email",
      "update profile",
      "edit my name",
      "change personal details",
      "update account info"
    ],
    keywords: ["profile", "email", "name", "update", "edit", "details", "personal"],
    answer: "You can update your personal information by visiting <strong>Settings &gt; Profile</strong>. From there, you can change your name, avatar, and notification preferences. To update your email, a confirmation code will be sent to verify ownership.",
    related: ["acc-1"]
  },

  // --- Billing & Subscriptions ---
  {
    id: "bill-1",
    category: "Billing & Plans",
    question: "What payment methods do you accept?",
    patterns: [
      "payment methods",
      "how can i pay",
      "do you accept paypal",
      "credit cards accepted",
      "payment options",
      "upi",
      "stripe"
    ],
    keywords: ["payment", "pay", "credit card", "debit card", "paypal", "stripe", "visa", "mastercard"],
    answer: "We accept all major credit and debit cards (<strong>Visa, MasterCard, American Express</strong>), <strong>PayPal</strong>, <strong>Apple Pay</strong>, and <strong>Google Pay</strong>. Enterprise annual billing can also be arranged via wire transfer.",
    related: ["bill-2", "bill-3"]
  },
  {
    id: "bill-2",
    category: "Billing & Plans",
    question: "How do I upgrade, downgrade, or cancel my subscription?",
    patterns: [
      "cancel subscription",
      "upgrade plan",
      "downgrade plan",
      "stop subscription",
      "change plan",
      "end membership"
    ],
    keywords: ["cancel", "subscription", "upgrade", "downgrade", "plan", "membership", "billing"],
    answer: "You can manage your subscription anytime by navigating to <strong>Settings &gt; Billing &amp; Invoices</strong>. You can switch plans immediately, or cancel recurring renewal. You'll retain full access until the end of your current billing cycle.",
    related: ["bill-1", "bill-3"]
  },
  {
    id: "bill-3",
    category: "Billing & Plans",
    question: "What is your refund policy?",
    patterns: [
      "refund policy",
      "can i get a refund",
      "money back guarantee",
      "refund my money",
      "request refund"
    ],
    keywords: ["refund", "money back", "guarantee", "return", "policy", "reimbursement"],
    answer: "We offer a <strong>30-day money-back guarantee</strong> on all paid plans. If you are not satisfied with our service, contact our support team within 30 days of purchase and we will issue a full refund, no questions asked.",
    related: ["bill-1", "bill-2"]
  },

  // --- Features & Usage ---
  {
    id: "feat-1",
    category: "Features & Usage",
    question: "Can I export or download my data?",
    patterns: [
      "export data",
      "download my data",
      "backup data",
      "csv export",
      "json export",
      "data portability"
    ],
    keywords: ["export", "download", "backup", "data", "csv", "json", "save"],
    answer: "Yes, you own your data. Go to <strong>Settings &gt; Data &amp; Privacy</strong> and click <em>Export All Data</em>. You can download your data in JSON or CSV format at any time.",
    related: ["feat-2", "feat-3"]
  },
  {
    id: "feat-2",
    category: "Features & Usage",
    question: "Is there an API available for developers?",
    patterns: [
      "api access",
      "developer api",
      "rest api",
      "api documentation",
      "webhooks",
      "integrate with api"
    ],
    keywords: ["api", "developer", "webhook", "endpoints", "rest", "sdk", "integration"],
    answer: "Yes! We provide a comprehensive REST API and Webhooks for all Pro and Enterprise tiers. You can view our full interactive API documentation and generate API keys under <strong>Developer Settings</strong>.",
    related: ["feat-1", "tech-1"]
  },
  {
    id: "feat-3",
    category: "Features & Usage",
    question: "Does the app support dark mode and mobile devices?",
    patterns: [
      "dark mode",
      "mobile support",
      "mobile responsive",
      "theme switch",
      "phone app",
      "tablet"
    ],
    keywords: ["dark mode", "light mode", "theme", "mobile", "responsive", "ios", "android"],
    answer: "Yes! Our platform is 100% responsive across mobile, tablet, and desktop screens. You can also toggle between <strong>Light</strong> and <strong>Dark</strong> modes anytime using the theme switch icon in the top navigation bar.",
    related: ["gen-1"]
  },

  // --- Troubleshooting & Support ---
  {
    id: "tech-1",
    category: "Troubleshooting",
    question: "The website is running slowly or not loading properly. What should I do?",
    patterns: [
      "website slow",
      "not loading",
      "page frozen",
      "blank page",
      "troubleshoot browser",
      "clear cache"
    ],
    keywords: ["slow", "loading", "cache", "cookies", "freeze", "error", "blank", "browser"],
    answer: "Please try the following quick fixes: <ol><li>Clear your browser cache and cookies, then refresh the page.</li><li>Ensure you are using an updated version of Chrome, Firefox, Safari, or Edge.</li><li>Disable ad-blockers or browser extensions temporarily to rule out conflicts.</li><li>Check our status page to see if there is any scheduled maintenance.</li></ol>",
    related: ["tech-2"]
  },
  {
    id: "tech-2",
    category: "Troubleshooting",
    question: "How can I contact human customer support?",
    patterns: [
      "contact support",
      "human agent",
      "talk to a person",
      "customer service phone",
      "support email",
      "helpdesk"
    ],
    keywords: ["support", "contact", "human", "agent", "email", "phone", "helpdesk", "representative"],
    answer: "Need extra help? Our support team is available 24/7! <ul><li><strong>Email:</strong> support@faqbot-example.com</li><li><strong>Live Chat:</strong> Mon-Fri 9:00 AM - 8:00 PM EST</li><li><strong>Phone:</strong> +1 (800) 555-0199 (Enterprise users)</li></ul>",
    related: ["gen-1", "tech-1"]
  }
];

// Popular quick questions displayed as starter suggestions
const STARTER_PROMPTS = [
  "How do I reset my password?",
  "Is there a free trial?",
  "What payment methods do you accept?",
  "How can I contact human support?",
  "Can I export my data?"
];
