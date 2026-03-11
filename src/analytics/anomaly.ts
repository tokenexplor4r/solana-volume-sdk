import { AnomalyEvent, VolumeSnapshot } from '../types';

export class AnomalyAlert {
  private baselines: Map<string, number[]> = new Map();

  record(snap: VolumeSnapshot): void {
    const h = this.baselines.get(snap.mint) || [];
    h.push(snap.volume24h);
    if (h.length > 30) h.shift();
    this.baselines.set(snap.mint, h);
  }

  check(snap: VolumeSnapshot): AnomalyEvent | null {
    const h = this.baselines.get(snap.mint);
    if (!h || h.length < 5) return null;
    const avg = h.reduce((s, v) => s + v, 0) / h.length;
    const std = Math.sqrt(h.reduce((s, v) => s + (v - avg) ** 2, 0) / h.length);
    if (snap.volume24h > avg + std * 3)
      return { mint: snap.mint, type: 'volume_spike', magnitude: (snap.volume24h - avg) / std, timestamp: Date.now(), baseline: avg, observed: snap.volume24h };
    if (snap.volume24h < avg - std * 2)
      return { mint: snap.mint, type: 'volume_drop', magnitude: (avg - snap.volume24h) / std, timestamp: Date.now(), baseline: avg, observed: snap.volume24h };
    return null;
  }
}
