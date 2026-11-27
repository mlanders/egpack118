// Drops whole lines that carry a personal payment handle, e.g. "Venmo: @name" or "Zelle: Name 555-0100".
const PAYMENT_LINE = /^.*(\b(venmo|zelle|paypal|cash ?app)\s*:|\b(venmo\.com|paypal\.me|cash\.app)\/).*(\n|$)/gim;

/** @param {string} text */
export function stripPaymentHandles(text) {
  return text.replace(PAYMENT_LINE, "");
}
