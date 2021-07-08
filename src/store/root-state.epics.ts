import ReactNativeBiometrics from 'react-native-biometrics';
import Keychain from 'react-native-keychain';
import { combineEpics } from 'redux-observable';
import { EMPTY, from, Observable } from 'rxjs';
import { concatMap, distinctUntilKeyChanged, map, mapTo, switchMap, withLatestFrom } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { emptyWalletAccount } from '../interfaces/wallet-account.interface';
import { globalNavigationRef } from '../navigator/root-stack';
import { APP_IDENTIFIER } from '../shelter/shelter';
import { tezos$ } from '../utils/network/network.util';
import { ReadOnlySigner } from '../utils/read-only.signer.util';
import { RootState } from './create-store';
import { keychainResetSuccessAction, rootStateResetAction, untypedNavigateAction } from './root-state.actions';

const rootStateResetEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(rootStateResetAction),
    switchMap(() =>
      from(ReactNativeBiometrics.deleteKeys()).pipe(
        switchMap(() => Keychain.getAllGenericPasswordServices()),
        map(services => services.filter(service => service.startsWith(APP_IDENTIFIER))),
        switchMap(services => from(services).pipe(switchMap(service => Keychain.resetGenericPassword({ service })))),
        mapTo(keychainResetSuccessAction())
      )
    )
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
