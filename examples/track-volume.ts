import { VolumeTracker } from '../src';

async function main() {
  const tracker = new VolumeTracker({
    rpc: process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
  });

  const mint = process.argv[2];
  if (!mint) { console.error('usage: ts-node track-volume.ts <MINT>'); process.exit(1); }

  const volume = await tracker.getVolume(mint, '24h');
  console.log(`Token: ${volume.mint}`);
  console.log(`24h Volume: ${volume.volume24h.toFixed(2)} SOL`);
  console.log(`Transactions: ${volume.txCount}`);
  console.log(`Unique Wallets: ${volume.uniqueWallets}`);
  console.log(`Buy/Sell Ratio: ${volume.buyCount}/${volume.sellCount}`);
  console.log(`Avg Trade: ${volume.avgTradeSize.toFixed(4)} SOL`);
  console.log(`Largest: ${volume.largestTrade.toFixed(4)} SOL`);
}

main().catch(console.error);
