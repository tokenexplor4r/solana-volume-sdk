import { WashDetector } from '../src/analytics/wash';

describe('WashDetector', () => {
  it('should detect rapid round trips', () => {
    const detector = new WashDetector();
    const trades = [
      { wallet: 'sus', direction: 'buy' as const, amount: 5, timestamp: 1000, signature: 's1' },
      { wallet: 'sus', direction: 'sell' as const, amount: 5, timestamp: 2000, signature: 's2' },
    ];
    const result = detector.analyze('mint', trades);
    expect(result.flags.some(f => f.type === 'rapid_round_trip')).toBe(true);
  });

  it('should return low score for clean trades', () => {
    const detector = new WashDetector();
    const trades = Array.from({ length: 20 }, (_, i) => ({
      wallet: `wallet_${i}`,
      direction: (i % 2 === 0 ? 'buy' : 'sell') as 'buy' | 'sell',
      amount: Math.random() * 10,
      timestamp: Date.now() - i * 60000,
      signature: `sig_${i}`,
    }));
    const result = detector.analyze('mint', trades);
    expect(result.score).toBeLessThan(50);
  });
});
