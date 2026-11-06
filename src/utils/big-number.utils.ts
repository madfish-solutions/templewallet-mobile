import BigNumber from 'bignumber.js';

/** bignumber.js rejects decimal-place arguments above this with "out of range". */
const MAX_DECIMAL_PLACES = 1e9;

const bigIntMax = (...args: BigNumber[]) => args.reduce((m, e) => (e.isGreaterThan(m) ? e : m));
const bigIntMin = (...args: BigNumber[]) => args.reduce((m, e) => (e.isLessThan(m) ? e : m));

export const bigIntClamp = (number: BigNumber, lower: BigNumber, upper: BigNumber) => {
  const lowerClampedValue = bigIntMax(number, lower);

  return bigIntMin(lowerClampedValue, upper);
};

/**
 * `shiftedBy`, `decimalPlaces`, and `toFixed` throw
 * `[BigNumber Error] Argument not an integer` when the places argument is NaN
 * or any other non-integer. `-undefined` is NaN, so a missing token `decimals`
 * crashes those calls.
 */
const isSafeShift = (value: number | nullish): value is number =>
  typeof value === 'number' &&
  Number.isInteger(value) &&
  value >= -Number.MAX_SAFE_INTEGER &&
  value <= Number.MAX_SAFE_INTEGER;

const isSafeDecimalPlaces = (value: number | nullish): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= MAX_DECIMAL_PLACES;

/** Leaves `value` unchanged when `places` would make `shiftedBy` throw. */
export const safeShiftedBy = (value: BigNumber, places: number | nullish): BigNumber => {
  if (!isSafeShift(places)) {
    return value;
  }

  return value.shiftedBy(places);
};

/** Leaves `value` unrounded when `decimalPlaces` would make `decimalPlaces` throw. */
export const safeDecimalPlaces = (
  value: BigNumber,
  decimalPlaces: number | nullish,
  roundingMode?: BigNumber.RoundingMode
): BigNumber => {
  if (!isSafeDecimalPlaces(decimalPlaces)) {
    return value;
  }

  return roundingMode === undefined
    ? value.decimalPlaces(decimalPlaces)
    : value.decimalPlaces(decimalPlaces, roundingMode);
};

/** Falls back to `toFixed()` with no places argument when `decimalPlaces` would make `toFixed` throw. */
export const safeToFixed = (
  value: BigNumber,
  decimalPlaces?: number | nullish,
  roundingMode?: BigNumber.RoundingMode
): string => {
  if (!isSafeDecimalPlaces(decimalPlaces)) {
    return value.toFixed();
  }

  return roundingMode === undefined ? value.toFixed(decimalPlaces) : value.toFixed(decimalPlaces, roundingMode);
};
