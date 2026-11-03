import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';
import { useDispatch } from 'react-redux';

import { LIMIT_FIN_FEATURES } from 'src/config/system';
import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import {
  buildTezosDisplayedToken,
  MultichainDisplayedToken,
  useMultichainDisplayedTokens
} from 'src/hooks/evm/use-multichain-displayed-tokens.hook';
import { useAtBootsplash } from 'src/hooks/use-hide-bootsplash';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { useTotalBalance } from 'src/hooks/use-total-balance';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToModal, useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { WalletSelectors } from 'src/screens/wallet/wallet.selectors';
import { useAppLock } from 'src/shelter/app-lock/app-lock';
import { setOnRampOverlayStateAction } from 'src/store/settings/settings-actions';
import { useIsShowLoaderSelector } from 'src/store/settings/settings-selectors';
import { useAccount, useAccountAddressForEvm } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/toast.utils';
import { TEZ_TOKEN_SLUG, TEZ_TOKEN_SYMBOL } from 'src/token/data/tokens-metadata';
import { EVM_TOKEN_SLUG } from 'src/token/interfaces/token-metadata.interface';
import { emptyToken } from 'src/token/interfaces/token.interface';
import { getAccountAddressForTezos } from 'src/utils/account.utils';
import { toChainAssetSlug } from 'src/utils/chain-asset-slug';
import { isDefined } from 'src/utils/is-defined';
import { isPositiveNumber } from 'src/utils/number.util';
import { useTezosTokenOfCurrentAccount } from 'src/utils/wallet.utils';

import { ButtonMediumV2 } from '../button/button-medium/button-medium';
import { useButtonMediumStyleConfigV2 } from '../button/button-medium/button-medium.styles';
import { ButtonsContainer } from '../button/buttons-container/buttons-container';
import { IconNameV2Enum } from '../icon-v2/icon-name.enum';

import { useHeaderCardActionButtonsStyles } from './header-card-action-buttons.styles';

interface Props {
  token?: MultichainDisplayedToken;
  onSendPress?: EmptyFn;
  style?: StyleProp<ViewStyle>;
}

export const HeaderCardActionButtons = memo<Props>(({ token, onSendPress, style }) => {
  const dispatch = useDispatch();
  const navigateToModal = useNavigateToModal();
  const navigateToScreen = useNavigateToScreen();
  const { isLocked } = useAppLock();
  const atBootsplash = useAtBootsplash();
  const selectedAccount = useAccount();
  const { isTezosMainnet } = useNetworkInfo();
  const tezosToken = useTezosTokenOfCurrentAccount();
  const multichainDisplayedTokens = useMultichainDisplayedTokens();
  const evmAddress = useAccountAddressForEvm();
  const totalBalance = useTotalBalance();
  const styles = useHeaderCardActionButtonsStyles();
  const defaultStyleConfig = useButtonMediumStyleConfigV2();
  const isLoaderBeingShown = useIsShowLoaderSelector();
  const canUseTezos = Boolean(getAccountAddressForTezos(selectedAccount));

  const evmGasTokens = useMemo(
    () =>
      multichainDisplayedTokens.filter(
        token => token.chainKind === TempleChainKind.EVM && token.slug === EVM_TOKEN_SLUG
      ),
    [multichainDisplayedTokens]
  );
  const tezosMultichainToken = useMemo(
    () =>
      multichainDisplayedTokens.find(
        token => token.chainKind === TempleChainKind.Tezos && token.slug === TEZ_TOKEN_SLUG
      ) ?? buildTezosDisplayedToken(tezosToken, undefined),
    [multichainDisplayedTokens, tezosToken]
  );

  const tokenWithFallback = useMemo(() => {
    if (token) {
      return token;
    }

    if (tezosMultichainToken.atomicBalance !== emptyToken.balance) {
      return tezosMultichainToken;
    }

    const evmGasToken = evmGasTokens.find(gasToken => gasToken.atomicBalance !== emptyToken.balance);

    return evmGasToken ?? tezosMultichainToken;
  }, [token, tezosMultichainToken, evmGasTokens]);

  const isTezosKind = tokenWithFallback.chainKind === TempleChainKind.Tezos;
  const original = tokenWithFallback.original;
  const tezosAtomicBalance = tezosMultichainToken.atomicBalance;
  const tokenAtomicBalance = tokenWithFallback.atomicBalance;

  // The gas-fee message fires only when the page's token IS the gas token (address match)
  const isTezBalanceTooLow =
    isTezosKind &&
    isDefined(original?.address) &&
    original.address === tezosMultichainToken.original?.address &&
    tezosAtomicBalance === emptyToken.balance;
  const errorMessage = isTezBalanceTooLow ? `You need to have ${TEZ_TOKEN_SYMBOL} to pay gas fee` : 'Balance is zero';

  const emptyBalance =
    isTezosKind && token
      ? (original?.balance ?? tokenAtomicBalance) === emptyToken.balance || tezosAtomicBalance === emptyToken.balance
      : !isPositiveNumber(tokenAtomicBalance);
  const disabledSendButton = isTezosKind
    ? !canUseTezos || (emptyBalance && LIMIT_FIN_FEATURES)
    : evmAddress == null || (emptyBalance && LIMIT_FIN_FEATURES);

  const actionButtonStylesOverrides = {
    titleStyle: styles.actionButtonTitle
  };

  const animationPlayedTimesCount = useRef(0);
  const earnIconTranslateYRef = useRef(new Animated.Value(0));

  const playAnimation = useCallback(() => {
    if (animationPlayedTimesCount.current < 3) {
      earnIconTranslateYRef.current.setValue(formatSize(-8));
      Animated.spring(earnIconTranslateYRef.current, { toValue: 0, friction: 2, useNativeDriver: true }).start();
      animationPlayedTimesCount.current++;
    }
  }, []);

  useEffect(() => {
    if (isLocked || atBootsplash) {
      animationPlayedTimesCount.current = 0;

      return;
    }

    if (isLoaderBeingShown) {
      return;
    }

    playAnimation();
    const animationInterval = setInterval(playAnimation, 4000);

    return () => void clearInterval(animationInterval);
  }, [isLocked, atBootsplash, isLoaderBeingShown, playAnimation]);

  const earnButtonStylesOverrides = {
    ...actionButtonStylesOverrides,
    iconStyle: { ...defaultStyleConfig.iconStyle, translateY: earnIconTranslateYRef.current }
  };

  const sendButtonStylesOverrides = {
    titleStyle: styles.actionButtonTitle,
    activeColorConfig: disabledSendButton
      ? defaultStyleConfig.disabledColorConfig
      : defaultStyleConfig.activeColorConfig
  };

  const handleSendButton = () => {
    if (emptyBalance) {
      showErrorToast({ description: errorMessage });

      if (isTezosKind && isTezBalanceTooLow && !LIMIT_FIN_FEATURES) {
        dispatch(setOnRampOverlayStateAction(OnRampOverlayState.Continue));
      }

      return;
    }

    if (onSendPress) {
      return onSendPress();
    }

    if (!isTezosKind) {
      return navigateToModal(ModalsEnum.Send, {
        assetKey: toChainAssetSlug(tokenWithFallback, tokenWithFallback.slug)
      });
    }

    if (original) {
      return navigateToModal(ModalsEnum.Send, { token: original });
    }
  };

  return (
    <ButtonsContainer style={[styles.buttonsContainer, style]}>
      <ButtonMediumV2
        title="Receive"
        iconName={IconNameV2Enum.ArrowDown}
        onPress={() =>
          navigateToModal(
            ModalsEnum.Receive,
            token ? { chainKind: token.chainKind, withShielded: isTezosKind && token.slug === TEZ_TOKEN_SLUG } : {}
          )
        }
        styleConfigOverrides={actionButtonStylesOverrides}
        style={styles.buttonContainer}
        testID={WalletSelectors.receiveButton}
      />

      {((isTezosKind && !LIMIT_FIN_FEATURES) || !token) && (
        <ButtonMediumV2
          disabled={!canUseTezos}
          title="Buy"
          iconName={IconNameV2Enum.Cart}
          onPress={() => navigateToScreen({ screen: ScreensEnum.Buy })}
          styleConfigOverrides={actionButtonStylesOverrides}
          style={styles.buttonContainer}
          testID={WalletSelectors.buyButton}
        />
      )}

      {(isTezosKind || !token) && (
        <ButtonMediumV2
          disabled={!canUseTezos || !isTezosMainnet}
          title="Earn"
          iconName={IconNameV2Enum.Dollar}
          onPress={() => navigateToScreen({ screen: ScreensEnum.Earn })}
          styleConfigOverrides={earnButtonStylesOverrides}
          style={styles.buttonContainer}
          testID={WalletSelectors.earnButton}
          testIDProperties={{
            isZeroBalance: totalBalance.isLessThanOrEqualTo(0)
          }}
        />
      )}

      <ButtonMediumV2
        disabled={disabledSendButton}
        title="Send"
        iconName={IconNameV2Enum.ArrowUp}
        onPress={handleSendButton}
        styleConfigOverrides={sendButtonStylesOverrides}
        style={styles.buttonContainer}
        testID={WalletSelectors.sendButton}
      />
    </ButtonsContainer>
  );
});
