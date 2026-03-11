import { Connection, PublicKey } from '@solana/web3.js';
import { TrackerConfig, VolumeSnapshot, TimeWindow } from '../types';
import { VolumeAggregator } from '../volume/aggregator';
import { DexParser } from '../volume/parser';
import { PoolResolver } from '../volume/pools';

export class VolumeTracker {
  private connection: Connection;
  private config: TrackerConfig;
  private aggregator: VolumeAggregator;
  private parser: DexParser;
  private pools: PoolResolver;
  private subscriptions: Map<string, number> = new Map();

  constructor(config: TrackerConfig) {
    this.config = config;
    this.connection = new Connection(config.rpc, 'confirmed');
    this.aggregator = new VolumeAggregator();
    this.parser = new DexParser();
    this.pools = new PoolResolver(this.connection);
  }

  async getVolume(mint: string, window: TimeWindow): Promise<VolumeSnapshot> {
    const pools = await this.pools.resolve(mint);
    const windowMs = this.windowToMs(window);
    const since = Date.now() - windowMs;
    const txs = await this.fetchTransactions(mint, since);
    const parsed = txs.map(tx => this.parser.parse(tx, pools));
    return this.aggregator.aggregate(mint, parsed, window);
  }

  async subscribe(mint: string, cb: (snap: VolumeSnapshot) => void): Promise<void> {
    const ms = this.config.pollIntervalMs || 30000;
    const id = setInterval(async () => { cb(await this.getVolume(mint, '1h')); }, ms) as unknown as number;
    this.subscriptions.set(mint, id);
  }

  unsubscribe(mint: string): void {
    const id = this.subscriptions.get(mint);
    if (id) { clearInterval(id); this.subscriptions.delete(mint); }
  }

  private async fetchTransactions(mint: string, since: number) {
    const sigs = await this.connection.getSignaturesForAddress(new PublicKey(mint), { limit: 1000 });
    const filtered = sigs.filter(s => (s.blockTime || 0) * 1000 >= since);
    return Promise.all(filtered.map(s =>
      this.connection.getTransaction(s.signature, { maxSupportedTransactionVersion: 0 })
    )).then(txs => txs.filter(Boolean));
  }

  private windowToMs(w: TimeWindow): number {
    return { '1h': 3600000, '4h': 14400000, '24h': 86400000, '7d': 604800000, '30d': 2592000000 }[w];
  }
}
