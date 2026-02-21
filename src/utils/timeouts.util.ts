export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const rejectOnTimeout = <R>(promise: Promise<R>, timeout: number, timeoutRejectValue: unknown) =>
  Promise.race([promise, new Promise<R>((_, reject) => setTimeout(() => reject(timeoutRejectValue), timeout))]);
