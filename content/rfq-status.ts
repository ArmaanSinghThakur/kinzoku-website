// Text of the buyer's private status page (/rfq/status/…) and of the two emails sent for each quote
// request (Step 16). Status names are the plan's: Received → In review → Quote sent → Closed.

export const rfqStatuses = {
  received: "Received",
  in_review: "In review",
  quote_sent: "Quote sent",
  closed: "Closed",
} as const;

export const statusPage = {
  meta: { title: "Your request" },
  title: "Request",
  received: (date: string) => `Received on ${date}`,
  stepsTitle: "Status",
  current: "current",
  summaryTitle: "Your request",
  questions: {
    title: "Questions about this request?",
    text: (reference: string) => `Email or WhatsApp us and mention your reference ${reference}.`,
    email: "Email us",
    whatsapp: "Send on WhatsApp",
    whatsappMessage: (reference: string) => `Hello Kinzoku, about my request ${reference}: `,
  },
  private: "This page is private: anyone with its link can see it, so please don't share the link.",
  chat: {
    title: "Messages",
    intro: "Ask the sales team anything about this request; the replies appear here.",
    empty: "No messages yet.",
    you: "You",
    them: (name: string | null) => (name ? `${name}, Kinzoku` : "Kinzoku"),
    typing: "Kinzoku is typing…",
    placeholder: "Write a message…",
    label: "Your message",
    send: "Send",
    sending: "Sending…",
    waiting: "Not sent yet: it goes out as soon as the connection is back.",
    sent: "Sent",
    read: "Read",
    live: "Connected",
    offline: "Reconnecting…",
    tooLong: (max: number) => `Please keep a message under ${max} characters.`,
    rateLimited: "Please wait a moment before sending more messages.",
    failed: "This message could not be sent. Please try again.",
    hint: "Enter sends, Shift + Enter starts a new line.",
  },
};

export const emails = {
  buyer: {
    subject: (reference: string) => `Your quote request ${reference} – Kinzoku`,
    greeting: (name: string) => `Dear ${name},`,
    thanks: (reference: string) => `Thank you for your request. We have received it under the reference ${reference}.`,
    next: "We return a preliminary assessment and transparent quote within 48 hours.",
    follow: "Follow your request here:",
    button: "View your request",
    private: "This link is private: anyone who has it can see your request.",
    summary: "Your request",
    signOff: "Kind regards,",
    why: "You receive this email because you sent a quote request on kinzokutrade.com.",
  },
  sales: {
    subject: (reference: string, type: string, company: string) => `New request ${reference}: ${type} – ${company}`,
    intro: (reference: string, date: string) => `New quote request ${reference}, received ${date}.`,
    reply: "Reply to this email to answer the buyer directly.",
    open: "Open in the admin area:",
    filesAttached: "The files are attached.",
    filesTooLarge: "The files are too large to attach; they are saved with the request on the server.",
    received: "Received",
    files: "Files",
  },
};
