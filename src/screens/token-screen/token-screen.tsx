import { BigNumber } from 'bignumber.js';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';

import { ActivityFeedList } from 'src/components/activity-feed/activity-feed-list';
import { BottomSheet } from 'src/components/bottom-sheet/bottom-sheet';
import { useBottomSheetController } from 'src/components/bottom-sheet/use-bottom-sheet-controller';
import { DropdownItemContainer } from 'src/components/dropdown/dropdown-item-container/dropdown-item-container';
import { DeadEndBoundaryError } from 'src/components/error-boundary';
import { HeaderButton } from 'src/components/header/header-button/header-button';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { TokenDropdownItemV2 } from 'src/components/token-dropdown/token-dropdown-item/token-dropdown-item';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import {
  MultichainDisplayedToken,
  useMultichainDisplayedTokens
} from 'src/hooks/evm/use-multichain-displayed-tokens.hook';
import { useActivityFeed } from 'src/hooks/use-activity-feed.hook';
import { useMemoWithCompare } from 'src/hooks/use-memo-with-compare';
import { useOnRampContinueOverlay } from 'src/hooks/use-on-ramp-continue-overlay.hook';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToModal, useNavigateToScreen, useScreenParams } from 'src/navigator/hooks/use-navigation.hook';
import { OnRampOverlay } from 'src/screens/wallet/on-ramp-overlay/on-ramp-overlay';
import { dispatch } from 'src/store';
import { navigateAction } from 'src/store/root-state.actions';
import {
  useIsSaplingBalanceLoadingSelector,
  useIsSaplingCredentialsLoadedSelector,
  useShieldedBalanceSelector
} from 'src/store/sapling';
import { loadSaplingTransactionHistoryActions } from 'src/store/sapling/sapling-actions';
import { useAssetExchangeRate } from 'src/store/settings/settings-selectors';
import { useScamTokenSlugsSelector } from 'src/store/tokens-metadata/tokens-metadata-selectors';
import { highPriorityLoadTokenBalanceAction, removeTokenAction } from 'src/store/wallet/wallet-actions';
import { useAccountAddressForTezos, useCurrentAccountId } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { TEZ_SHIELDED_TOKEN_METADATA, TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import type { TokenInterface } from 'src/token/interfaces/token.interface';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { toChainAssetSlug } from 'src/utils/chain-asset-slug';
import { isDefined } from 'src/utils/is-defined';
import { jsonEqualityFn } from 'src/utils/store.utils';

import { PrivateTezosTokenHistory } from './private-tezos-token-history/private-tezos-token-history';
import { getTokenPageTitles } from './token-page-summary/get-token-page-titles';
import { PUBLIC_TAB_INDEX, TokenPageSummary } from './token-page-summary/token-page-summary';
import { findDisplayedToken, toActivityAssetFilter, TokenScreenDescriptor } from './token-screen-descriptor';
import { useTokenScreenStyles } from './token-screen.styles';

const withZeroedBalances = (token: MultichainDisplayedToken): MultichainDisplayedToken => ({
  ...token,
  atomicBalance: '0',
  fiatValue: isDefined(token.fiatValue) ? 0 : undefined,
  shieldedAtomicBalance: isDefined(token.shieldedAtomicBalance) ? '0' : undefined,
  original: isDefined(token.original) ? { ...token.original, balance: '0' } : undefined
});

export const TokenScreen = () => {
  const { descriptor } = useScreenParams<ScreensEnum.TokenScreen>();
  const displayedTokens = useMultichainDisplayedTokens();

  const descriptorKey = toChainAssetSlug(descriptor.chainKind, descriptor.chainId, descriptor.slug);

  const resolvedToken = useMemoWithCompare(
    () => findDisplayedToken(displayedTokens, descriptor),
    [displayedTokens, descriptor],
    jsonEqualityFn
  );

  const lastResolvedRef = useRef<{ key: string; token: MultichainDisplayedToken } | undefined>(undefined);
  if (resolvedToken) {
    lastResolvedRef.current = { key: descriptorKey, token: resolvedToken };
  }
  const lastResolved = lastResolvedRef.current;

  // The ref outlives a token vanishing mid-session (send-whole-balance), never a descriptor change.
  // The page stays alive, but every balance is zeroed - the remembered amount is gone by definition.
  const token = useMemo(
    () => resolvedToken ?? (lastResolved?.key === descriptorKey ? withZeroedBalances(lastResolved.token) : undefined),
    [resolvedToken, lastResolved, descriptorKey]
  );

  if (!token) {
    throw new DeadEndBoundaryError();
  }

  return <TokenScreenContent key={descriptorKey} token={token} descriptor={descriptor} />;
};

interface TokenScreenContentProps {
  token: MultichainDisplayedToken;
  descriptor: TokenScreenDescriptor;
}

const TokenScreenContent = memo<TokenScreenContentProps>(({ token, descriptor }) => {
  const styles = useTokenScreenStyles();
  const navigateToScreen = useNavigateToScreen();
  const navigateToModal = useNavigateToModal();
  const accountId = useCurrentAccountId();
  const tezosAddress = useAccountAddressForTezos();
  const scamTokenSlugsRecord = useScamTokenSlugsSelector();
  const shieldedBalanceMutez = useShieldedBalanceSelector();
  const isSaplingCredentialsLoaded = useIsSaplingCredentialsLoadedSelector();
  const isSaplingBalanceLoading = useIsSaplingBalanceLoadingSelector();
  const tezExchangeRate = useAssetExchangeRate(TEZ_TOKEN_SLUG);
  const sendAssetsSheetController = useBottomSheetController();
  const { isOpened: onRampOverlayIsOpened, onClose: onOnRampOverlayClose } = useOnRampContinueOverlay();

  const isTezosKind = descriptor.chainKind === TempleChainKind.Tezos;
  const isTezosGasToken = isTezosKind && descriptor.slug === TEZ_TOKEN_SLUG;
  const original = token.original;
  const scam = isTezosKind ? scamTokenSlugsRecord[descriptor.slug] : undefined;

  const [historyTabIndex, setHistoryTabIndex] = useState(PUBLIC_TAB_INDEX);
  const isPrivateTab = isTezosGasToken && historyTabIndex !== PUBLIC_TAB_INDEX;

  const assetFilter = useMemo(() => toActivityAssetFilter(descriptor), [descriptor]);
  const {
    activities,
    isInitialLoading,
    isLoadingMore,
    isEmpty,
    isAllErrored,
    isAllLoaded,
    isRefreshing,
    handleLoadMore,
    handleRefresh
  } = useActivityFeed(assetFilter);

  useEffect(() => {
    // The gas token has no contract to query - its balance comes from the dedicated TEZ balance epic
    if (isTezosKind && tezosAddress != null && descriptor.slug !== TEZ_TOKEN_SLUG) {
      dispatch(highPriorityLoadTokenBalanceAction({ accountId, publicKeyHash: tezosAddress, slug: descriptor.slug }));
    }
  }, [accountId, tezosAddress, isTezosKind, descriptor.slug]);

  const { headerTitle } = getTokenPageTitles(token);

  const handleInfoIconClick = useCallback(
    () => navigateToScreen({ screen: ScreensEnum.TokenInfo, params: { descriptor } }),
    [navigateToScreen, descriptor]
  );

  useNavigationSetOptions(
    {
      headerTitle: () => <HeaderTitle title={headerTitle} />,
      headerRight: () => <HeaderButton iconName={IconNameV2Enum.Info} onPress={handleInfoIconClick} />
    },
    [headerTitle, handleInfoIconClick]
  );

  usePageAnalytic(ScreensEnum.TokenScreen, undefined, { chainKind: descriptor.chainKind, symbol: token.symbol });

  const handleHistoryTabChange = useCallback((index: number) => {
    setHistoryTabIndex(index);
    if (index !== PUBLIC_TAB_INDEX) {
      dispatch(loadSaplingTransactionHistoryActions.submit());
    }
  }, []);

  const handleRebalancePress = useCallback(() => dispatch(navigateAction({ screen: ModalsEnum.Rebalance })), []);

  const handleRemoveScamToken = useCallback(
    () =>
      Alert.alert(
        'Be cautious!',
        'This token may be a scam. We strongly advise removing it from your token list to safeguard against the risk of losing funds.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              dispatch(removeTokenAction(descriptor.slug));
              navigateToScreen({ screen: ScreensEnum.Wallet });
            }
          }
        ]
      ),
    [descriptor.slug, navigateToScreen]
  );

  const isSaplingAvailable =
    isTezosGasToken && (isSaplingCredentialsLoaded || isSaplingBalanceLoading || shieldedBalanceMutez !== '0');

  const shieldedTezToken: TokenInterface | undefined = useMemo(
    () =>
      isTezosGasToken
        ? {
            ...TEZ_SHIELDED_TOKEN_METADATA,
            balance: shieldedBalanceMutez,
            exchangeRate: tezExchangeRate,
            visibility: VisibilityEnum.Visible
          }
        : undefined,
    [isTezosGasToken, shieldedBalanceMutez, tezExchangeRate]
  );

  const publicTezToken: TokenInterface | undefined = useMemo(
    () =>
      isTezosGasToken && original
        ? {
            ...original,
            // `original.balance` on the gas row is the combined public + shielded amount
            balance: BigNumber.max(new BigNumber(original.balance).minus(shieldedBalanceMutez), 0).toFixed(),
            exchangeRate: tezExchangeRate
          }
        : undefined,
    [isTezosGasToken, original, shieldedBalanceMutez, tezExchangeRate]
  );

  const handleSendAsset = useCallback(
    (sendToken: TokenInterface) => {
      sendAssetsSheetController.close();
      navigateToModal(ModalsEnum.Send, { token: sendToken });
    },
    [sendAssetsSheetController, navigateToModal]
  );

  const handleSendPress = useCallback(() => sendAssetsSheetController.open(), [sendAssetsSheetController]);

  const summary = useMemo(
    () => (
      <TokenPageSummary
        token={token}
        scam={scam}
        historyTabIndex={isTezosGasToken ? historyTabIndex : undefined}
        onHistoryTabChange={isTezosGasToken ? handleHistoryTabChange : undefined}
        onRebalancePress={isTezosGasToken ? handleRebalancePress : undefined}
        onSendPress={isSaplingAvailable ? handleSendPress : undefined}
        onRemoveScamToken={handleRemoveScamToken}
      />
    ),
    [
      token,
      scam,
      isTezosGasToken,
      historyTabIndex,
      handleHistoryTabChange,
      handleRebalancePress,
      isSaplingAvailable,
      handleSendPress,
      handleRemoveScamToken
    ]
  );

  return (
    <>
      {isPrivateTab ? (
        <PrivateTezosTokenHistory headerComponent={summary} />
      ) : (
        <ActivityFeedList
          activities={activities}
          isInitialLoading={isInitialLoading}
          isEmpty={isEmpty}
          isAllErrored={isAllErrored}
          isAllLoaded={isAllLoaded}
          isLoadingMore={isLoadingMore}
          isRefreshing={isRefreshing}
          withPromotion
          faceAssetFilter={assetFilter}
          headerComponent={summary}
          onEndReached={handleLoadMore}
          onRefresh={handleRefresh}
          pageName="Token page"
        />
      )}

      {isTezosGasToken && publicTezToken && shieldedTezToken && (
        <BottomSheet description="Assets" contentHeight={formatSize(258)} controller={sendAssetsSheetController}>
          <View style={styles.sendAssetsListContainer}>
            <TouchableOpacity onPress={() => handleSendAsset(publicTezToken)}>
              <DropdownItemContainer hasMargin>
                <TokenDropdownItemV2 token={publicTezToken} />
              </DropdownItemContainer>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSendAsset(shieldedTezToken)}>
              <DropdownItemContainer hasMargin>
                <TokenDropdownItemV2 token={shieldedTezToken} />
              </DropdownItemContainer>
            </TouchableOpacity>
          </View>
        </BottomSheet>
      )}

      {isTezosKind && <OnRampOverlay isStart={false} onClose={onOnRampOverlayClose} isOpen={onRampOverlayIsOpened} />}
    </>
  );
});
