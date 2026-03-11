import { VolumeAggregator } from '../src/volume/aggregator';

describe('VolumeAggregator', () => {
  const agg = new VolumeAggregator();

  it('should aggregate empty trades', () => {
    const result = agg.aggregate('mint123', [], '24h');
    expect(result.txCount).toBe(0);
    expect(result.volume24h).toBe(0);
  });

  it('should count unique wallets', () => {
    const trades = [
      { timestamp: 1, direction: 'buy' as const, amountSol: 1, amountToken: 100, wallet: 'a', dex: 'raydium', signature: 's1' },
      { timestamp: 2, direction: 'sell' as const, amountSol: 0.5, amountToken: 50, wallet: 'a', dex: 'raydium', signature: 's2' },
      { timestamp: 3, direction: 'buy' as const, amountSol: 2, amountToken: 200, wallet: 'b', dex: 'raydium', signature: 's3' },
    ];
    const result = agg.aggregate('mint123', trades, '24h');
    expect(result.uniqueWallets).toBe(2);
    expect(result.txCount).toBe(3);
  });
});
