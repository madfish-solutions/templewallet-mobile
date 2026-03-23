import { BigNumber } from 'bignumber.js';
import React, { useCallback, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { BottomSheet } from 'src/components/bottom-sheet/bottom-sheet';
import { useBottomSheetController } from 'src/components/bottom-sheet/use-bottom-sheet-controller';
import { Divider } from 'src/components/divider/divider';
import { DropdownItemContainer } from 'src/components/dropdown/dropdown-item-container/dropdown-item-container';
import { HeaderButton } from 'src/components/header/header-button/header-button';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { HeaderCard } from 'src/components/header-card/header-card';
import { HeaderCardActionButtons } from 'src/components/header-card-action-buttons/header-card-action-buttons';
import { HideBalance } from 'src/components/hide-balance/hide-balance';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { TokenDropdownItem } from 'src/components/token-dropdown/token-dropdown-item/token-dropdown-item';
import { TokenEquityValue } from 'src/components/token-equity-value/token-equity-value';
import { TokenScreenContentContainer } from 'src/components/token-screen-content-container/token-screen-content-container';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToModal, useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { navigateAction } from 'src/store/root-state.actions';
import { useIsSaplingCredentialsLoadedSelector, useShieldedBalanceSelector } from 'src/store/sapling';
import { useAssetExchangeRate } from 'src/store/settings/settings-selectors';
import { useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { TEZ_TOKEN_METADATA, TEZ_TOKEN_SLUG, TEZ_SHIELDED_TOKEN_METADATA } from 'src/token/data/tokens-metadata';
import type { TokenInterface } from 'src/token/interfaces/token.interface';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { mutezToTz } from 'src/utils/tezos.util';
import { useTezosTokenOfCurrentAccount } from 'src/utils/wallet.utils';

import { TezosTokenHistory } from './tezos-token-history/tezos-token-history';
import { useTezosTokenScreenStyles } from './tezos-token-screen.styles';

export const TezosTokenScreen = () => {
  const dispatch = useDispatch();
  const navigateToScreen = useNavigateToScreen();
  const navigateToModal = useNavigateToModal();
  const accountPkh = useCurrentAccountPkhSelector();
  const tezosToken = useTezosTokenOfCurrentAccount();
  const shieldedBalanceMutez = useShieldedBalanceSelector();
  const isCredentialsLoaded = useIsSaplingCredentialsLoadedSelector();
  const styles = useTezosTokenScreenStyles();
  const colors = useColors();
  const sendAssetsSheetController = useBottomSheetController();
  const tezExchangeRate = useAssetExchangeRate(TEZ_TOKEN_SLUG);

  const showBalanceSplit = isCredentialsLoaded;

  const combinedToken = useMemo(() => {
    if (!showBalanceSplit) {
      return tezosToken;
    }

    const combinedBalance = new BigNumber(tezosToken.balance).plus(shieldedBalanceMutez).toFixed();

    return { ...tezosToken, balance: combinedBalance };
  }, [tezosToken, shieldedBalanceMutez, showBalanceSplit]);

  const formattedPublicBalance = useMemo(() => {
    if (!showBalanceSplit || !tezosToken.balance) {
      return '';
    }

    return mutezToTz(new BigNumber(tezosToken.balance), TEZ_TOKEN_METADATA.decimals).toFormat();
  }, [showBalanceSplit, tezosToken.balance]);

  const formattedShieldedBalance = useMemo(() => {
    if (!showBalanceSplit) {
      return '';
    }

    return mutezToTz(new BigNumber(shieldedBalanceMutez), TEZ_TOKEN_METADATA.decimals).toFormat();
  }, [showBalanceSplit, shieldedBalanceMutez]);

  const shieldedTezToken: TokenInterface | undefined = useMemo(() => {
    if (!showBalanceSplit || shieldedBalanceMutez === '0') {
      return undefined;
    }

    return {
      ...TEZ_SHIELDED_TOKEN_METADATA,
      balance: shieldedBalanceMutez,
      exchangeRate: tezExchangeRate,
      visibility: VisibilityEnum.Visible
    };
  }, [showBalanceSplit, shieldedBalanceMutez, tezExchangeRate]);

  const publicTezToken: TokenInterface = useMemo(
    () => ({
      ...tezosToken,
      exchangeRate: tezExchangeRate
    }),
    [tezosToken, tezExchangeRate]
  );

  usePageAnalytic(ScreensEnum.TezosTokenScreen);

  const handleInfoIconClick = useCallback(
    () => navigateToScreen({ screen: ScreensEnum.TokenInfo, params: { token: tezosToken } }),
    [navigateToScreen, tezosToken]
  );

  const handleRebalancePress = useCallback(() => {
    dispatch(navigateAction({ screen: ModalsEnum.Rebalance }));
  }, [dispatch]);

  const handleSendPress = useCallback(() => {
    if (shieldedTezToken) {
      sendAssetsSheetController.open();
    } else {
      navigateToModal(ModalsEnum.Send, { token: tezosToken });
    }
  }, [shieldedTezToken, sendAssetsSheetController, navigateToModal, tezosToken]);

  const handleSendAsset = useCallback(
    (token: TokenInterface) => {
      sendAssetsSheetController.close();
      navigateToModal(ModalsEnum.Send, { token });
    },
    [sendAssetsSheetController, navigateToModal]
  );

  useNavigationSetOptions(
    {
      headerRight: () => <HeaderButton iconName={IconNameEnum.InfoAlt} onPress={handleInfoIconClick} />
    },
    [tezosToken]
  );

  return (
    <>
      <HeaderCard>
        <TokenEquityValue token={combinedToken} />
        <Divider size={formatSize(4)} />
        <PublicKeyHashText publicKeyHash={accountPkh} marginTop={0} />

        {showBalanceSplit && (
          <View style={styles.balanceSplitRow}>
            <View style={styles.balancePill}>
              <Text style={styles.balancePillText}>Public:</Text>
              <HideBalance style={styles.balancePillTextNumber}>{formattedPublicBalance}</HideBalance>
            </View>

            <TouchableOpacity onPress={handleRebalancePress} style={styles.rebalanceButton}>
              <Icon name={IconNameEnum.SwapArrow} size={formatSize(16)} color={colors.blue} />
            </TouchableOpacity>

            <View style={styles.balancePill}>
              <Text style={styles.balancePillText}>Shielded:</Text>
              <HideBalance style={styles.balancePillTextNumber}>{formattedShieldedBalance}</HideBalance>
            </View>
          </View>
        )}

        <HeaderCardActionButtons token={tezosToken} onSendPress={shieldedTezToken ? handleSendPress : undefined} />
      </HeaderCard>

      <TokenScreenContentContainer historyComponent={<TezosTokenHistory />} token={tezosToken} />

      <BottomSheet description="Assets" contentHeight={formatSize(258)} controller={sendAssetsSheetController}>
        <View style={styles.sendAssetsListContainer}>
          <TouchableOpacity onPress={() => handleSendAsset(publicTezToken)}>
            <DropdownItemContainer hasMargin>
              <TokenDropdownItem token={publicTezToken} />
            </DropdownItemContainer>
          </TouchableOpacity>
          {shieldedTezToken && (
            <TouchableOpacity onPress={() => handleSendAsset(shieldedTezToken)}>
              <DropdownItemContainer hasMargin>
                <TokenDropdownItem token={shieldedTezToken} />
              </DropdownItemContainer>
            </TouchableOpacity>
          )}
        </View>
      </BottomSheet>
    </>
  );
};
