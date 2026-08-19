import { isDefined } from 'src/utils/is-defined';

/** Converts a USD-denominated asset rate into the selected fiat currency rate. */
export const getFiatExchangeRate = (usdRate?: number, fiatToUsdRate?: number): number | undefined =>
  isDefined(usdRate) && isDefined(fiatToUsdRate) ? usdRate * fiatToUsdRate : undefined;
