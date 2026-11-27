// BAND tags each event "(First Last added)". Those tags tell us which full names to shorten,
// without keeping a list of last names in the repo.
// shortcut: only catches people who have added an event; add a name list if others slip through.
// The second branch catches names typed without a space ("JaneDoe").
const ADDED_BY = /\(([A-Z][^\s()]*?)(?:(?: [^\s()]+)*? |(?<=[a-z]))([A-Z])([^\s()]*) added\)/g;

/** @param {string} text */
export function abbreviateNames(text) {
  for (const [tag, first, initial] of [...text.matchAll(ADDED_BY)]) {
    const fullName = tag.slice(1, -" added)".length);
    text = text.replaceAll(fullName, `${first} ${initial}.`);
  }
  return text;
}
