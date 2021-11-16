export const getTransactionTimeoutDate = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 20);

  return now.toISOString();
};
