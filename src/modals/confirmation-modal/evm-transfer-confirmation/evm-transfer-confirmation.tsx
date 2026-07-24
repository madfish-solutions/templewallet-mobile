import { useNavigation } from '@react-navigation/core';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { firstValueFrom } from 'rxjs';
import { formatEther, formatGwei, parseGwei } from 'viem';

import { AssetValueText } from 'src/components/asset-value-text/asset-value-text';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { CryptoLogo } from 'src/components/crypto-logo';
import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { Divider } from 'src/components/divider/divider';
import { Label } from 'src/components/label/label';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { Slider } from 'src/components/slider/slider';
import { StyledTextInput } from 'src/components/styled-text-input/styled-text-input';
import { useEtherlinkPublicClient } from 'src/hooks/evm/use-etherlink-public-client.hook';
import { useEvmChain } from 'src/hooks/evm/use-evm-chains.hook';
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';
import { StacksEnum } from 'src/navigator/enums/stacks.enum';
import { Shelter } from 'src/shelter/shelter';
import { dispatch as storeDispatch } from 'src/store';
import { useEvmAccountChainAssetsSelector } from 'src/store/evm/assets/evm-assets-selectors';
import { useEvmAccountChainBalancesSelector } from 'src/store/evm/balances/evm-balances-selectors';
import { navigateAction } from 'src/store/root-state.actions';
import { useAllAccounts } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { showErrorToastByError } from 'src/toast/error-toast.utils';
import { showSuccessToast } from 'src/toast/toast.utils';
import { EvmAssetStandardEnum, EVM_TOKEN_SLUG } from 'src/token/interfaces/token-metadata.interface';
import { toEvmNetworkEssentials } from 'src/types/networks';
import { getAccountAddressForEvm } from 'src/utils/account.utils';
import { buildEvmTransferRequest } from 'src/utils/evm/build-evm-transfer-request';
import { loadEtherlinkBalancesOnChain } from 'src/utils/evm/etherlink-balances.utils';
import { getViemWalletClient } from 'src/utils/rpc/evm-client.utils';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

import { EvmTransferConfirmationModalParams } from '../confirmation-modal.params';

import { useEvmTransferConfirmationStyles } from './evm-transfer-confirmation.styles';

type Props = Omit<EvmTransferConfirmationModalParams, 'type'>;

const getGasPriceStep = (gasPrice: bigint) => {
  const zeroCount = Math.max(gasPrice.toString().length - 2, 0);

  return BigInt(`1${'0'.repeat(zeroCount)}`);
};

const getPresetGasPrice = (gasPrice: bigint, presetIndex: number) => {
  const price = gasPrice + getGasPriceStep(gasPrice) * BigInt(presetIndex - 1);

  return price > 0n ? price : gasPrice;
};

const truncateAddress = (address: string) => `${address.slice(0, 8)}...${address.slice(-6)}`;

export const EvmTransferConfirmation: FC<Props> = ({ accountId, asset, receiverAddress, atomicAmount }) => {
  const styles = useEvmTransferConfirmationStyles();
  const { goBack } = useNavigation();
  const accounts = useAllAccounts();
  const sourceAccount = accounts.find(account => account.id === accountId);
  const sourceAddress = sourceAccount ? getAccountAddressForEvm(sourceAccount) : undefined;
  const chain = useEvmChain(ETHERLINK_MAINNET_CHAIN_ID);
  const publicClient = useEtherlinkPublicClient();
  const knownAssets = useEvmAccountChainAssetsSelector(sourceAddress, ETHERLINK_MAINNET_CHAIN_ID);
  const balances = useEvmAccountChainBalancesSelector(sourceAddress, ETHERLINK_MAINNET_CHAIN_ID);

  const [gasLimit, setGasLimit] = useState<bigint>();
  const [estimatedGasPrice, setEstimatedGasPrice] = useState<bigint>();
  const [presetIndex, setPresetIndex] = useState(1);
  const [isCustom, setIsCustom] = useState(false);
  const [customGasPrice, setCustomGasPrice] = useState('');
  const [isEstimating, setIsEstimating] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estimationError, setEstimationError] = useState<string>();

  const request = useMemo(
    () => (sourceAddress ? buildEvmTransferRequest(sourceAddress, receiverAddress, asset, atomicAmount) : undefined),
    [asset, atomicAmount, receiverAddress, sourceAddress]
  );

  useEffect(() => {
    let isActive = true;

    const estimate = async () => {
      if (!sourceAddress || !request) {
        setEstimationError('Etherlink source account is unavailable');
        setIsEstimating(false);

        return;
      }

      setIsEstimating(true);
      setEstimationError(undefined);

      try {
        const [nextGasLimit, nextGasPrice] = await Promise.all([
          publicClient.estimateGas({ account: sourceAddress, ...request }),
          publicClient.getGasPrice()
        ]);

        if (isActive) {
          setGasLimit(nextGasLimit);
          setEstimatedGasPrice(nextGasPrice);
          setCustomGasPrice(formatGwei(nextGasPrice));
        }
      } catch (error) {
        if (isActive) {
          setEstimationError(error instanceof Error ? error.message : 'Unable to estimate Etherlink fee');
        }
      } finally {
        if (isActive) {
          setIsEstimating(false);
        }
      }
    };

    void estimate();

    return () => {
      isActive = false;
    };
  }, [publicClient, request, sourceAddress]);

  const selectedGasPrice = useMemo(() => {
    if (!estimatedGasPrice) {
      return undefined;
    }

    if (!isCustom) {
      return getPresetGasPrice(estimatedGasPrice, presetIndex);
    }

    try {
      const parsed = parseGwei(customGasPrice);

      return parsed > 0n ? parsed : undefined;
    } catch {
      return undefined;
    }
  }, [customGasPrice, estimatedGasPrice, isCustom, presetIndex]);

  const fee = gasLimit && selectedGasPrice ? gasLimit * selectedGasPrice : undefined;
  const requiredNativeBalance = fee
    ? fee + (asset.sendStandard === EvmAssetStandardEnum.NATIVE ? BigInt(atomicAmount) : 0n)
    : undefined;
  const hasInsufficientNativeBalance =
    requiredNativeBalance !== undefined && requiredNativeBalance > BigInt(balances[EVM_TOKEN_SLUG] ?? '0');

  const handleConfirm = useCallback(async () => {
    if (!sourceAddress || !chain || !request || !gasLimit || !selectedGasPrice) {
      return;
    }

    setIsSubmitting(true);

    try {
      const signer = await firstValueFrom(Shelter.getEvmAccount$(sourceAddress));
      const walletClient = getViemWalletClient(toEvmNetworkEssentials(chain), signer);
      const hash = await walletClient.sendTransaction({
        ...request,
        account: signer,
        gas: gasLimit,
        gasPrice: selectedGasPrice
      });

      showSuccessToast({
        operationHash: hash,
        title: 'Success!',
        description: 'Etherlink transaction submitted'
      });
      storeDispatch(navigateAction({ screen: StacksEnum.MainStack }));

      void publicClient
        .waitForTransactionReceipt({ hash })
        .then(() =>
          loadEtherlinkBalancesOnChain({
            network: toEvmNetworkEssentials(chain),
            account: sourceAddress,
            knownAssets
          })
        )
        .catch(console.error);
    } catch (error) {
      showErrorToastByError(error);
      setIsSubmitting(false);
    }
  }, [chain, gasLimit, knownAssets, publicClient, request, selectedGasPrice, sourceAddress]);

  return (
    <>
      <ScreenContainer>
        <Text style={styles.title}>Confirm Send</Text>
        <Divider size={formatSize(16)} />

        <View style={styles.accountCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{sourceAccount?.name.slice(0, 1).toUpperCase() ?? '?'}</Text>
          </View>
          <View style={styles.accountInfo}>
            <Text style={styles.accountName}>{sourceAccount?.name ?? 'Etherlink account'}</Text>
            <View style={styles.addressRow}>
              <CryptoLogo name={CryptoLogoNameEnum.Etherlink} size={formatSize(14)} internalSize={formatSize(14)} />
              <Text style={styles.addressText}>{sourceAddress ? truncateAddress(sourceAddress) : 'Unavailable'}</Text>
            </View>
          </View>
          <Text style={styles.networkText}>Etherlink</Text>
        </View>

        <Divider size={formatSize(16)} />
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>You send</Text>
          <AssetValueText asset={asset} amount={atomicAmount} style={styles.summaryValue} />
          <Divider size={formatSize(12)} />
          <Text style={styles.summaryLabel}>Recipient</Text>
          <Text style={styles.summaryAddress}>{truncateAddress(receiverAddress)}</Text>
          <Divider size={formatSize(12)} />
          <Text style={styles.summaryLabel}>Network</Text>
          <Text style={styles.summaryAddress}>Etherlink · Chain ID {asset.chainId}</Text>
        </View>

        <Divider size={formatSize(20)} />
        <Label label="Network fee" description="Paid in Etherlink XTZ" />
        <View style={styles.feeRow}>
          <Text style={styles.feeValue}>{fee ? `${formatEther(fee)} XTZ` : 'Estimating...'}</Text>
          <TouchableOpacity onPress={() => setIsCustom(value => !value)}>
            <Text style={styles.customizeButton}>{isCustom ? 'Use presets' : 'Customize'}</Text>
          </TouchableOpacity>
        </View>

        {!isCustom && (
          <>
            <Slider value={presetIndex} minimumValue={0} maximumValue={2} step={1} onValueChange={setPresetIndex} />
            <View style={styles.presetLabels}>
              <Text style={styles.presetLabel}>Slow</Text>
              <Text style={styles.presetLabel}>Market</Text>
              <Text style={styles.presetLabel}>Fast</Text>
            </View>
          </>
        )}

        {isCustom && (
          <>
            <Divider size={formatSize(12)} />
            <Label label="Gas price" description="Gwei" />
            <StyledTextInput
              value={customGasPrice}
              keyboardType="decimal-pad"
              placeholder="0"
              onChangeText={setCustomGasPrice}
            />
          </>
        )}

        <Divider size={formatSize(12)} />
        <Text style={styles.gasLimitText}>Estimated gas limit: {gasLimit?.toString() ?? '—'}</Text>
        {!!estimationError && <Text style={styles.errorText}>{estimationError}</Text>}
        {hasInsufficientNativeBalance && (
          <Text style={styles.errorText}>Insufficient XTZ balance for the amount and network fee</Text>
        )}
        <Divider size={formatSize(24)} />
      </ScreenContainer>

      <ModalButtonsFloatingContainer variant="bordered">
        <ButtonLargeSecondary title="Back" disabled={isSubmitting} onPress={goBack} />
        <ButtonLargePrimary
          title="Confirm"
          disabled={
            isEstimating ||
            isSubmitting ||
            Boolean(estimationError) ||
            !selectedGasPrice ||
            hasInsufficientNativeBalance
          }
          onPress={handleConfirm}
        />
      </ModalButtonsFloatingContainer>
    </>
  );
};
