/**
 * Deterministic number formatting. Intl's en-ZA output differs between the
 * Node and browser ICU builds (separator characters, decimal comma), which
 * breaks hydration, so we format by hand: "R12 345,50" style, non-breaking space.
 */
export function num(value: number): string {
  const [whole, fraction] = value.toFixed(2).split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return fraction === "00" ? grouped : grouped + "," + fraction;
}

export function rand(value: number): string {
  return "R" + num(value);
}
