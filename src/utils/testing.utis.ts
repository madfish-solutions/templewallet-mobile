import { PartialObserver } from 'rxjs';

import { EventFn } from '../config/general';

export const rxJsTestingHelper = <T>(callback: EventFn<T>, done: jest.DoneCallback): PartialObserver<T> => ({
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
