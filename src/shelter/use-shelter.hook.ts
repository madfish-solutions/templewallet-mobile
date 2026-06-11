import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { EMPTY, Subject } from 'rxjs';

import { useNavigation } from '../navigator/hooks/use-navigation.hook';
import { useSelectedRpcUrlSelector } from '../store/settings/settings-selectors';
import { useAllAccounts } from '../store/wallet/wallet-selectors';
import { useAnalytics } from '../utils/analytics/use-analytics.hook';

import { ImportWalletParams } from './interfaces/import-wallet-params.interface';
import { RevealSecretKeyParams } from './interfaces/reveal-secret-key-params.interface';
import { RevealSeedPhraseParams } from './interfaces/reveal-seed-phrase.params';
import {
  createAccountImportSubscriptions,
  CreateImportedChainAccountFromPrivateKeyParams,
  CreateImportedChainAccountFromSeedParams,
  CreateImportedMultichainAccountFromSeedParams
} from './utils/create-account-import-subscriptions.util';
import { createHdAccountSubscription } from './utils/create-hd-account-subscription.util';
import { enableBiometryPasswordSubscription } from './utils/enable-biometry-password-subscription.util';
import { importWalletSubscription } from './utils/import-wallet-subscription.util';
import { revealSecretsSubscription } from './utils/reveal-secrets-subscription.util';

export const useShelter = () => {
  const dispatch = useDispatch();
  const accounts = useAllAccounts();
  const { dispatch: navigationDispatch } = useNavigation();
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const { trackErrorEvent } = useAnalytics();

  const importWallet$ = useMemo(() => new Subject<ImportWalletParams>(), []);
  const createHdAccount$ = useMemo(() => new Subject(), []);
  const revealSecretKey$ = useMemo(() => new Subject<RevealSecretKeyParams>(), []);
  const revealSeedPhrase$ = useMemo(() => new Subject<RevealSeedPhraseParams>(), []);
  const enableBiometryPassword$ = useMemo(() => new Subject<string>(), []);
  const createImportedChainAccountFromPrivateKey$ = useMemo(
    () => new Subject<CreateImportedChainAccountFromPrivateKeyParams>(),
    []
  );
  const createImportedChainAccountFromSeed$ = useMemo(
    () => new Subject<CreateImportedChainAccountFromSeedParams>(),
    []
  );
  const createImportedMultichainAccountFromSeed$ = useMemo(
    () => new Subject<CreateImportedMultichainAccountFromSeedParams>(),
    []
  );

  useEffect(() => {
    const subscriptions = [
      importWalletSubscription(importWallet$, dispatch),
      createHdAccountSubscription(createHdAccount$, accounts, dispatch),
      createAccountImportSubscriptions(
        createImportedChainAccountFromPrivateKey$,
        createImportedChainAccountFromSeed$,
        createImportedMultichainAccountFromSeed$,
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
    accounts,
    createHdAccount$,
    createImportedChainAccountFromPrivateKey$,
    createImportedChainAccountFromSeed$,
    createImportedMultichainAccountFromSeed$,
    dispatch,
    enableBiometryPassword$,
    importWallet$,
    navigationDispatch,
    revealSecretKey$,
    revealSeedPhrase$,
    selectedRpcUrl,
    trackErrorEvent
  ]);

  const importWallet = useCallback((params: ImportWalletParams) => importWallet$.next(params), [importWallet$]);
  const createHdAccount = useCallback(() => createHdAccount$.next(EMPTY), [createHdAccount$]);
  const revealSecretKey = useCallback(
    (params: RevealSecretKeyParams) => revealSecretKey$.next(params),
    [revealSecretKey$]
  );
  const revealSeedPhrase = useCallback(
    (params: RevealSeedPhraseParams) => revealSeedPhrase$.next(params),
    [revealSeedPhrase$]
  );

  const enableBiometryPassword = (password: string) => enableBiometryPassword$.next(password);

  const createImportedChainAccountFromPrivateKey = useCallback(
    (params: CreateImportedChainAccountFromPrivateKeyParams) => createImportedChainAccountFromPrivateKey$.next(params),
    [createImportedChainAccountFromPrivateKey$]
  );

  const createImportedChainAccountFromSeed = useCallback(
    (params: CreateImportedChainAccountFromSeedParams) => createImportedChainAccountFromSeed$.next(params),
    [createImportedChainAccountFromSeed$]
  );

  const createImportedMultichainAccountFromSeed = useCallback(
    (params: CreateImportedMultichainAccountFromSeedParams) => createImportedMultichainAccountFromSeed$.next(params),
    [createImportedMultichainAccountFromSeed$]
  );

  return {
    importWallet,
    createHdAccount,
    revealSecretKey,
    revealSeedPhrase,
    enableBiometryPassword,
    createImportedChainAccountFromPrivateKey,
    createImportedChainAccountFromSeed,
    createImportedMultichainAccountFromSeed
  };
};
