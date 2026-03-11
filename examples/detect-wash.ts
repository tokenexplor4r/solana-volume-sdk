import { WashDetector } from '../src';

const detector = new WashDetector();

const fakeTrades = Array.from({ length: 50 }, (_, i) => ({
  wallet: i % 3 === 0 ? 'walletA' : i % 3 === 1 ? 'walletB' : 'walletC',
  direction: (i % 2 === 0 ? 'buy' : 'sell') as 'buy' | 'sell',
  amount: Math.random() * 10,
  timestamp: Date.now() - (50 - i) * 2000,
  signature: `sig_${i}`,
}));

const result = detector.analyze('exampleMint123', fakeTrades);
console.log(`Wash Score: ${result.score}/100`);
console.log(`Confidence: ${(result.confidence * 100).toFixed(0)}%`);
console.log(`Flags:`);
for (const flag of result.flags) {
  console.log(`  [${flag.type}] severity: ${flag.severity} — ${flag.evidence}`);
}
