import { PartialObserver } from 'rxjs';

export const rxJsTestingHelper = <T>(
  callback: SyncFn<T> | AsyncFn<T>,
  done: jest.DoneCallback
): PartialObserver<T> => ({
  next: async data => {
    try {
      await callback(data);

      done();
    } catch (e) {
      done(e);
    }
  },
  error: e => done(e)
});
