export const getBrokenImageSize = (isBigSize: boolean) => ({
  width: isBigSize ? 72 : 38,
  height: isBigSize ? 90 : 48
});
