/* (!) Numeric Separators (underscores, as in `1_000`) are not supported */

const BLOCK_DURATION = 15000;

export const METADATA_SYNC_INTERVAL = 4 * BLOCK_DURATION;

export const BALANCES_SYNC_INTERVAL = 3 * BLOCK_DURATION;

export const ONE_MINUTE = 60000;

const LONG_INTERVAL = 5 * ONE_MINUTE;

export const RATES_SYNC_INTERVAL = LONG_INTERVAL;

export const NOTIFICATIONS_SYNC_INTERVAL = LONG_INTERVAL;
