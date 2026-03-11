export interface VolumeSnapshot {
  mint: string;
  timestamp: number;
  volume24h: number;
  volumeChange: number;
  txCount: number;
  uniqueWallets: number;
  buyVolume: number;
  sellVolume: number;
  buyCount: number;
  sellCount: number;
  avgTradeSize: number;
  largestTrade: number;
  dex: string;
}

export interface CandleData {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  txCount: number;
}

export interface WashScore {
  mint: string;
  score: number;
  flags: WashFlag[];
  confidence: number;
}

export interface WashFlag {
  type: 'circular' | 'self_trade' | 'rapid_round_trip' | 'whale_ping_pong';
  severity: number;
  evidence: string;
}

export interface AnomalyEvent {
  mint: string;
  type: 'volume_spike' | 'volume_drop' | 'unusual_pattern' | 'new_wallet_surge';
  magnitude: number;
  timestamp: number;
  baseline: number;
  observed: number;
}

export interface TrackerConfig {
  rpc: string;
  pollIntervalMs?: number;
  dexes?: string[];
  wsEndpoint?: string;
}

export interface PoolInfo {
  address: string;
  dex: string;
  baseMint: string;
  quoteMint: string;
  baseReserve: number;
  quoteReserve: number;
  liquidity: number;
}

export type TimeWindow = '1h' | '4h' | '24h' | '7d' | '30d';
export type DexSource = 'raydium' | 'jupiter' | 'pumpswap' | 'orca';
