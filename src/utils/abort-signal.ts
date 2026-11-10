import { isDefined } from './is-defined';

export const polyfillAbortSignal = (): void => {
  if (typeof AbortSignal === 'undefined') {
    return;
  }

  // p-queue calls throwIfAborted(), which RN's AbortSignal does not provide.
  if (typeof AbortSignal.prototype.throwIfAborted !== 'function') {
    AbortSignal.prototype.throwIfAborted = function (this: AbortSignal): void {
      if (this.aborted) {
        throw isDefined(this.reason) ? this.reason : new Error('Aborted');
      }
    };
  }

  // Beacon uses timeout() for relay discovery
  if (typeof AbortSignal.timeout === 'function') {
    return;
  }

  AbortSignal.timeout = (milliseconds: number): AbortSignal => {
    if (!Number.isInteger(milliseconds) || milliseconds < 0 || milliseconds > 2 ** 31 - 1) {
      throw new RangeError('The timeout must be an integer between 0 and 2147483647 milliseconds.');
    }

    const controller = new AbortController();
    setTimeout(() => {
      const reason = new Error('The operation timed out.');
      reason.name = 'TimeoutError';
      // RN's AbortController ignores abort reasons.
      if (!('reason' in controller.signal)) {
        Object.defineProperty(controller.signal, 'reason', { value: reason });
      }
      controller.abort(reason);
    }, milliseconds);

    return controller.signal;
  };
};
