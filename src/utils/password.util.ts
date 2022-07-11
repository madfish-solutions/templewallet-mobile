const checkTime = (i: number) => (i < 10 ? '0' + i : i);

/**
 *
 * @param start is a Date.now() or other Date instance with .getTime() callee
 * @param end is a ms passed by after start
 * @returns string with format 'dd:dd'
 */
export const getTimeLeft = (start: number, end: number) => {
  const isPositiveTime = start + end - Date.now() < 0 ? 0 : start + end - Date.now();
  const diff = isPositiveTime / 1000;
  const seconds = Math.floor(diff % 60);
  const minutes = Math.floor(diff / 60);

  return `${checkTime(minutes)}:${checkTime(seconds)}`;
};
