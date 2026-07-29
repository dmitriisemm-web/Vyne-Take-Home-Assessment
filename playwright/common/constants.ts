export const TAGS = {
  FUNCTIONAL: '@functional',
  SMOKE: '@smoke',
  REGRESSION: '@regression'
} as const;

export const TIMEOUT = {
  FIVE_SECONDS: 5_000,
  TEN_SECONDS: 10_000,
  FIFTEEN_SECONDS: 15_000,
  THIRTY_SECONDS: 30_000,
  ONE_MINUTE: 60_000
} as const;
