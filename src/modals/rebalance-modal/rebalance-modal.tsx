import { BigNumber } from 'bignumber.js';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

import { AssetAmountInput, AssetAmountInterface } from 'src/components/asset-amount-input/asset-amount-input';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { Divider } from 'src/components/divider/divider';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableIcon } from 'src/components/icon/touchable-icon/touchable-icon';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { emptyFn } from 'src/config/general';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useShieldedBalanceSelector, useSaplingAddressSelector } from 'src/store/sapling';
import { prepareSaplingTransactionActions } from 'src/store/sapling/sapling-actions';
import { useAssetExchangeRate } from 'src/store/settings/settings-selectors';
import { useCurrentAccountTezosBalance, useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { showErrorToast } from 'src/toast/toast.utils';
import { TEZ_TOKEN_SLUG, TEZ_TOKEN_METADATA, TEZ_SHIELDED_TOKEN_METADATA } from 'src/token/data/tokens-metadata';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { RebalanceDirection } from './rebalance-modal.form';
import { RebalanceModalSelectors } from './rebalance-modal.selectors';
import { useRebalanceModalStyles } from './rebalance-modal.styles';

const selectionOptions = { start: 0, end: 0 };

const createToken = (metadata: typeof TEZ_TOKEN_METADATA, balance: string, exchangeRate?: number): TokenInterface => ({
  ...metadata,
  balance,
  exchangeRate,
  visibility: VisibilityEnum.Visible
});

export const RebalanceModal: FC = () => {
  const dispatch = useDispatch();
  const colors = useColors();
  const styles = useRebalanceModalStyles();

  const [direction, setDirection] = useState<RebalanceDirection>('shield');
  const [sourceAmount, setSourceAmount] = useState<BigNumber | undefined>(undefined);

  const publicBalanceMutez = useCurrentAccountTezosBalance();
  const shieldedBalanceMutez = useShieldedBalanceSelector();
  const saplingAddress = useSaplingAddressSelector();
  const accountPkh = useCurrentAccountPkhSelector();
  const tezExchangeRate = useAssetExchangeRate(TEZ_TOKEN_SLUG);

  usePageAnalytic(ModalsEnum.Rebalance);

  const tezPublicToken = useMemo(
    () => createToken(TEZ_TOKEN_METADATA, publicBalanceMutez, tezExchangeRate),
    [publicBalanceMutez, tezExchangeRate]
  );
  const tezShieldedToken = useMemo(
    () => createToken(TEZ_SHIELDED_TOKEN_METADATA, shieldedBalanceMutez, tezExchangeRate),
    [shieldedBalanceMutez, tezExchangeRate]
  );

  const sourceToken = direction === 'shield' ? tezPublicToken : tezShieldedToken;
  const destToken = direction === 'shield' ? tezShieldedToken : tezPublicToken;
  const sourceLabel = direction === 'shield' ? 'Public' : 'Shielded';
  const destLabel = direction === 'shield' ? 'Shielded' : 'Public';
  const sourceBalanceMutez = direction === 'shield' ? publicBalanceMutez : shieldedBalanceMutez;
  const destBalanceMutez = direction === 'shield' ? shieldedBalanceMutez : publicBalanceMutez;

  const sourceAssetsList = useMemo(() => [sourceToken], [sourceToken]);
  const destAssetsList = useMemo(() => [destToken], [destToken]);

  const sourceValue = useMemo<AssetAmountInterface>(
    () => ({ asset: sourceToken, amount: sourceAmount }),
    [sourceToken, sourceAmount]
  );
  const destValue = useMemo<AssetAmountInterface>(
    () => ({ asset: destToken, amount: sourceAmount }),
    [destToken, sourceAmount]
  );

  const handleSourceChange = useCallback((newValue: AssetAmountInterface) => {
    setSourceAmount(newValue.amount);
  }, []);

  const handleSwapDirection = useCallback(() => {
    setDirection(prev => (prev === 'shield' ? 'unshield' : 'shield'));
    setSourceAmount(undefined);
  }, []);

  const isAmountValid = useMemo(() => {
    if (!sourceAmount || sourceAmount.isLessThanOrEqualTo(0)) {
      return false;
    }

    return sourceAmount.isLessThanOrEqualTo(new BigNumber(sourceBalanceMutez));
  }, [sourceAmount, sourceBalanceMutez]);

  const handleReview = useCallback(() => {
    if (!sourceAmount || !isAmountValid) {
      return;
    }

    const amountMutez = sourceAmount.toFixed(0);

    if (direction === 'shield') {
      if (saplingAddress == null) {
        showErrorToast({ description: 'Sapling address not available' });

        return;
      }

      dispatch(
        prepareSaplingTransactionActions.submit({
          type: 'shield',
          amount: amountMutez,
          recipientAddress: saplingAddress,
          isRebalance: true
        })
      );
    } else {
      dispatch(
        prepareSaplingTransactionActions.submit({
          type: 'unshield',
          amount: amountMutez,
          recipientAddress: accountPkh,
          isRebalance: true
        })
      );
    }
  }, [sourceAmount, isAmountValid, direction, dispatch, saplingAddress, accountPkh]);

  return (
    <>
      <ScreenContainer>
        <ModalStatusBar />

        <Divider size={formatSize(8)} />

        <AssetAmountInput
          label={sourceLabel}
          value={sourceValue}
          assetsList={sourceAssetsList}
          balance={sourceBalanceMutez}
          isSingleAsset
          maxButton
          toUsdToggle
          editable
          onValueChange={handleSourceChange}
          testID={RebalanceModalSelectors.sourceInput}
        />

        <View style={styles.swapButtonContainer}>
          <TouchableIcon
            onPress={handleSwapDirection}
            name={IconNameEnum.SwapArrow}
            size={formatSize(24)}
            color={colors.orange}
            testID={RebalanceModalSelectors.swapDirectionButton}
          />
        </View>

        <AssetAmountInput
          label={destLabel}
          value={destValue}
          assetsList={destAssetsList}
          balance={destBalanceMutez}
          selectionOptions={selectionOptions}
          isSingleAsset
          editable={false}
          toUsdToggle={false}
          maxButton={false}
          onValueChange={emptyFn}
          testID={RebalanceModalSelectors.destInput}
        />
      </ScreenContainer>

      <ButtonsFloatingContainer>
        <ButtonLargePrimary
          title="Review"
          disabled={!isAmountValid}
          onPress={handleReview}
          testID={RebalanceModalSelectors.reviewButton}
        />
        <InsetSubstitute type="bottom" />
      </ButtonsFloatingContainer>
    </>
  );
};
