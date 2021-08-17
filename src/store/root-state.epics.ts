import Keychain from 'react-native-keychain';
import { combineEpics } from 'redux-observable';
import { EMPTY, forkJoin, from, Observable } from 'rxjs';
import { concatMap, distinctUntilKeyChanged, map, mapTo, switchMap, withLatestFrom } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { BeaconHandler } from '../beacon/beacon-handler';
import { emptyWalletAccount } from '../interfaces/wallet-account.interface';
import { globalNavigationRef } from '../navigator/root-stack';
import { getKeychainOptions } from '../utils/keychain.utils';
import { tezosToolkit$ } from '../utils/network/tezos-toolkit.utils';
import { ReadOnlySigner } from '../utils/read-only.signer.util';
import { RootState } from './create-store';
import { rootStateResetAction, untypedNavigateAction } from './root-state.actions';

const rootStateResetEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(rootStateResetAction.submit),
    withLatestFrom(state$, (_, state) =>
      state.wallet.accounts.map(({ publicKeyHash }) => getKeychainOptions(publicKeyHash))
    ),
    switchMap(keychainOptionsArray =>
      from(keychainOptionsArray).pipe(switchMap(options => Keychain.resetGenericPassword(options)))
    ),
    switchMap(() => forkJoin([BeaconHandler.removeAllPermissions(), BeaconHandler.removeAllPeers()])),
    mapTo(rootStateResetAction.success())
  );

const navigateEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(untypedNavigateAction),
    toPayload(),
    concatMap(navigationArgs => {
      globalNavigationRef.current?.navigate(...navigationArgs);

      return EMPTY;
    })
  );

const tezosSignerProviderEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  state$.pipe(
    map(state => ({ selectedAccountPublicKeyHash: state.wallet.selectedAccountPublicKeyHash, state })),
    distinctUntilKeyChanged('selectedAccountPublicKeyHash'),
    withLatestFrom(tezosToolkit$),
    switchMap(([{ selectedAccountPublicKeyHash, state }, tezosToolkit]) => {
      const selectedAccount =
        state.wallet.accounts.find(({ publicKeyHash }) => publicKeyHash === selectedAccountPublicKeyHash) ??
        emptyWalletAccount;

      tezosToolkit.setSignerProvider(new ReadOnlySigner(selectedAccount.publicKeyHash, selectedAccount.publicKey));

      return EMPTY;
    })
  );

export const rootStateEpics = combineEpics(rootStateResetEpic, navigateEpic, tezosSignerProviderEpic);
