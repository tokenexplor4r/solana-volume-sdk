import { CandleData } from '../types';

export class CandleDetector {
  private history: CandleData[] = [];

  addCandle(c: CandleData): void {
    this.history.push(c);
    if (this.history.length > 500) this.history.shift();
  }

  detectHammer(): CandleData | null {
    const c = this.last(); if (!c) return null;
    const body = Math.abs(c.close - c.open);
    const lower = Math.min(c.open, c.close) - c.low;
    return lower > body * 2 ? c : null;
  }

  detectDoji(): CandleData | null {
    const c = this.last(); if (!c) return null;
    const body = Math.abs(c.close - c.open);
    const range = c.high - c.low;
    return range > 0 && body / range < 0.1 ? c : null;
  }

  detectVolumeSpike(threshold: number = 3): CandleData | null {
    if (this.history.length < 10) return null;
    const recent = this.history.slice(-10, -1);
    const avg = recent.reduce((s, c) => s + c.volume, 0) / recent.length;
    const last = this.last()!;
    return last.volume > avg * threshold ? last : null;
  }

  private last(): CandleData | null {
    return this.history.length > 0 ? this.history[this.history.length - 1] : null;
  }
}
