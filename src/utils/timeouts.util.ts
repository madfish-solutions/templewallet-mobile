export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const rejectOnTimeout = <R>(promise: Promise<R>, timeout: number, timeoutRejectValue: unknown): Promise<R> =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(timeoutRejectValue), timeout))
  ]) as Promise<R>;
