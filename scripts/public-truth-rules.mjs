export const truthRules = [
  [/shared[\s-]+phones?/i, '"Shared Phone" (say "Central Device")'],
  [/\bVerified\b/, '"Verified" badge or claim'],
  [/\b(Starter|Enterprise)\b/, "software tier name"],
  [/\bProfessional (plan|tier|package)\b/i, "software tier name"],
  [/Irongate|98\.6%|4\.8\s*\/\s*5|\b3:41\b|180\+\s*countries/i, "invented metric from the retired fake dashboard"],
  [/\b(Toronto|Vancouver|Montreal|Calgary|Ottawa|New York|Chicago|Los Angeles|San Francisco|Seattle|Boston|Dallas|Houston|Miami)\b/, "overseas city name"],
];
