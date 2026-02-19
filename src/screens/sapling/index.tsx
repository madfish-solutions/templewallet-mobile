import BigNumber from 'bignumber.js';
import React, { FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import type { WebViewErrorEvent } from 'react-native-webview/lib/WebViewTypes';
import { Subject } from 'rxjs';

import { ButtonSmallSecondary } from 'src/components/button/button-small/button-small-secondary/button-small-secondary';
import { OVERLAY_SHOW_TIMEOUT } from 'src/components/mnemonic/mnemonic.config';
import { MnemonicStyles } from 'src/components/mnemonic/mnemonic.styles';
import { RevealSecretView } from 'src/components/mnemonic/reveal-secret-view/reveal-secret-view';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { StyledTextInput } from 'src/components/styled-text-input/styled-text-input';
import { StyledTextInputStyles } from 'src/components/styled-text-input/styled-text-input.styles';
import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { useActiveTimer } from 'src/hooks/use-active-timer.hook';
import { useShelter } from 'src/shelter/use-shelter.hook';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import {
  useCurrentAccountTezosBalance,
  useHdAccountListSelector,
  useRawCurrentAccountSelector
} from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/toast.utils';
import { TEZ_TOKEN_METADATA } from 'src/token/data/tokens-metadata';
import { SaplingIncomingTransaction, SaplingOutgoingTransaction } from 'src/types/sapling-contract-transaction';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';
import { useInterval } from 'src/utils/hooks';
import { mutezToTz } from 'src/utils/tezos.util';

export const Sapling: FC = () => {
  const { revealSeedPhrase, revealSecretKey } = useShelter();
  const account = useRawCurrentAccountSelector()!;
  const hdAccounts = useHdAccountListSelector();
  const webViewRef = useRef<WebView>(null);
  const [proxyError, setProxyError] = useState(false);
  const [saplingCredentials, setSaplingCredentials] = useState<SaplingCredentials | null>(null);
  const webViewMessageSubject = useMemo(() => new Subject<WebViewMessageEvent>(), []);

  const hdIndex = useMemo(
    () => hdAccounts.findIndex(a => a.publicKeyHash === account.publicKeyHash),
    [hdAccounts, account.publicKeyHash]
  );

  const handleWebViewLoad = useCallback(() => {
    const handleSaplingCredentialsMessage = () => {
      const sub = webViewMessageSubject.subscribe(event => {
        sub.unsubscribe();
        try {
          const data = JSON.parse(event.nativeEvent.data);
          if ('error' in data) {
            throw new Error(data.error);
          }
          setSaplingCredentials(data);
        } catch (err) {
          console.error(err);
          showErrorToast({
            title: 'Failed to get sapling credentials',
            description: err instanceof Error ? err.message : 'Unknown error'
          });
          setProxyError(true);
        }
      });
    };

    if (account.type === AccountTypeEnum.HD_ACCOUNT) {
      revealSeedPhrase({
        successCallback: mnemonic => {
          handleSaplingCredentialsMessage();
          webViewRef.current!.postMessage(
            JSON.stringify({
              method: 'saplingCredentials',
              payload: { mnemonic, hdIndex: hdIndex === 0 ? undefined : hdIndex }
            })
          );
        }
      });
    } else {
      revealSecretKey({
        publicKeyHash: account.publicKeyHash,
        successCallback: privateKey => {
          handleSaplingCredentialsMessage();
          webViewRef.current!.postMessage(JSON.stringify({ method: 'saplingCredentials', payload: { privateKey } }));
        }
      });
    }
  }, [account.type, account.publicKeyHash, hdIndex, webViewMessageSubject, revealSeedPhrase, revealSecretKey]);

  const handleWebViewMessage = useCallback(
    (event: WebViewMessageEvent) => webViewMessageSubject.next(event),
    [webViewMessageSubject]
  );

  const handleWebViewError = useCallback((e: WebViewErrorEvent) => {
    console.error(e);
    showErrorToast({
      title: 'Failed to load proxy',
      description: e.nativeEvent.description
    });
    setProxyError(true);
  }, []);

  return (
    <ScreenContainer>
      <View style={{ display: 'none' }}>
        <WebView
          ref={webViewRef}
          source={{ uri: 'https://cruciate-mui-autogenously.ngrok-free.dev' }}
          onLoad={handleWebViewLoad}
          onError={handleWebViewError}
          onMessage={handleWebViewMessage}
        />
      </View>
      {saplingCredentials ? (
        <SaplingPageContent
          saplingCredentials={saplingCredentials}
          webViewMessageSubject={webViewMessageSubject}
          webViewRef={webViewRef}
        />
      ) : proxyError ? (
        <Text>Failed to load credentials</Text>
      ) : (
        <Text>Loading...</Text>
      )}
    </ScreenContainer>
  );
};

interface SaplingCredentials {
  viewingKey: string;
  saplingAddress: string;
}

interface SaplingPageContentProps {
  saplingCredentials: SaplingCredentials;
  webViewMessageSubject: Subject<WebViewMessageEvent>;
  webViewRef: React.RefObject<WebView>;
}

interface AccountState {
  shieldedBalance: string;
  transactions: {
    incoming: Array<Omit<SaplingIncomingTransaction, 'value'> & { value: string }>;
    outgoing: Array<Omit<SaplingOutgoingTransaction, 'value'> & { value: string }>;
  };
}

const SaplingPageContent = memo(
  ({ saplingCredentials, webViewMessageSubject, webViewRef }: SaplingPageContentProps) => {
    const { viewingKey, saplingAddress } = saplingCredentials;
    const [displayedViewingKey, setDisplayedViewingKey] = useState<string>();
    const { activeTimer, clearActiveTimer } = useActiveTimer();
    const rawUnshieldedBalance = useCurrentAccountTezosBalance();
    const saplingContract = 'KT1KzAPQdpziH3bxxJXQNmNQA46oo8tnDQfj';
    const rpcUrl = useSelectedRpcUrlSelector();
    const [accountState, setAccountState] = useState<AccountState | null>(null);

    const unshieldedBalance = useMemo(
      () =>
        rawUnshieldedBalance
          ? mutezToTz(new BigNumber(rawUnshieldedBalance), TEZ_TOKEN_METADATA.decimals).toFixed()
          : null,
      [rawUnshieldedBalance]
    );

    useInterval(
      () => {
        const sub = webViewMessageSubject.subscribe(event => {
          sub.unsubscribe();
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if ('error' in data) {
              throw new Error(data.error);
            }
            setAccountState(data);
          } catch (err) {
            console.error(err);
            showErrorToast({
              title: 'Failed to get account state',
              description: err instanceof Error ? err.message : 'Unknown error'
            });
          }
        });
        webViewRef.current!.postMessage(
          JSON.stringify({
            method: 'accountState',
            payload: { viewingKey, saplingContract, rpcUrl }
          })
        );
      },
      10000,
      [],
      true
    );

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
        {!!accountState?.shieldedBalance && (
          <Text>
            Shielded balance:{' '}
            {mutezToTz(new BigNumber(accountState.shieldedBalance), TEZ_TOKEN_METADATA.decimals).toFixed()} TEZ
          </Text>
        )}
      </>
    );
  }
);
