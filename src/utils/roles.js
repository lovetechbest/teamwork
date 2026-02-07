/**
 * Highman = Manager or Team Leader. Handles all role string variations.
 */
const HIGHMAN_VARIANTS = [
  'team leader',
  'teamleader',
  'team-leader',
  'manager',
];

export const isHighman = (role) => {
  if (!role) return false;
  const normalized = String(role).toLowerCase().trim();
  return HIGHMAN_VARIANTS.includes(normalized);
};
