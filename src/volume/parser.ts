import { PoolInfo } from '../types';

const RAYDIUM_V4 = '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8';
const PUMP_PROGRAM = '6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P';
const JUPITER_V6 = 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4';

export class DexParser {
  parse(tx: any, pools: PoolInfo[]) {
    if (!tx?.meta) return null;
    const keys = tx.transaction.message.staticAccountKeys?.map((k: any) => k.toString()) || [];
    let dex = 'unknown';
    if (keys.includes(RAYDIUM_V4)) dex = 'raydium';
    else if (keys.includes(PUMP_PROGRAM)) dex = 'pumpswap';
    else if (keys.includes(JUPITER_V6)) dex = 'jupiter';
    const pre = tx.meta.preTokenBalances || [];
    const post = tx.meta.postTokenBalances || [];
    return {
      timestamp: (tx.blockTime || 0) * 1000,
      direction: this.inferDirection(pre, post) as 'buy' | 'sell',
      amountSol: this.computeSolDelta(tx),
      amountToken: this.computeTokenDelta(pre, post),
      wallet: keys[0] || '',
      dex,
      signature: tx.transaction.signatures?.[0] || '',
    };
  }

  private inferDirection(pre: any[], post: any[]): string { return 'buy'; }
  private computeSolDelta(tx: any): number { return Math.abs((tx.meta?.postBalances?.[0] || 0) - (tx.meta?.preBalances?.[0] || 0)) / 1e9; }
  private computeTokenDelta(pre: any[], post: any[]): number { return 0; }
}
