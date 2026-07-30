import { useNavigation } from '@react-navigation/core';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { firstValueFrom } from 'rxjs';
import { formatEther, formatGwei, parseGwei } from 'viem';

import { AccountDropdownItem } from 'src/components/account-dropdown/account-dropdown-item/account-dropdown-item';
import { AssetValueText } from 'src/components/asset-value-text/asset-value-text';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from 'src/components/divider/divider';
import { FormattedAmount } from 'src/components/formatted-amount';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { Label } from 'src/components/label/label';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { RobotIcon } from 'src/components/robot-icon/robot-icon';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { Slider } from 'src/components/slider/slider';
import { StyledTextInput } from 'src/components/styled-text-input/styled-text-input';
import { TruncatedText } from 'src/components/truncated-text';
import { useEtherlinkPublicClient } from 'src/hooks/evm/use-etherlink-public-client.hook';
import { useEvmChain } from 'src/hooks/evm/use-evm-chains.hook';
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';
import { StacksEnum } from 'src/navigator/enums/stacks.enum';
import { Shelter } from 'src/shelter/shelter';
import { dispatch as storeDispatch } from 'src/store';
import { useEvmAccountChainAssetsSelector } from 'src/store/evm/assets/evm-assets-selectors';
import { useEvmAccountChainBalancesSelector } from 'src/store/evm/balances/evm-balances-selectors';
import { useEvmChainExchangeRatesSelector } from 'src/store/evm/exchange-rates/evm-exchange-rates-selectors';
import { navigateAction } from 'src/store/root-state.actions';
import { useFiatToUsdRateSelector } from 'src/store/settings/settings-selectors';
import { useAllAccounts } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { showErrorToastByError } from 'src/toast/error-toast.utils';
import { showSuccessToast } from 'src/toast/toast.utils';
import { EvmAssetStandardEnum, EVM_TOKEN_SLUG } from 'src/token/interfaces/token-metadata.interface';
import { ETHERLINK_MAINNET_CHAIN_SPECS, toEvmNetworkEssentials } from 'src/types/networks';
import { getAccountAddressForEvm } from 'src/utils/account.utils';
import { getDollarValue } from 'src/utils/balance.utils';
import { buildEvmTransferRequest } from 'src/utils/evm/build-evm-transfer-request';
import { loadEtherlinkBalancesOnChain } from 'src/utils/evm/etherlink-balances.utils';
import { getViemWalletClient } from 'src/utils/rpc/evm-client.utils';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

import { EvmTransferConfirmationModalParams } from '../confirmation-modal.params';
import { useFeeFormInputStyles } from '../operations-confirmation/fee-form-input/fee-form-input.styles';
import { useOperationsConfirmationStyles } from '../operations-confirmation/operations-confirmation.styles';
import { useOperationsPreviewItemStyles } from '../operations-confirmation/operations-preview/operations-preview-item/operations-preview-item.styles';

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

export const EvmTransferConfirmation: FC<Props> = ({ accountId, asset, receiverAddress, atomicAmount }) => {
  const styles = useEvmTransferConfirmationStyles();
  const operationStyles = useOperationsConfirmationStyles();
  const feeFormStyles = useFeeFormInputStyles();
  const previewStyles = useOperationsPreviewItemStyles();
  const navigation = useNavigation();
  const { goBack } = navigation;
  const accounts = useAllAccounts();
  const sourceAccount = accounts.find(account => account.id === accountId);
  const sourceAddress = sourceAccount ? getAccountAddressForEvm(sourceAccount) : undefined;
  const chain = useEvmChain(ETHERLINK_MAINNET_CHAIN_ID);
  const publicClient = useEtherlinkPublicClient();
  const knownAssets = useEvmAccountChainAssetsSelector(sourceAddress, ETHERLINK_MAINNET_CHAIN_ID);
  const balances = useEvmAccountChainBalancesSelector(sourceAddress, ETHERLINK_MAINNET_CHAIN_ID);
  const evmExchangeRates = useEvmChainExchangeRatesSelector(ETHERLINK_MAINNET_CHAIN_ID);
  const fiatToUsdRate = useFiatToUsdRateSelector();

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
    navigation.setOptions({ headerTitle: () => <HeaderTitle title="Confirm Send" /> });
  }, [navigation]);

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
  const feeAsset = useMemo(
    () => ({
      ...asset,
      name: ETHERLINK_MAINNET_CHAIN_SPECS.currency.name,
      symbol: ETHERLINK_MAINNET_CHAIN_SPECS.currency.symbol,
      decimals: ETHERLINK_MAINNET_CHAIN_SPECS.currency.decimals,
      balance: fee?.toString() ?? '0',
      exchangeRate:
        evmExchangeRates[EVM_TOKEN_SLUG] !== undefined && fiatToUsdRate !== undefined
          ? evmExchangeRates[EVM_TOKEN_SLUG] * fiatToUsdRate
          : undefined
    }),
    [asset, evmExchangeRates, fee, fiatToUsdRate]
  );
  const feeFiatValue = useMemo(
    () => getDollarValue(feeAsset.balance, feeAsset.decimals, feeAsset.exchangeRate),
    [feeAsset.balance, feeAsset.decimals, feeAsset.exchangeRate]
  );
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
        operationUrl: `https://explorer.etherlink.com/tx/${hash}`,
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
        <Text style={operationStyles.sectionTitle}>Account</Text>
        <Divider />
        <View style={operationStyles.accountCard}>
          {sourceAccount ? <AccountDropdownItem account={sourceAccount} variant="card" /> : null}
        </View>
        <Divider size={formatSize(24)} />

        <Text style={operationStyles.sectionTitle}>Preview</Text>
        <Divider size={formatSize(12)} />
        <View style={operationStyles.divider} />
        <Divider size={formatSize(8)} />
        <View style={previewStyles.container}>
          <View style={previewStyles.contentWrapper}>
            <View style={previewStyles.infoContainer}>
              <RobotIcon seed={receiverAddress} size={formatSize(32)} />
              <Divider size={formatSize(10)} />
              <TruncatedText style={previewStyles.description}>Transfer to</TruncatedText>
            </View>
            <View style={previewStyles.hashContainer}>
              <PublicKeyHashText publicKeyHash={receiverAddress} />
            </View>
          </View>
          <Divider size={formatSize(8)} />
          <AssetValueText
            asset={asset}
            amount={atomicAmount}
            receiver={receiverAddress}
            showMinusSign
            style={previewStyles.amountToken}
          />
          <Divider size={formatSize(8)} />
          <AssetValueText
            convertToDollar
            asset={asset}
            amount={atomicAmount}
            showMinusSign
            style={previewStyles.amountDollar}
          />
        </View>

        <Divider size={formatSize(24)} />
        <View style={feeFormStyles.infoContainer}>
          <View style={[feeFormStyles.infoContainerItem, styles.feeInfoItem]}>
            <Text style={feeFormStyles.infoTitle}>Network fee:</Text>
            <Text style={feeFormStyles.infoFeeAmount}>{fee ? `${formatEther(fee)} XTZ` : 'Estimating...'}</Text>
            {!!fee && feeAsset.exchangeRate !== undefined && (
              <Text style={feeFormStyles.infoFeeValue}>
                (
                <FormattedAmount amount={feeFiatValue} hideApproximateSign isDollarValue />)
              </Text>
            )}
          </View>
        </View>

        <Divider size={formatSize(32)} />
        <View style={feeFormStyles.inputContainer}>
          <View style={feeFormStyles.sliderContainer}>
            {!isCustom && (
              <Slider value={presetIndex} minimumValue={0} maximumValue={2} step={1} onValueChange={setPresetIndex} />
            )}
            {isCustom && (
              <>
                <Label description="Gas price:" />
                <StyledTextInput
                  value={customGasPrice}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  onChangeText={setCustomGasPrice}
                />
              </>
            )}
          </View>
          <Divider size={formatSize(8)} />
          <TouchableOpacity style={feeFormStyles.toggleViewButton} onPress={() => setIsCustom(value => !value)}>
            <Icon name={isCustom ? IconNameEnum.X : IconNameEnum.Gear} size={formatSize(16)} />
          </TouchableOpacity>
        </View>

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
