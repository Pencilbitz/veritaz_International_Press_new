// Best-effort parser for the free-text event date column (e.g.
// "15 to 19 June 2026", "20 - 24 Apr 2026", "27 Mar - 01 Apr 2026",
// "15 June 2026"). Returns the *start* date of the range as a Date, or
// null if nothing recognizable is found — used for sorting only, never
// for display (the original text is always shown as-is).
const MONTHS = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

export function parseEventStartDate(text) {
  if (!text || typeof text !== "string") return null;

  const dayMatch = text.match(/(\d{1,2})/);
  const monthMatch = text.match(/([A-Za-z]{3,9})/);
  const yearMatch = text.match(/(\d{4})/);

  if (dayMatch && yearMatch && monthMatch) {
    const key = monthMatch[1].slice(0, 3).toLowerCase();
    if (key in MONTHS) {
      const d = new Date(parseInt(yearMatch[1], 10), MONTHS[key], parseInt(dayMatch[1], 10));
      return isNaN(d.getTime()) ? null : d;
    }
  }

  const fallback = new Date(text);
  return isNaN(fallback.getTime()) ? null : fallback;
}

// Sorts events by parsed event date; entries with no parseable date sort last.
export function sortByEventDate(events, direction = "asc") {
  const withDates = events.map((e) => ({ e, d: parseEventStartDate(e.date) }));
  withDates.sort((a, b) => {
    if (!a.d && !b.d) return 0;
    if (!a.d) return 1;
    if (!b.d) return -1;
    return direction === "asc" ? a.d - b.d : b.d - a.d;
  });
  return withDates.map((x) => x.e);
}
