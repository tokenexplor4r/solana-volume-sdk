export function formatSol(lamports: number): string { return (lamports / 1e9).toFixed(4); }
export function formatVolume(sol: number): string {
  if (sol >= 1e6) return (sol / 1e6).toFixed(2) + 'M SOL';
  if (sol >= 1e3) return (sol / 1e3).toFixed(2) + 'K SOL';
  return sol.toFixed(2) + ' SOL';
}
export function shortenAddress(addr: string, n: number = 4): string { return addr.slice(0, n) + '...' + addr.slice(-n); }
