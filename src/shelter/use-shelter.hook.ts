import { useCallback, useEffect, useMemo } from 'react';
import { EMPTY, Subject } from 'rxjs';

import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useAllAccounts } from 'src/store/wallet/wallet-selectors';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';

import { ImportWalletParams } from './interfaces/import-wallet-params.interface';
import { RevealSecretKeyParams } from './interfaces/reveal-secret-key-params.interface';
import { RevealSeedPhraseParams } from './interfaces/reveal-seed-phrase.params';
import {
  AccountImportType,
  createAccountImportSubscriptions,
  CreateImportedChainAccountFromPrivateKeyParams,
  CreateImportedChainAccountFromPrivateKeyRequest,
  CreateImportedChainAccountFromSeedParams,
  CreateImportedChainAccountFromSeedRequest,
  CreateImportedMultichainAccountFromSeedParams,
  CreateImportedMultichainAccountFromSeedRequest
} from './utils/create-account-import-subscriptions.util';
import { createHdAccountSubscription } from './utils/create-hd-account-subscription.util';
import { enableBiometryPasswordSubscription } from './utils/enable-biometry-password-subscription.util';
import { importWalletSubscription } from './utils/import-wallet-subscription.util';
import { revealSecretsSubscription } from './utils/reveal-secrets-subscription.util';

export const useShelter = () => {
  const accounts = useAllAccounts();
  const { dispatch: navigationDispatch } = useNavigation();
  const { trackErrorEvent } = useAnalytics();

  const importWallet$ = useMemo(() => new Subject<ImportWalletParams>(), []);
  const createHdAccount$ = useMemo(() => new Subject(), []);
  const revealSecretKey$ = useMemo(() => new Subject<RevealSecretKeyParams>(), []);
  const revealSeedPhrase$ = useMemo(() => new Subject<RevealSeedPhraseParams>(), []);
  const enableBiometryPassword$ = useMemo(() => new Subject<string>(), []);
  const createImportedChainAccountFromPrivateKey$ = useMemo(
    () => new Subject<CreateImportedChainAccountFromPrivateKeyRequest>(),
    []
  );
  const createImportedChainAccountFromSeed$ = useMemo(
    () => new Subject<CreateImportedChainAccountFromSeedRequest>(),
    []
  );
  const createImportedMultichainAccountFromSeed$ = useMemo(
    () => new Subject<CreateImportedMultichainAccountFromSeedRequest>(),
    []
  );

  useEffect(() => {
    const subscriptions = [
      importWalletSubscription(importWallet$),
      createHdAccountSubscription(createHdAccount$, accounts),
      createAccountImportSubscriptions(
        createImportedChainAccountFromPrivateKey$,
        createImportedChainAccountFromSeed$,
        createImportedMultichainAccountFromSeed$,
        accounts,
        navigationDispatch,
        (error, accountPkh) => trackErrorEvent('CreateImportAccountError', error, accountPkh ? [accountPkh] : [])
      ),
      revealSecretsSubscription(revealSecretKey$, revealSeedPhrase$),
      enableBiometryPasswordSubscription(enableBiometryPassword$)
    ];

    return () => subscriptions.forEach(subscription => subscription.unsubscribe());
  }, [
    accounts,
    createHdAccount$,
    createImportedChainAccountFromPrivateKey$,
    createImportedChainAccountFromSeed$,
    createImportedMultichainAccountFromSeed$,
    enableBiometryPassword$,
    importWallet$,
    navigationDispatch,
    revealSecretKey$,
    revealSeedPhrase$,
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
    (params: CreateImportedChainAccountFromPrivateKeyParams) =>
      createImportedChainAccountFromPrivateKey$.next({
        ...params,
        type: AccountImportType.ChainPrivateKey
      }),
    [createImportedChainAccountFromPrivateKey$]
  );

  const createImportedChainAccountFromSeed = useCallback(
    (params: CreateImportedChainAccountFromSeedParams) =>
      createImportedChainAccountFromSeed$.next({
        ...params,
        type: AccountImportType.ChainSeed
      }),
    [createImportedChainAccountFromSeed$]
  );

  const createImportedMultichainAccountFromSeed = useCallback(
    (params: CreateImportedMultichainAccountFromSeedParams) =>
      createImportedMultichainAccountFromSeed$.next({
        ...params,
        type: AccountImportType.MultichainSeed
      }),
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
