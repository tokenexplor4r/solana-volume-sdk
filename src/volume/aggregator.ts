import { VolumeSnapshot, TimeWindow } from '../types';

interface ParsedTrade {
  timestamp: number; direction: 'buy' | 'sell'; amountSol: number;
  amountToken: number; wallet: string; dex: string; signature: string;
}

export class VolumeAggregator {
  aggregate(mint: string, trades: ParsedTrade[], window: TimeWindow): VolumeSnapshot {
    const wallets = new Set(trades.map(t => t.wallet));
    const buys = trades.filter(t => t.direction === 'buy');
    const sells = trades.filter(t => t.direction === 'sell');
    const buyVol = buys.reduce((s, t) => s + t.amountSol, 0);
    const sellVol = sells.reduce((s, t) => s + t.amountSol, 0);
    const total = buyVol + sellVol;
    const sizes = trades.map(t => t.amountSol);
    return {
      mint, timestamp: Date.now(), volume24h: total, volumeChange: 0,
      txCount: trades.length, uniqueWallets: wallets.size,
      buyVolume: buyVol, sellVolume: sellVol,
      buyCount: buys.length, sellCount: sells.length,
      avgTradeSize: total / (trades.length || 1),
      largestTrade: Math.max(...sizes, 0), dex: 'all',
    };
  }

  bucketize(trades: ParsedTrade[], intervalMs: number): Map<number, ParsedTrade[]> {
    const buckets = new Map<number, ParsedTrade[]>();
    for (const t of trades) {
      const k = Math.floor(t.timestamp / intervalMs) * intervalMs;
      if (!buckets.has(k)) buckets.set(k, []);
      buckets.get(k)!.push(t);
    }
    return buckets;
  }
}
