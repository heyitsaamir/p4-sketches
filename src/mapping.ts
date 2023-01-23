type MapFn = (value: number, start1: number, end1: number, start2: number, end2: number) => number;

const getArgs = (value: number, start1: number, end1: number, start2: number, end2: number): { b: number; c: number; t: number; d: number } => {
  const b = start2; // new start value
  const c = (end2 - start2); // new range
  const t = (value - start1); // change in value
  const d = (end1 - start1);  // initial range
  return { b, t, c, d };
}

export const linear: MapFn = (...args) => {
  const { c, t, d, b } = getArgs(...args);
  return c * t / d + b;
}

export const easeInOutCubic: MapFn = (...args) => {
  let { c, t, d, b } = getArgs(...args);
  t /= d / 2;
  if (t < 1) return c / 2 * t * t * t + b;
  t -= 2;
  return c / 2 * (t * t * t + 2) + b;
}

export const easeInOutSin: MapFn = (...args) => {
  let { c, t, d, b } = getArgs(...args);
  return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
}