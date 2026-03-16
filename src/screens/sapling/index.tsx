import { nanoid } from '@reduxjs/toolkit';
import { OpKind } from '@taquito/rpc';
import BigNumber from 'bignumber.js';
import React, { FC, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import type { WebViewErrorEvent } from 'react-native-webview/lib/WebViewTypes';
import { useDispatch } from 'react-redux';
import { Subject } from 'rxjs';

import { AddressInput } from 'src/components/address-input/address-input';
import { AssetAmountInput, AssetAmountInterface } from 'src/components/asset-amount-input/asset-amount-input';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonSmallSecondary } from 'src/components/button/button-small/button-small-secondary/button-small-secondary';
import { Divider } from 'src/components/divider/divider';
import { OVERLAY_SHOW_TIMEOUT } from 'src/components/mnemonic/mnemonic.config';
import { MnemonicStyles } from 'src/components/mnemonic/mnemonic.styles';
import { RevealSecretView } from 'src/components/mnemonic/reveal-secret-view/reveal-secret-view';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { StyledTextInput } from 'src/components/styled-text-input/styled-text-input';
import { StyledTextInputStyles } from 'src/components/styled-text-input/styled-text-input.styles';
import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { VisibilityEnum } from 'src/enums/visibility.enum';
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
import { showErrorToast } from 'src/toast/toast.utils';
import { TEZ_TOKEN_METADATA } from 'src/token/data/tokens-metadata';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import {
  SaplingContractTransaction,
  SaplingIncomingTransaction,
  SaplingOutgoingTransaction
} from 'src/types/sapling-contract-transaction';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';
import { useInterval } from 'src/utils/hooks';
import { ZERO } from 'src/utils/number.util';
import { mutezToTz } from 'src/utils/tezos.util';

const saplingContract = 'KT1KzAPQdpziH3bxxJXQNmNQA46oo8tnDQfj';

export const Sapling: FC = () => {
  const { revealSeedPhrase, revealSecretKey } = useShelter();
  const account = useRawCurrentAccountSelector()!;
  const hdAccounts = useHdAccountListSelector();
  const webViewRef = useRef<WebView>(null);
  const [proxyError, setProxyError] = useState(false);
  const [derivationInput, setDerivationInput] = useState<Record<string, unknown>>({});
  const [saplingCredentials, setSaplingCredentials] = useState<SaplingCredentials | null>(null);
  const webViewMessageSubject = useMemo(() => new Subject<WebViewMessageEvent>(), []);

  const hdIndex = useMemo(
    () => hdAccounts.findIndex(a => a.publicKeyHash === account.publicKeyHash),
    [hdAccounts, account.publicKeyHash]
  );

  const doSaplingProxyOperation = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (operation: Record<string, unknown>, errorTitle: string, onSuccess: SyncFn<any>) => {
      const messageId = nanoid();
      const sub = webViewMessageSubject.subscribe(event => {
        try {
          const data = JSON.parse(event.nativeEvent.data);

          if (data.id !== messageId) {
            return;
          }

          sub.unsubscribe();

          if ('error' in data) {
            throw new Error(data.error);
          }
          onSuccess(data);
        } catch (err) {
          console.error(err);
          showErrorToast({
            title: errorTitle,
            description: err instanceof Error ? err.message : 'Unknown error'
          });
        }
      });

      webViewRef.current!.postMessage(JSON.stringify({ ...operation, id: messageId }));
    },
    [webViewMessageSubject]
  );

  const handleWebViewLoad = useCallback(() => {
    const doSaplingCredentialsOperation = (payload: Record<string, unknown>) => {
      doSaplingProxyOperation({ method: 'saplingCredentials', payload }, 'Failed to get sapling credentials', data => {
        setSaplingCredentials(data);
      });
    };

    if (account.type === AccountTypeEnum.HD_ACCOUNT) {
      revealSeedPhrase({
        successCallback: mnemonic => {
          setDerivationInput({ mnemonic, hdIndex: hdIndex === 0 ? undefined : hdIndex });
          doSaplingCredentialsOperation({ mnemonic, hdIndex: hdIndex === 0 ? undefined : hdIndex });
        }
      });
    } else {
      revealSecretKey({
        publicKeyHash: account.publicKeyHash,
        successCallback: privateKey => {
          setDerivationInput({ privateKey });
          doSaplingCredentialsOperation({ privateKey });
        }
      });
    }
  }, [account.type, account.publicKeyHash, hdIndex, doSaplingProxyOperation, revealSeedPhrase, revealSecretKey]);

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
          source={{
            uri: 'https://ipfs.io/ipfs/bafybeiapyc6odu5pospewaagwbw54hporwzee4t5g7npsj6j7uto74ucx4/index.html'
          }}
          onLoad={handleWebViewLoad}
          onError={handleWebViewError}
          onMessage={handleWebViewMessage}
        />
      </View>
      {saplingCredentials ? (
        <SaplingPageContent
          saplingCredentials={saplingCredentials}
          doSaplingProxyOperation={doSaplingProxyOperation}
          derivationInput={derivationInput}
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  doSaplingProxyOperation: (operation: Record<string, unknown>, errorTitle: string, onSuccess: SyncFn<any>) => void;
  derivationInput: Record<string, unknown>;
}

interface AccountState {
  shieldedBalance: string;
  transactions: {
    incoming: Array<Omit<SaplingIncomingTransaction, 'value'> & { value: string }>;
    outgoing: Array<Omit<SaplingOutgoingTransaction, 'value'> & { value: string }>;
  };
}

const SaplingPageContent = memo(
  ({ saplingCredentials, doSaplingProxyOperation, derivationInput }: SaplingPageContentProps) => {
    const { viewingKey, saplingAddress } = saplingCredentials;
    const dispatch = useDispatch();
    const account = useRawCurrentAccountSelector()!;
    const [displayedViewingKey, setDisplayedViewingKey] = useState<string>();
    const { activeTimer, clearActiveTimer } = useActiveTimer();
    const rawUnshieldedBalance = useCurrentAccountTezosBalance();
    const rpcUrl = useSelectedRpcUrlSelector();
    const [accountState, setAccountState] = useState<AccountState | null>(null);
    const assetToShield = useMemo(
      () => ({ ...TEZ_TOKEN_METADATA, balance: rawUnshieldedBalance, visibility: VisibilityEnum.Visible }),
      [rawUnshieldedBalance]
    );
    const assetToUnshield = useMemo(
      () => ({
        ...TEZ_TOKEN_METADATA,
        balance: (accountState ? new BigNumber(accountState.shieldedBalance) : ZERO).toFixed(),
        visibility: VisibilityEnum.Visible
      }),
      [accountState]
    );
    const [shieldInputValue, setShieldInputValue] = useState<AssetAmountInterface>({
      asset: assetToShield,
      amount: ZERO
    });
    const [saplingInputValue, setSaplingInputValue] = useState<AssetAmountInterface>({
      asset: assetToUnshield,
      amount: ZERO
    });
    const [unshieldInputValue, setUnshieldInputValue] = useState<AssetAmountInterface>({
      asset: assetToUnshield,
      amount: ZERO
    });
    const [saplingDestinationAddress, setSaplingDestinationAddress] = useState<string>('');

    const shieldAmountInputAssetsList = useMemo<TokenInterface[]>(() => [assetToShield], [assetToShield]);
    const unshieldAmountInputAssetsList = useMemo<TokenInterface[]>(() => [assetToUnshield], [assetToUnshield]);

    const prepareSaplingContractTransaction = useCallback(
      (transaction: SaplingContractTransaction, errorTitle: string, onSuccess: (data: { txData: string }) => void) => {
        doSaplingProxyOperation(
          { method: 'prepareTransaction', payload: { transaction, saplingContract, rpcUrl, ...derivationInput } },
          errorTitle,
          onSuccess
        );
      },
      [doSaplingProxyOperation, derivationInput, rpcUrl]
    );

    const goToSaplingConfirmation = useCallback(
      (amountMutez: BigNumber, txData: string, testID: string) => {
        dispatch(
          navigateAction(ModalsEnum.Confirmation, {
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
          })
        );
      },
      [dispatch]
    );

    const handleShieldPress = useCallback(() => {
      prepareSaplingContractTransaction(
        {
          type: 'shielded',
          params: [
            {
              to: saplingAddress,
              amount: (shieldInputValue.amount ?? ZERO).toNumber(),
              mutez: true
            }
          ]
        },
        'Failed to prepare shielded transaction',
        response => {
          goToSaplingConfirmation(shieldInputValue.amount ?? ZERO, response.txData, 'SHIELD_TRANSACTION_SENT');
        }
      );
    }, [prepareSaplingContractTransaction, saplingAddress, shieldInputValue.amount, goToSaplingConfirmation]);

    const handleSaplingTxPress = useCallback(() => {
      prepareSaplingContractTransaction(
        {
          type: 'sapling',
          params: [
            {
              to: saplingDestinationAddress,
              amount: (saplingInputValue.amount ?? ZERO).toNumber(),
              mutez: true
            }
          ]
        },
        'Failed to prepare sapling transaction',
        response => {
          goToSaplingConfirmation(ZERO, response.txData, 'SAPLING_TRANSACTION_SENT');
        }
      );
    }, [
      goToSaplingConfirmation,
      prepareSaplingContractTransaction,
      saplingDestinationAddress,
      saplingInputValue.amount
    ]);

    const handleUnshieldPress = useCallback(() => {
      prepareSaplingContractTransaction(
        {
          type: 'unshielded',
          params: {
            to: account.publicKeyHash,
            amount: (unshieldInputValue.amount ?? ZERO).toNumber(),
            mutez: true
          }
        },
        'Failed to prepare unshielded transaction',
        response => {
          goToSaplingConfirmation(ZERO, response.txData, 'UNSHIELD_TRANSACTION_SENT');
        }
      );
    }, [account.publicKeyHash, goToSaplingConfirmation, prepareSaplingContractTransaction, unshieldInputValue.amount]);

    const unshieldedBalance = useMemo(
      () =>
        rawUnshieldedBalance
          ? mutezToTz(new BigNumber(rawUnshieldedBalance), TEZ_TOKEN_METADATA.decimals).toFixed()
          : null,
      [rawUnshieldedBalance]
    );

    useInterval(
      () => {
        doSaplingProxyOperation(
          { method: 'accountState', payload: { viewingKey, saplingContract, rpcUrl } },
          'Failed to get account state',
          setAccountState
        );
      },
      10000,
      [doSaplingProxyOperation, viewingKey, saplingContract, rpcUrl],
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
        {!!accountState && (
          <>
            <Divider size={formatSize(12)} />

            <AssetAmountInput
              value={shieldInputValue}
              label="Shield"
              assetsList={shieldAmountInputAssetsList}
              balanceLabel="TEZ balance:"
              toUsdToggle={false}
              isSingleAsset={true}
              onValueChange={setShieldInputValue}
            />
            <ButtonLargePrimary title="Shield" onPress={handleShieldPress} />

            <Divider size={formatSize(12)} />

            <AssetAmountInput
              balance={accountState.shieldedBalance}
              value={saplingInputValue}
              label="Sapling"
              assetsList={unshieldAmountInputAssetsList}
              balanceLabel="Shielded TEZ balance:"
              toUsdToggle={false}
              isSingleAsset={true}
              onValueChange={setSaplingInputValue}
            />
            <AddressInput
              value={saplingDestinationAddress}
              placeholder="Destination address"
              onChangeText={setSaplingDestinationAddress}
            />
            <ButtonLargePrimary title="Sapling" onPress={handleSaplingTxPress} />

            <Divider size={formatSize(12)} />

            <AssetAmountInput
              balance={accountState.shieldedBalance}
              value={unshieldInputValue}
              label="Unshield"
              assetsList={unshieldAmountInputAssetsList}
              balanceLabel="Shielded TEZ balance:"
              toUsdToggle={false}
              isSingleAsset={true}
              onValueChange={setUnshieldInputValue}
            />
            <ButtonLargePrimary title="Unshield" onPress={handleUnshieldPress} />
          </>
        )}
      </>
    );
  }
);
