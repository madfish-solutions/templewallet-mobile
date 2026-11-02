import { Action } from '@reduxjs/toolkit';
import { StateObservable } from 'redux-observable';
import { Subject } from 'rxjs';

import { Route3TraditionalSwapParamsResponse } from 'src/interfaces/route3.interface';
import { mockRootState } from 'src/store/root-state.mock';
import { RootState } from 'src/store/types';
import { fetchRoute3SwapParams } from 'src/utils/route3.util';

import { loadSwapParamsAction, resetSwapParamsAction } from './swap-actions';
import { swapEpics } from './swap-epics';
import { DEFAULT_SWAP_PARAMS } from './swap-state.mock';

jest.mock('src/utils/route3.util', () => ({
  ...jest.requireActual('src/utils/route3.util'),
  fetchRoute3SwapParams: jest.fn()
}));

const deferredQuote = () => {
  let resolve: (quote: Route3TraditionalSwapParamsResponse) => void = () => undefined;
  const promise = new Promise<Route3TraditionalSwapParamsResponse>(done => {
    resolve = done;
  });

  return { promise, resolve };
};

const request = loadSwapParamsAction.submit({ fromSymbol: 'XTZ', toSymbol: 'TOKEN', amount: '1', toTokenDecimals: 6 });

describe('Tezos quote reset', () => {
  it('discards a pending quote after a network change', async () => {
    const quote = deferredQuote();
    jest.mocked(fetchRoute3SwapParams).mockReturnValueOnce(quote.promise);
    const actions = new Subject<Action>();
    const state = new StateObservable(new Subject<RootState>(), mockRootState);
    const emitted: Action[] = [];
    const subscription = swapEpics(actions, state, undefined).subscribe(action => emitted.push(action));

    actions.next(request);
    actions.next(resetSwapParamsAction());
    quote.resolve({ ...DEFAULT_SWAP_PARAMS, input: '1', output: '2' });
    await quote.promise;
    expect(emitted).toEqual([]);

    subscription.unsubscribe();
  });

  it('accepts a new pair quote after a reset and discards the previous quote', async () => {
    const previous = deferredQuote();
    const current = deferredQuote();
    jest.mocked(fetchRoute3SwapParams).mockReturnValueOnce(previous.promise).mockReturnValueOnce(current.promise);
    const actions = new Subject<Action>();
    const state = new StateObservable(new Subject<RootState>(), mockRootState);
    const emitted: Action[] = [];
    const subscription = swapEpics(actions, state, undefined).subscribe(action => emitted.push(action));
    const response = { ...DEFAULT_SWAP_PARAMS, input: '2', output: '3' };

    actions.next(request);
    actions.next(resetSwapParamsAction());
    actions.next(request);
    current.resolve(response);
    await current.promise;
    previous.resolve({ ...DEFAULT_SWAP_PARAMS, input: '1', output: '2' });
    await previous.promise;
    expect(emitted).toEqual([loadSwapParamsAction.success(response)]);

    subscription.unsubscribe();
  });
});
