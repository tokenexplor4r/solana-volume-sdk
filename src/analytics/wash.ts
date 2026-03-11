import { WashScore, WashFlag } from '../types';

interface Trade { wallet: string; direction: 'buy' | 'sell'; amount: number; timestamp: number; signature: string; }

export class WashDetector {
  analyze(mint: string, trades: Trade[]): WashScore {
    const flags: WashFlag[] = [];
    const rt = this.detectRoundTrips(trades); if (rt) flags.push(rt);
    const st = this.detectSelfTrade(trades); if (st) flags.push(st);
    const score = Math.min(100, flags.reduce((s, f) => s + f.severity * 20, 0));
    return { mint, score, flags, confidence: Math.min(1, trades.length / 100) };
  }

  private detectRoundTrips(trades: Trade[]): WashFlag | null {
    const byWallet = new Map<string, Trade[]>();
    for (const t of trades) { if (!byWallet.has(t.wallet)) byWallet.set(t.wallet, []); byWallet.get(t.wallet)!.push(t); }
    for (const [w, wt] of byWallet) {
      for (let i = 0; i < wt.length - 1; i++) {
        if (wt[i].direction !== wt[i+1].direction && wt[i+1].timestamp - wt[i].timestamp < 5000)
          return { type: 'rapid_round_trip', severity: 5, evidence: w };
      }
    }
    return null;
  }

  private detectSelfTrade(trades: Trade[]): WashFlag | null {
    const act = new Map<string, {b: number; s: number}>();
    for (const t of trades) {
      const e = act.get(t.wallet) || {b:0,s:0};
      t.direction === 'buy' ? e.b++ : e.s++;
      act.set(t.wallet, e);
    }
    for (const [w, a] of act) {
      const ratio = Math.min(a.b, a.s) / Math.max(a.b, a.s, 1);
      if (ratio > 0.8 && a.b + a.s > 10) return { type: 'self_trade', severity: 4, evidence: w };
    }
    return null;
  }
}
