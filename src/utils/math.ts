export const clamp = (x: number, min = 0, max = 100) =>
  Math.max(min, Math.min(max, x));