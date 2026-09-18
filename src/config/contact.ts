// Contact configuration. The mailbox is NOT yet created externally (WAITING FOR DIANA) — production is blocked until it exists.
export const CONTACT = {
  email: 'info@ai-domain.ai',
  /** Endpoint of the Vercel function (api/contact.js). Fails gracefully when RESEND env vars are missing. */
  endpoint: '/api/contact',
  mailboxConfirmed: false, // set to true once Diana confirms the mailbox exists
};
