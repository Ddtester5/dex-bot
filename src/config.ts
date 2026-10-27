
export interface DexCoinConfig {
  SYMBOL: string;
  TOKEN_MINT: string;
  POOL_ADDRESS: string;

  // Только параметры будущей бумажной торговли
  USDC_QUANTITY: number;
  STOP_LOSS_PCT: number;
  BUY_RANGE: number;
  SELL_RANGE: number;

  MIN_NOTIONAL: number;
  TRADE_INTERVAL_MS: number;
  INTERVAL_AFTER_STOPLOSS_MS: number;
  ORDER_TIMEOUT_MS: number;

  ANALIZE_INTERVAL_CANDLES: number;
  CANDLES_INTERVAL: "1m" | "5m" | "10m" | "15m" | "1h";
  LOOCAL_LOOKBACK: number;

  MIN_RANGE_PCT: number;
  MAX_RANGE_PCT: number;
}

export const QUOTE_TOKEN = {
  SYMBOL: "USDC",
  MINT: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
} as const;

// Флаг сам по себе не защищает от транзакций.
// На этом этапе код исполнения сделок не подключаем.
export const PAPER_TRADING = true;

export const COINS_CONFIG: DexCoinConfig[] = [
  {
    SYMBOL: "MANIFEST", // отображаемый тикер; идентичность задаётся mint
    TOKEN_MINT:
      "BCdwQBAn8dYB5YjTsoB6TdHAWokxv28k2oZUodERpump",
    POOL_ADDRESS:
      "2DVbU5h8JCd37gaXAJUZ4t77HsjJW22LLduTZk7GSa43",

    USDC_QUANTITY: 5,
    STOP_LOSS_PCT: 5,
    BUY_RANGE: 0.05,
    SELL_RANGE: 0.75,

    MIN_NOTIONAL: 1.5,
    TRADE_INTERVAL_MS: 60_000,
    INTERVAL_AFTER_STOPLOSS_MS: 300_000,
    ORDER_TIMEOUT_MS: 60_000,

    ANALIZE_INTERVAL_CANDLES: 2,
    CANDLES_INTERVAL: "15m",
    LOOCAL_LOOKBACK: 2,

    MIN_RANGE_PCT: 1,
    MAX_RANGE_PCT: 20,
  },
];
