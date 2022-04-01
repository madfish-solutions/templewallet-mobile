const checkTime = (i: number) => (i < 10 ? '0' + i : i);

export const getTimeLeft = (start: number, end: number) => {
  const isPositiveTime = start + end - Date.now() < 0 ? 0 : start + end - Date.now();
  const diff = isPositiveTime / 1000;
  const seconds = Math.floor(diff % 60);
  const minutes = Math.floor(diff / 60);

  return `${checkTime(minutes)}:${checkTime(seconds)}`;
};
