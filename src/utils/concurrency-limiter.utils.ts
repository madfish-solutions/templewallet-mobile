export class ConcurrencyLimiter {
  private available: number;
  private readonly queue: EmptyFn[] = [];

  constructor(maxConcurrency: number) {
    this.available = maxConcurrency;
  }

  acquire(): Promise<EmptyFn> {
    const release = () => this.release();

    if (this.available > 0) {
      this.available--;

      return Promise.resolve(release);
    }

    return new Promise<EmptyFn>(resolve => {
      this.queue.push(() => resolve(release));
    });
  }

  private release() {
    const next = this.queue.shift();

    if (next) {
      next();
    } else {
      this.available++;
    }
  }
}
