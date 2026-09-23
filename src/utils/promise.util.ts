import { noop } from 'lodash-es';

interface CancellablePromiseFlowParams<T> {
  promise: Promise<T>;
  isCancelled: () => boolean;
  then?: SyncFn<T>;
  catch?: SyncFn<unknown>;
  finally?: SyncFn<void>;
}

export const cancellablePromiseFlow = <T>({
  promise,
  isCancelled,
  then,
  catch: catchFn = noop,
  finally: finallyFn
}: CancellablePromiseFlowParams<T>) =>
  promise
    .then(res => {
      if (!isCancelled()) {
        then?.(res);
      }
    })
    .catch(err => {
      if (!isCancelled()) {
        catchFn?.(err);
      }
    })
    .finally(() => {
      if (!isCancelled()) {
        finallyFn?.();
      }
    });
