export function windowToMs(w: string): number {
  const m = w.match(/^(\d+)(m|h|d)$/);
  if (!m) throw new Error('invalid: ' + w);
  return parseInt(m[1]) * ({m: 60000, h: 3600000, d: 86400000} as any)[m[2]];
}
export function bucketTs(ts: number, interval: number): number { return Math.floor(ts / interval) * interval; }
