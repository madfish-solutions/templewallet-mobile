export const formatNumber = (number: number) => {
  if (number >= 1000000) {
    return new Intl.NumberFormat('en', {
      notation: 'compact',
      compactDisplay: 'short',
      minimumFractionDigits: 0
    }).format(number);
  } else if (number >= 10000) {
    return new Intl.NumberFormat('en', {
      notation: 'compact',
      compactDisplay: 'short',
      maximumSignificantDigits: 3
    }).format(number);
  }

  return number.toFixed(2);
};
