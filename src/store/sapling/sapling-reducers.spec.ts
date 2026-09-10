import { cacheSaplingCredentialsAction, setShieldedBalanceLoadingAction } from './sapling-actions';
import { saplingReducers } from './sapling-reducers';

it('should cache credentials for all imported accounts', () => {
  const credentials = [
    { publicKeyHash: 'tz1First', saplingAddress: 'zet1First', viewingKey: 'firstViewingKey' },
    { publicKeyHash: 'tz1Second', saplingAddress: 'zet1Second', viewingKey: 'secondViewingKey' }
  ];
  const state = saplingReducers(undefined, cacheSaplingCredentialsAction(credentials));

  expect(state.accountsRecord.tz1First).toMatchObject({
    saplingAddress: 'zet1First',
    viewingKey: 'firstViewingKey',
    isCredentialsLoaded: true
  });
  expect(state.accountsRecord.tz1Second).toMatchObject({
    saplingAddress: 'zet1Second',
    viewingKey: 'secondViewingKey',
    isCredentialsLoaded: true
  });
});

it('should mark only the requested shielded balance as loading', () => {
  const credentials = [
    { publicKeyHash: 'tz1First', saplingAddress: 'zet1First', viewingKey: 'firstViewingKey' },
    { publicKeyHash: 'tz1Second', saplingAddress: 'zet1Second', viewingKey: 'secondViewingKey' }
  ];
  const cachedState = saplingReducers(undefined, cacheSaplingCredentialsAction(credentials));
  const state = saplingReducers(cachedState, setShieldedBalanceLoadingAction('tz1First'));

  expect(state.accountsRecord.tz1First.isBalanceLoading).toBe(true);
  expect(state.accountsRecord.tz1Second.isBalanceLoading).toBe(false);
});
