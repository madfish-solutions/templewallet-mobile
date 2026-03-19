import { OpKind, RpcClient } from '@taquito/rpc';
import { RpcReadAdapter } from '@taquito/taquito';
import { b58DecodeAndCheckPrefix } from '@taquito/utils';
import axios, { AxiosError } from 'axios';
import BigNumber from 'bignumber.js';
import { entropyToMnemonic } from 'bip39';
import bs58check from 'bs58check';
import React, { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import WebView from 'react-native-webview';
import type { WebViewErrorEvent } from 'react-native-webview/lib/WebViewTypes';
import { useDispatch } from 'react-redux';
import useSWR from 'swr';

import { ButtonSmallSecondary } from 'src/components/button/button-small/button-small-secondary/button-small-secondary';
import { Divider } from 'src/components/divider/divider';
import { OVERLAY_SHOW_TIMEOUT } from 'src/components/mnemonic/mnemonic.config';
import { MnemonicStyles } from 'src/components/mnemonic/mnemonic.styles';
import { RevealSecretView } from 'src/components/mnemonic/reveal-secret-view/reveal-secret-view';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { StyledTextInput } from 'src/components/styled-text-input/styled-text-input';
import { StyledTextInputStyles } from 'src/components/styled-text-input/styled-text-input.styles';
import { isAndroid } from 'src/config/system';
import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { useActiveTimer } from 'src/hooks/use-active-timer.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useShelter } from 'src/shelter/use-shelter.hook';
import { navigateAction } from 'src/store/root-state.actions';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import {
  useCurrentAccountTezosBalance,
  useHdAccountListSelector,
  useRawCurrentAccountSelector
} from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast, showErrorToastByError } from 'src/toast/toast.utils';
import { TEZ_TOKEN_METADATA } from 'src/token/data/tokens-metadata';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';
import {
  InMemorySpendingKey,
  InMemoryViewingKey,
  SaplingIncomingTransaction,
  SaplingOutgoingTransaction,
  SaplingTransactionViewer
} from 'src/utils/sapling';
import { SaplingToolkit } from 'src/utils/sapling/taquito-sapling';
import { mutezToTz } from 'src/utils/tezos.util';

import { SaplingForm } from './sapling-form';
import { ShieldForm } from './shield-form';
import { UnshieldForm } from './unshield-form';
import { useSetSaplingFunctionsSupplement } from './use-set-sapling-functions-supplement';

export const Sapling: FC = () => {
  const { revealSeedPhrase, revealSecretKey } = useShelter();
  const account = useRawCurrentAccountSelector()!;
  const hdAccounts = useHdAccountListSelector();
  const [saplingCredentials, setSaplingCredentials] = useState<SaplingCredentials | null>(null);
  const [isLoadError, setIsLoadError] = useState(false);
  const { isReady, webViewRef, handleWebViewMessage } = useSetSaplingFunctionsSupplement();

  const hdIndex = useMemo(
    () => hdAccounts.findIndex(a => a.publicKeyHash === account.publicKeyHash),
    [hdAccounts, account.publicKeyHash]
  );

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const handleSaplingMnemonic = async (mnemonic: string, hdIndex?: number) => {
      try {
        const spendingKey = await InMemorySpendingKey.fromMnemonic(
          mnemonic,
          hdIndex === undefined ? undefined : `m/44'/1729'/${hdIndex}'/0'`
        );
        const saplingViewingKeyProvider = await spendingKey.getSaplingViewingKeyProvider();

        setSaplingCredentials({
          viewingKey: saplingViewingKeyProvider.getFullViewingKey().toString('hex'),
          saplingAddress: (await saplingViewingKeyProvider.getAddress()).address,
          spendingKey
        });
      } catch (e) {
        console.error(e);
        showErrorToastByError(e);
        setIsLoadError(true);
      }
    };

    if (account.type === AccountTypeEnum.HD_ACCOUNT) {
      revealSeedPhrase({
        successCallback: mnemonic => void handleSaplingMnemonic(mnemonic, hdIndex === 0 ? undefined : hdIndex)
      });
    } else {
      revealSecretKey({
        publicKeyHash: account.publicKeyHash,
        successCallback: privateKey => void handleSaplingMnemonic(getMnemonicFromSecretKey(privateKey))
      });
    }
  }, [account.publicKeyHash, account.type, hdIndex, revealSecretKey, revealSeedPhrase, isReady]);

  const handleWebViewError = useCallback((e: WebViewErrorEvent) => {
    console.error(e);
    showErrorToast({
      title: 'Failed to load proxy',
      description: e.nativeEvent.description
    });
    setIsLoadError(true);
  }, []);

  useEffect(() => {
    axios
      .get(isAndroid ? 'file:///android_asset/custom/index.js' : './resources/index.js')
      .then(response => {
        console.log(typeof response.data);
      })
      .catch(error => {
        console.error(error);
        if (error instanceof AxiosError) {
          console.error(error.code, error.message);
        }
      });
  }, []);

  return (
    <ScreenContainer>
      {saplingCredentials ? (
        <SaplingPageContent saplingCredentials={saplingCredentials} />
      ) : isLoadError ? (
        <Text>Failed to load credentials</Text>
      ) : (
        <Text>Loading...</Text>
      )}
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        source={require('src/assets/sapling-proxy/index.html')}
        webviewDebuggingEnabled={__DEV__}
        onError={handleWebViewError}
        onMessage={handleWebViewMessage}
        containerStyle={{ width: 0, height: 0 }}
      />
    </ScreenContainer>
  );
};

function getMnemonicFromSecretKey(secretKey: string) {
  let entropy: Uint8Array | Buffer;

  if (secretKey.startsWith('spsk') || secretKey.startsWith('p2sk')) {
    [entropy] = b58DecodeAndCheckPrefix(secretKey);
  } else if (secretKey.startsWith('edsk')) {
    entropy = getEntropyFromEdsk(secretKey);
  } else {
    throw new Error('Invalid secret key');
  }

  return entropyToMnemonic(Buffer.from(entropy));
}

function getEntropyFromEdsk(edskString: string) {
  const decoded = bs58check.decode(edskString);
  const prefixLength = 4;
  const rawBytes = decoded.subarray(prefixLength);
  if (rawBytes.length === 64) {
    return rawBytes.subarray(0, 32);
  }

  return rawBytes;
}

interface SaplingCredentials {
  viewingKey: string;
  saplingAddress: string;
  spendingKey: InMemorySpendingKey;
}

interface SaplingPageContentProps {
  saplingCredentials: SaplingCredentials;
}

interface AccountState {
  shieldedBalance: BigNumber;
  transactions: {
    incoming: Array<Omit<SaplingIncomingTransaction, 'value'> & { value: string }>;
    outgoing: Array<Omit<SaplingOutgoingTransaction, 'value'> & { value: string }>;
  };
}

const SaplingPageContent = memo(({ saplingCredentials }: SaplingPageContentProps) => {
  const { viewingKey, saplingAddress, spendingKey } = saplingCredentials;
  const [displayedViewingKey, setDisplayedViewingKey] = useState<string>();
  const { activeTimer, clearActiveTimer } = useActiveTimer();
  const rawUnshieldedBalance = useCurrentAccountTezosBalance();
  const saplingContract = 'KT1KzAPQdpziH3bxxJXQNmNQA46oo8tnDQfj';
  const rpcUrl = useSelectedRpcUrlSelector();
  const dispatch = useDispatch();

  const unshieldedBalance = useMemo(
    () =>
      rawUnshieldedBalance
        ? mutezToTz(new BigNumber(rawUnshieldedBalance), TEZ_TOKEN_METADATA.decimals).toFixed()
        : null,
    [rawUnshieldedBalance]
  );

  const txViewer = useMemo(
    () =>
      new SaplingTransactionViewer(
        new InMemoryViewingKey(viewingKey),
        { contractAddress: saplingContract },
        new RpcReadAdapter(new RpcClient(rpcUrl))
      ),
    [rpcUrl, viewingKey]
  );

  const getAccountState = useCallback(async (): Promise<AccountState> => {
    const transactions = await txViewer.getIncomingAndOutgoingTransactions();
    let shieldedBalance = new BigNumber(0);
    transactions.incoming.forEach(transaction => {
      if (!transaction.isSpent) {
        shieldedBalance = shieldedBalance.plus(transaction.value);
      }
    });

    return {
      shieldedBalance,
      transactions: {
        incoming: transactions.incoming.map(({ value, ...restProps }) => ({
          value: value.toFixed(),
          ...restProps
        })),
        outgoing: transactions.outgoing.map(({ value, ...restProps }) => ({
          value: value.toFixed(),
          ...restProps
        }))
      }
    };
  }, [txViewer]);

  const { data: accountState, error } = useSWR(['sapling-account-state', rpcUrl, viewingKey], getAccountState, {
    refreshInterval: 10000,
    suspense: false,
    errorRetryCount: 2
  });

  const saplingToolkit = useMemo(
    () =>
      new SaplingToolkit(
        { saplingSigner: spendingKey },
        { contractAddress: saplingContract, memoSize: 8 },
        new RpcReadAdapter(new RpcClient(rpcUrl))
      ),
    [rpcUrl, spendingKey]
  );

  const goToSaplingConfirmation = useCallback(
    (amountMutez: BigNumber, txData: string, testID: string) => {
      dispatch(
        navigateAction({
          screen: ModalsEnum.Confirmation,
          params: {
            type: ConfirmationTypeEnum.InternalOperations,
            opParams: [
              {
                kind: OpKind.TRANSACTION,
                to: saplingContract,
                amount: amountMutez.toNumber(),
                mutez: true,
                parameter: { entrypoint: 'default', value: [{ bytes: txData }] }
              }
            ],
            testID
          }
        })
      );
    },
    [dispatch]
  );

  useEffect(() => {
    if (error) {
      console.error(error);
      showErrorToastByError(error);
    }
  }, [error]);

  useEffect(() => {
    clearActiveTimer();
    setDisplayedViewingKey(undefined);
  }, [clearActiveTimer]);

  const handleProtectedOverlayPress = useCallback(() => {
    clearActiveTimer();
    setDisplayedViewingKey(viewingKey);
    activeTimer.current = setTimeout(() => setDisplayedViewingKey(undefined), OVERLAY_SHOW_TIMEOUT);
  }, [activeTimer, clearActiveTimer, viewingKey]);

  return (
    <>
      <Text>Viewing key (do not disclose to keep transactions private)</Text>
      <RevealSecretView
        value={displayedViewingKey}
        onProtectedOverlayPress={handleProtectedOverlayPress}
        style={{ minHeight: formatSize(280), maxHeight: formatSize(280) }}
      />
      <Text>Sapling address</Text>
      <View style={MnemonicStyles.container}>
        <StyledTextInput
          value={saplingAddress}
          editable={false}
          multiline={true}
          maxLength={360}
          style={StyledTextInputStyles.mnemonicInput}
        />
        <View style={MnemonicStyles.buttonsContainer}>
          <ButtonSmallSecondary title="COPY" onPress={() => copyStringToClipboard(saplingAddress)} />
        </View>
      </View>
      {unshieldedBalance ? <Text>Unshielded balance: {unshieldedBalance} TEZ</Text> : null}
      {!!accountState && (
        <>
          <Divider size={formatSize(12)} />

          <ShieldForm
            saplingToolkit={saplingToolkit}
            saplingAddress={saplingAddress}
            goToSaplingConfirmation={goToSaplingConfirmation}
          />

          <Divider size={formatSize(12)} />

          <SaplingForm
            saplingToolkit={saplingToolkit}
            goToSaplingConfirmation={goToSaplingConfirmation}
            shieldedBalance={accountState.shieldedBalance}
          />

          <Divider size={formatSize(12)} />

          <UnshieldForm
            saplingToolkit={saplingToolkit}
            shieldedBalance={accountState.shieldedBalance}
            goToSaplingConfirmation={goToSaplingConfirmation}
          />
        </>
      )}
    </>
  );
});
