import Keychain from 'react-native-keychain';
import { combineEpics } from 'redux-observable';
import { EMPTY, from, Observable } from 'rxjs';
import { concatMap, distinctUntilKeyChanged, map, switchMap, withLatestFrom, switchMapTo } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { BeaconHandler } from '../beacon/beacon-handler';
import { emptyWalletAccount } from '../interfaces/wallet-account.interface';
import { globalNavigationRef } from '../navigator/root-stack';
import { getKeychainOptions } from '../utils/keychain.utils';
import { tezos$ } from '../utils/network/network.util';
import { ReadOnlySigner } from '../utils/read-only.signer.util';
import { RootState } from './create-store';
import { resetAllPermissionsAction } from './d-apps/d-apps-actions';
import { rootStateResetAction, untypedNavigateAction } from './root-state.actions';

const rootStateResetEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(rootStateResetAction.submit),
    withLatestFrom(state$, (_, state) =>
      state.wallet.hdAccounts.map(({ publicKeyHash }) => getKeychainOptions(publicKeyHash))
    ),
    switchMap(keychainOptionsArray =>
      from(keychainOptionsArray).pipe(switchMap(options => Keychain.resetGenericPassword(options)))
    ),
    switchMap(() =>
      from(BeaconHandler.getPermissions()).pipe(
        switchMap(permissions =>
          from(permissions).pipe(
            switchMap(permission => from(BeaconHandler.removePermission(permission.accountIdentifier)))
          )
        )
      )
    ),
    switchMapTo([rootStateResetAction.success(), resetAllPermissionsAction()])
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
    withLatestFrom(tezos$),
    switchMap(([{ selectedAccountPublicKeyHash, state }, tezos]) => {
      const selectedAccount =
        state.wallet.hdAccounts.find(({ publicKeyHash }) => publicKeyHash === selectedAccountPublicKeyHash) ??
        emptyWalletAccount;

      tezos.setSignerProvider(new ReadOnlySigner(selectedAccount.publicKeyHash, selectedAccount.publicKey));

      return EMPTY;
    })
  );

export const rootStateEpics = combineEpics(rootStateResetEpic, navigateEpic, tezosSignerProviderEpic);
