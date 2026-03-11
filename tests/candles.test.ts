import { CandleDetector } from '../src/analytics/candles';

describe('CandleDetector', () => {
  it('should detect volume spike', () => {
    const detector = new CandleDetector();
    for (let i = 0; i < 9; i++) {
      detector.addCandle({ timestamp: i, open: 1, high: 1.1, low: 0.9, close: 1, volume: 100, txCount: 10 });
    }
    detector.addCandle({ timestamp: 10, open: 1, high: 1.5, low: 0.8, close: 1.3, volume: 500, txCount: 50 });
    expect(detector.detectVolumeSpike(3)).not.toBeNull();
  });

  it('should detect doji', () => {
    const detector = new CandleDetector();
    detector.addCandle({ timestamp: 1, open: 1.0, high: 1.2, low: 0.8, close: 1.001, volume: 100, txCount: 10 });
    expect(detector.detectDoji()).not.toBeNull();
  });
});
