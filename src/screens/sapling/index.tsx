import { OpKind, RpcClient } from '@taquito/rpc';
import { RpcReadAdapter } from '@taquito/taquito';
import { b58DecodeAndCheckPrefix } from '@taquito/utils';
import BigNumber from 'bignumber.js';
import Bip39 from 'bip39';
import bs58check from 'bs58check';
import React, { FC, memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';
import useSWR from 'swr';

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
import { copyStringToClipboard } from 'src/utils/clipboard.utils';
import { ZERO } from 'src/utils/number.util';
import {
  InMemorySpendingKey,
  InMemoryViewingKey,
  SaplingIncomingTransaction,
  SaplingOutgoingTransaction,
  SaplingTransactionViewer
} from 'src/utils/sapling';
import { SaplingToolkit } from 'src/utils/sapling/taquito-sapling';
import { mutezToTz } from 'src/utils/tezos.util';

export const Sapling: FC = () => {
  const { revealSeedPhrase, revealSecretKey } = useShelter();
  const account = useRawCurrentAccountSelector()!;
  const hdAccounts = useHdAccountListSelector();
  const [saplingCredentials, setSaplingCredentials] = useState<SaplingCredentials | null>(null);
  const [isLoadError, setIsLoadError] = useState(false);

  const hdIndex = useMemo(
    () => hdAccounts.findIndex(a => a.publicKeyHash === account.publicKeyHash),
    [hdAccounts, account.publicKeyHash]
  );

  useEffect(() => {
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
        showErrorToast(e instanceof Error ? { description: e.message } : { description: 'Something went wrong' });
        setIsLoadError(true);
      }
    };

    if (account.type === AccountTypeEnum.HD_ACCOUNT) {
      revealSeedPhrase({
        successCallback: mnemonic => handleSaplingMnemonic(mnemonic, hdIndex === 0 ? undefined : hdIndex)
      });
    } else {
      revealSecretKey({
        publicKeyHash: account.publicKeyHash,
        successCallback: privateKey => handleSaplingMnemonic(getMnemonicFromSecretKey(privateKey))
      });
    }
  }, [account.publicKeyHash, account.type, hdIndex, revealSecretKey, revealSeedPhrase]);

  return (
    <ScreenContainer>
      {saplingCredentials ? (
        <SaplingPageContent saplingCredentials={saplingCredentials} />
      ) : isLoadError ? (
        <Text>Failed to load credentials</Text>
      ) : (
        <Text>Loading...</Text>
      )}
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

  return Bip39.entropyToMnemonic(Buffer.from(entropy));
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
  const account = useRawCurrentAccountSelector()!;
  const { viewingKey, saplingAddress, spendingKey } = saplingCredentials;
  const [displayedViewingKey, setDisplayedViewingKey] = useState<string>();
  const { activeTimer, clearActiveTimer } = useActiveTimer();
  const rawUnshieldedBalance = useCurrentAccountTezosBalance();
  const saplingContract = 'KT1KzAPQdpziH3bxxJXQNmNQA46oo8tnDQfj';
  const rpcUrl = useSelectedRpcUrlSelector();
  const dispatch = useDispatch();
  const assetToShield = useMemo(
    () => ({ ...TEZ_TOKEN_METADATA, balance: rawUnshieldedBalance, visibility: VisibilityEnum.Visible }),
    [rawUnshieldedBalance]
  );

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

  const handleShieldPress = useCallback(async () => {
    try {
      const txData = await saplingToolkit.prepareShieldedTransaction([
        { to: saplingAddress, amount: shieldInputValue.amount?.toNumber() ?? 0, mutez: true }
      ]);
      goToSaplingConfirmation(shieldInputValue.amount ?? ZERO, txData, 'SHIELD_TRANSACTION_SENT');
    } catch (e) {
      console.error(e);
      showErrorToast(e instanceof Error ? { description: e.message } : { description: 'Something went wrong' });
    }
  }, [goToSaplingConfirmation, saplingAddress, saplingToolkit, shieldInputValue.amount]);

  const handleSaplingTxPress = useCallback(async () => {
    try {
      const txData = await saplingToolkit.prepareSaplingTransaction([
        { to: saplingDestinationAddress, amount: saplingInputValue.amount?.toNumber() ?? 0, mutez: true }
      ]);
      goToSaplingConfirmation(ZERO, txData, 'SAPLING_TRANSACTION_SENT');
    } catch (e) {
      console.error(e);
      showErrorToast(e instanceof Error ? { description: e.message } : { description: 'Something went wrong' });
    }
  }, [goToSaplingConfirmation, saplingDestinationAddress, saplingToolkit, saplingInputValue.amount]);

  const handleUnshieldPress = useCallback(async () => {
    try {
      const txData = await saplingToolkit.prepareUnshieldedTransaction({
        to: account.publicKeyHash,
        amount: unshieldInputValue.amount?.toNumber() ?? 0,
        mutez: true
      });
      goToSaplingConfirmation(ZERO, txData, 'UNSHIELD_TRANSACTION_SENT');
    } catch (e) {
      console.error(e);
      showErrorToast(e instanceof Error ? { description: e.message } : { description: 'Something went wrong' });
    }
  }, [account.publicKeyHash, goToSaplingConfirmation, saplingToolkit, unshieldInputValue.amount]);

  useEffect(() => {
    if (error) {
      console.error(error);
      showErrorToast(error instanceof Error ? { description: error.message } : { description: 'Something went wrong' });
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
            balance={accountState.shieldedBalance.toFixed()}
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
            balance={accountState.shieldedBalance.toFixed()}
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
});
