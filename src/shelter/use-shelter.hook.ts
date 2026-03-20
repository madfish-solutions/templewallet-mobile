import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { EMPTY, Subject } from 'rxjs';

import { useNavigation } from '../navigator/hooks/use-navigation.hook';
import { useSelectedRpcUrlSelector } from '../store/settings/settings-selectors';
import { useAccountsListSelector } from '../store/wallet/wallet-selectors';
import { useAnalytics } from '../utils/analytics/use-analytics.hook';

import { ImportWalletParams } from './interfaces/import-wallet-params.interface';
import { RevealSecretKeyParams } from './interfaces/reveal-secret-key-params.interface';
import { RevealSeedPhraseParams } from './interfaces/reveal-seed-phrase.params';
import { createHdAccountSubscription } from './utils/create-hd-account-subscription.util';
import { createImportAccountSubscription } from './utils/create-import-account-subscription.util';
import { enableBiometryPasswordSubscription } from './utils/enable-biometry-password-subscription.util';
import { importWalletSubscription } from './utils/import-wallet-subscription.util';
import { revealSecretsSubscription } from './utils/reveal-secrets-subscription.util';

export const useShelter = () => {
  const dispatch = useDispatch();
  const accounts = useAccountsListSelector();
  const { dispatch: navigationDispatch } = useNavigation();
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const { trackErrorEvent } = useAnalytics();

  const importWallet$ = useMemo(() => new Subject<ImportWalletParams>(), []);
  const createHdAccount$ = useMemo(() => new Subject(), []);
  const revealSecretKey$ = useMemo(() => new Subject<RevealSecretKeyParams>(), []);
  const revealSeedPhrase$ = useMemo(() => new Subject<RevealSeedPhraseParams>(), []);
  const enableBiometryPassword$ = useMemo(() => new Subject<string>(), []);
  const createImportedAccount$ = useMemo(() => new Subject<{ privateKey: string; name: string }>(), []);

  useEffect(() => {
    const subscriptions = [
      importWalletSubscription(importWallet$, dispatch),
      createHdAccountSubscription(createHdAccount$, accounts, dispatch),
      createImportAccountSubscription(
        createImportedAccount$,
        accounts,
        dispatch,
        navigationDispatch,
        selectedRpcUrl,
        (error, accountPkh) =>
          trackErrorEvent('CreateImportAccountError', error, accountPkh ? [accountPkh] : [], { selectedRpcUrl })
      ),
      revealSecretsSubscription(revealSecretKey$, revealSeedPhrase$, dispatch),
      enableBiometryPasswordSubscription(enableBiometryPassword$, dispatch)
    ];

    return () => subscriptions.forEach(subscription => subscription.unsubscribe());
  }, [
    dispatch,
    importWallet$,
    revealSecretKey$,
    createHdAccount$,
    accounts.length,
    revealSeedPhrase$,
    trackErrorEvent
  ]);

  const importWallet = (params: ImportWalletParams) => importWallet$.next(params);
  const createHdAccount = () => createHdAccount$.next(EMPTY);
  const revealSecretKey = (params: RevealSecretKeyParams) => revealSecretKey$.next(params);
  const revealSeedPhrase = (params: RevealSeedPhraseParams) => revealSeedPhrase$.next(params);

  const enableBiometryPassword = (password: string) => enableBiometryPassword$.next(password);

  const createImportedAccount = (params: { privateKey: string; name: string }) => createImportedAccount$.next(params);

  return {
    importWallet,
    createHdAccount,
    revealSecretKey,
    revealSeedPhrase,
    enableBiometryPassword,
    createImportedAccount
  };
};
