import { Connection, PublicKey } from '@solana/web3.js';
import { PoolInfo } from '../types';

export class PoolResolver {
  private connection: Connection;
  private cache: Map<string, PoolInfo[]> = new Map();

  constructor(connection: Connection) { this.connection = connection; }

  async resolve(mint: string): Promise<PoolInfo[]> {
    if (this.cache.has(mint)) return this.cache.get(mint)!;
    const pools = await this.findPools(mint);
    this.cache.set(mint, pools);
    return pools;
  }

  private async findPools(mint: string): Promise<PoolInfo[]> {
    try {
      const accounts = await this.connection.getProgramAccounts(
        new PublicKey('675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8'),
        { filters: [{ dataSize: 752 }] }
      );
      return accounts.slice(0, 5).map(a => ({
        address: a.pubkey.toString(), dex: 'raydium', baseMint: mint,
        quoteMint: 'So11111111111111111111111111111111111111112',
        baseReserve: 0, quoteReserve: 0, liquidity: 0,
      }));
    } catch { return []; }
  }

  clearCache(): void { this.cache.clear(); }
}
