# solana-volume-sdk

TypeScript SDK for tracking and analyzing volume patterns on Solana DEXs.

## Install

```bash
npm install solana-volume-sdk
```

## Usage

```typescript
import { VolumeTracker } from 'solana-volume-sdk';

const tracker = new VolumeTracker({ rpc: 'https://api.mainnet-beta.solana.com' });

const volume = await tracker.getVolume('TOKEN_MINT', '24h');
console.log(volume);
```

## Features

- Real-time volume tracking across Raydium, Jupiter, PumpSwap
- Historical volume aggregation
- Candle pattern detection
- Wash trading detection
- Volume anomaly alerts
