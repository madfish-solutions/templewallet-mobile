import { BigNumber } from 'bignumber.js';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';

import { AssetAmountInputV2, AssetAmountInterface } from 'src/components/asset-amount-input/asset-amount-input';
import { BridgeNotes } from 'src/components/bridge-notes/bridge-notes';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { Divider } from 'src/components/divider/divider';
import { DeadEndBoundaryError } from 'src/components/error-boundary';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { InterfaceDisclaimer } from 'src/components/interface-disclaimer/interface-disclaimer';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { TouchableIconV2 } from 'src/components/touchable-icon-v2';
import { ETHERLINK_BRIDGE_URL } from 'src/config/etherlink-bridge';
import { emptyFn } from 'src/config/general';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useBridgeAccountAddresses } from 'src/hooks/use-bridge-account-addresses.hook';
import { AssetInterface } from 'src/interfaces/asset.interface';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigateToModal } from 'src/navigator/hooks/use-navigation.hook';
import { useEvmAccountChainBalancesSelector } from 'src/store/evm/balances/evm-balances-selectors';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { showErrorToast } from 'src/toast/toast.utils';
import { TEZ_TOKEN_DECIMALS } from 'src/token/data/tokens-metadata';
import { EvmAssetStandardEnum, EVM_TOKEN_SLUG } from 'src/token/interfaces/token-metadata.interface';
import { ETHERLINK_MAINNET_CHAIN_SPECS } from 'src/types/networks';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics, usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { EvmDisplayedAsset } from 'src/utils/assets/evm';
import { toTezosSendAsset } from 'src/utils/assets/tezos-send-asset.mapper';
import { toChainAssetSlug } from 'src/utils/chain-asset-slug';
import { weiToMutez } from 'src/utils/etherlink-bridge/fast-withdrawal';
import { BridgeDirection } from 'src/utils/etherlink-bridge/types';
import { isPositiveNumber } from 'src/utils/number.util';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';
import { tzToMutez } from 'src/utils/tezos.util';
import { useTezosTokenOfCurrentAccount } from 'src/utils/wallet.utils';

import { BridgeModalSelectors } from './bridge-modal.selectors';
import { useBridgeModalStyles, useDestInputStylesConfig, useSourceInputStylesConfig } from './bridge-modal.styles';
import {
  FAST_WITHDRAWAL_UNAVAILABLE_MESSAGE,
  FastWithdrawalQuote,
  useFastWithdrawalQuote
} from './hooks/use-fast-withdrawal-quote';

const selectionOptions = { start: 0, end: 0 };
const XTZ_SYMBOL = ETHERLINK_MAINNET_CHAIN_SPECS.currency.symbol;
const EXPECTED_WITHDRAWAL_GAS_EXPENSE = 0.05;
const GAS_RESERVE_MESSAGE = `Keep at least ${EXPECTED_WITHDRAWAL_GAS_EXPENSE} ${XTZ_SYMBOL} for the network fee`;
const INSUFFICIENT_BALANCE_MESSAGE = 'Insufficient balance';

export const BridgeModal = () => {
  const navigateToModal = useNavigateToModal();
  const colors = useColors();
  const styles = useBridgeModalStyles();
  const sourceStylesConfig = useSourceInputStylesConfig();
  const destStylesConfig = useDestInputStylesConfig();
  const addresses = useBridgeAccountAddresses();

  if (!addresses) {
    throw new DeadEndBoundaryError();
  }

  const { evmAddress } = addresses;

  const [direction, setDirection] = useState<BridgeDirection>('deposit');
  const [amount, setAmount] = useState<BigNumber | undefined>(undefined);
  const [isReviewing, setIsReviewing] = useState(false);
  const isMountedRef = useRef(true);
  const isWithdraw = direction === 'withdraw';

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  usePageAnalytic(ModalsEnum.Bridge);
  const { trackEvent } = useAnalytics();

  const tezosToken = useTezosTokenOfCurrentAccount();
  const tezBalance = tezosToken.balance;
  const evmBalances = useEvmAccountChainBalancesSelector(evmAddress, ETHERLINK_MAINNET_CHAIN_ID);

  const xtzBalance = useMemo(
    () => weiToMutez(new BigNumber(evmBalances[EVM_TOKEN_SLUG] ?? 0)).toFixed(),
    [evmBalances]
  );
  const withdrawMaxAmount = useMemo(
    () =>
      BigNumber.max(
        new BigNumber(xtzBalance).minus(tzToMutez(new BigNumber(EXPECTED_WITHDRAWAL_GAS_EXPENSE), TEZ_TOKEN_DECIMALS)),
        0
      ),
    [xtzBalance]
  );

  const tezAsset = useMemo(() => toTezosSendAsset(tezosToken), [tezosToken]);
  const xtzAsset = useMemo<EvmDisplayedAsset>(
    () => ({
      name: ETHERLINK_MAINNET_CHAIN_SPECS.currency.name,
      symbol: XTZ_SYMBOL,
      decimals: TEZ_TOKEN_DECIMALS,
      iconName: CryptoLogoNameEnum.Etherlink,
      balance: xtzBalance,
      exchangeRate: tezosToken.exchangeRate,
      assetKey: toChainAssetSlug(
        { chainKind: TempleChainKind.EVM, chainId: ETHERLINK_MAINNET_CHAIN_ID },
        EVM_TOKEN_SLUG
      ),
      assetSlug: EVM_TOKEN_SLUG,
      chainKind: TempleChainKind.EVM,
      chainId: ETHERLINK_MAINNET_CHAIN_ID,
      networkName: ETHERLINK_MAINNET_CHAIN_SPECS.name,
      standard: EvmAssetStandardEnum.NATIVE
    }),
    [xtzBalance, tezosToken.exchangeRate]
  );

  const sourceAsset: AssetInterface = isWithdraw ? xtzAsset : tezAsset;
  const destAsset: AssetInterface = isWithdraw ? tezAsset : xtzAsset;
  const sourceBalance = isWithdraw ? xtzBalance : tezBalance;
  const destBalance = isWithdraw ? tezBalance : xtzBalance;

  const sourceAssetsList = useMemo(() => [sourceAsset], [sourceAsset]);
  const destAssetsList = useMemo(() => [destAsset], [destAsset]);

  const {
    feeRate,
    receiveMutez,
    errorMessage: quoteErrorMessage,
    fetchFreshQuote
  } = useFastWithdrawalQuote(isWithdraw, amount);
  const receiveAmount = isWithdraw ? receiveMutez : amount;

  const balanceErrorMessage = useMemo(() => {
    if (!amount) {
      return undefined;
    }

    if (amount.isGreaterThan(sourceBalance)) {
      return INSUFFICIENT_BALANCE_MESSAGE;
    }

    return isWithdraw && amount.isGreaterThan(withdrawMaxAmount) ? GAS_RESERVE_MESSAGE : undefined;
  }, [amount, sourceBalance, isWithdraw, withdrawMaxAmount]);

  const errorMessage = balanceErrorMessage ?? quoteErrorMessage;
  const isAmountValid = isPositiveNumber(amount) && errorMessage === undefined && isPositiveNumber(receiveAmount);

  const sourceValue = useMemo<AssetAmountInterface<AssetInterface>>(
    () => ({ asset: sourceAsset, amount }),
    [sourceAsset, amount]
  );
  const destValue = useMemo<AssetAmountInterface<AssetInterface>>(
    () => ({ asset: destAsset, amount: receiveAmount }),
    [destAsset, receiveAmount]
  );

  const handleSourceChange = useCallback((newValue: AssetAmountInterface<AssetInterface>) => {
    setAmount(newValue.amount);
  }, []);

  const handleSwapDirection = useCallback(() => {
    setDirection(prev => (prev === 'deposit' ? 'withdraw' : 'deposit'));
    setAmount(undefined);
  }, []);

  const reviewTestIDProperties = useMemo(() => ({ direction }), [direction]);

  const handleReview = useCallback(async () => {
    if (!amount || !isAmountValid) {
      return;
    }

    const amountMutez = amount.toFixed(0);

    if (!isWithdraw) {
      trackEvent('BRIDGE_FORM_SUBMIT_SUCCESS', AnalyticsEventCategory.FormSubmitSuccess, {
        direction: 'deposit',
        amount: amountMutez
      });
      navigateToModal(ModalsEnum.Confirmation, { type: ConfirmationTypeEnum.BridgeDepositOperation, amountMutez });

      return;
    }

    setIsReviewing(true);

    let freshQuote: FastWithdrawalQuote | undefined;

    try {
      freshQuote = await fetchFreshQuote(amount);
    } catch {
      showErrorToast({ description: FAST_WITHDRAWAL_UNAVAILABLE_MESSAGE });

      return;
    } finally {
      setIsReviewing(false);
    }

    if (!isMountedRef.current || !freshQuote) {
      return;
    }

    if (receiveAmount && freshQuote.receiveMutez.isLessThan(receiveAmount)) {
      showErrorToast({
        title: 'Fee changed',
        description: 'The fast withdrawal fee went up. Check the new amount and review again.'
      });

      return;
    }

    const freshFeeRate = freshQuote.feeRate.toFixed();

    trackEvent('BRIDGE_FORM_SUBMIT_SUCCESS', AnalyticsEventCategory.FormSubmitSuccess, {
      direction: 'withdraw',
      amount: amountMutez,
      feeRate: freshFeeRate
    });
    navigateToModal(ModalsEnum.Confirmation, {
      type: ConfirmationTypeEnum.BridgeWithdrawOperation,
      amountMutez,
      receiveMutez: freshQuote.receiveMutez.toFixed(0),
      feeRate: freshFeeRate
    });
  }, [amount, isAmountValid, isWithdraw, receiveAmount, fetchFreshQuote, navigateToModal, trackEvent]);

  return (
    <>
      <ScreenContainer>
        <ModalStatusBar />

        <Divider size={formatSize(8)} />

        <AssetAmountInputV2
          label="From"
          value={sourceValue}
          assetsList={sourceAssetsList}
          balance={sourceBalance}
          isSingleAsset
          maxButton
          maxAmount={isWithdraw ? withdrawMaxAmount : undefined}
          maxButtonDisabled={isReviewing}
          toUsdToggle
          showTokenNameForValue
          editable={!isReviewing}
          isError={errorMessage !== undefined}
          footerErrorMessage={errorMessage}
          stylesConfig={sourceStylesConfig}
          onValueChange={handleSourceChange}
          testID={BridgeModalSelectors.sourceInput}
        />

        <View style={styles.swapButtonContainer}>
          <TouchableIconV2
            onPress={handleSwapDirection}
            disabled={isReviewing}
            name={IconNameV2Enum.ArrowUpDown}
            size={formatSize(24)}
            iconSize={24}
            color={colors.orange}
            testID={BridgeModalSelectors.swapDirectionButton}
          />
        </View>

        <AssetAmountInputV2
          label="To"
          value={destValue}
          assetsList={destAssetsList}
          balance={destBalance}
          selectionOptions={selectionOptions}
          isSingleAsset
          editable={false}
          toUsdToggle={false}
          maxButton={false}
          showTokenNameForValue
          stylesConfig={destStylesConfig}
          onValueChange={emptyFn}
          testID={BridgeModalSelectors.destInput}
        />

        <BridgeNotes
          direction={direction}
          amountMutez={amount}
          receiveMutez={receiveAmount}
          feeRate={feeRate}
          style={styles.notes}
        />

        <View style={styles.disclaimerContainer}>
          <InterfaceDisclaimer linkText="Tezos Bridge." url={ETHERLINK_BRIDGE_URL} />
        </View>
      </ScreenContainer>

      <ButtonsFloatingContainer>
        <ButtonLargePrimary
          title="Review"
          disabled={!isAmountValid || isReviewing}
          isLoading={isReviewing}
          onPress={handleReview}
          testID={BridgeModalSelectors.reviewButton}
          testIDProperties={reviewTestIDProperties}
        />
        <InsetSubstitute type="bottom" />
      </ButtonsFloatingContainer>
    </>
  );
};
