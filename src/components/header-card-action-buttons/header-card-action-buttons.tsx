import { BigNumber } from 'bignumber.js';
import React, { FC, useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated } from 'react-native';
import { useDispatch } from 'react-redux';

import { LIMIT_FIN_FEATURES } from 'src/config/system';
import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { useCanUseOnRamp } from 'src/hooks/use-can-use-on-ramp.hook';
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
import { useAccount } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/toast.utils';
import { TEZ_TOKEN_METADATA } from 'src/token/data/tokens-metadata';
import { emptyToken, TokenInterface } from 'src/token/interfaces/token.interface';
import { getAccountAddressForTezos } from 'src/utils/account.utils';
import { isDefined } from 'src/utils/is-defined';
import { useTezosTokenOfCurrentAccount } from 'src/utils/wallet.utils';

import { ButtonMedium } from '../button/button-medium/button-medium';
import { useButtonMediumStyleConfig } from '../button/button-medium/button-medium.styles';
import { ButtonsContainer } from '../button/buttons-container/buttons-container';
import { Divider } from '../divider/divider';
import { IconNameEnum } from '../icon/icon-name.enum';

import { useHeaderCardActionButtonsStyles } from './header-card-action-buttons.styles';

interface Props {
  token: TokenInterface;
  onSendPress?: EmptyFn;
}

export const HeaderCardActionButtons: FC<Props> = ({ token, onSendPress }) => {
  const dispatch = useDispatch();
  const navigateToModal = useNavigateToModal();
  const navigateToScreen = useNavigateToScreen();
  const { isLocked } = useAppLock();
  const atBootsplash = useAtBootsplash();
  const canUseOnRamp = useCanUseOnRamp();
  const selectedAccount = useAccount();
  const { isTezosMainnet } = useNetworkInfo();
  const tezosToken = useTezosTokenOfCurrentAccount();
  const { balance } = useTotalBalance();
  const styles = useHeaderCardActionButtonsStyles();
  const defaultStyleConfig = useButtonMediumStyleConfig();
  const isLoaderBeingShown = useIsShowLoaderSelector();
  const canUseTezos = Boolean(getAccountAddressForTezos(selectedAccount));

  const isTezBalanceTooLow =
    isDefined(token.address) && token.address === tezosToken.address && tezosToken.balance === emptyToken.balance;
  const errorMessage = isTezBalanceTooLow
    ? `You need to have ${TEZ_TOKEN_METADATA.symbol} to pay gas fee`
    : 'Balance is zero';

  const emptyBalance = token.balance === emptyToken.balance || tezosToken.balance === emptyToken.balance;
  const disabledSendButton = !canUseTezos || (emptyBalance && LIMIT_FIN_FEATURES);

  const actionButtonStylesOverrides = useMemo(
    () => ({
      titleStyle: styles.actionButtonTitle
    }),
    []
  );

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
    } else if (isLoaderBeingShown) {
      return;
    }

    playAnimation();
    const animationInterval = setInterval(playAnimation, 4000);

    return () => void clearInterval(animationInterval);
  }, [isLocked, atBootsplash, isLoaderBeingShown, playAnimation]);

  const earnButtonStylesOverrides = useMemo(
    () => ({
      ...actionButtonStylesOverrides,
      iconStyle: { ...defaultStyleConfig.iconStyle, translateY: earnIconTranslateYRef.current }
    }),
    [actionButtonStylesOverrides, defaultStyleConfig.iconStyle]
  );

  const sendButtonStylesOverrides = useMemo(
    () => ({
      titleStyle: styles.actionButtonTitle,
      activeColorConfig: disabledSendButton
        ? defaultStyleConfig.disabledColorConfig
        : defaultStyleConfig.activeColorConfig
    }),
    [defaultStyleConfig, disabledSendButton]
  );

  const handleSendButton = () => {
    if (!emptyBalance) {
      if (onSendPress) {
        return onSendPress();
      }

      return navigateToModal(ModalsEnum.Send, { token });
    }

    showErrorToast({ description: errorMessage });

    if (isTezBalanceTooLow && canUseOnRamp) {
      dispatch(setOnRampOverlayStateAction(OnRampOverlayState.Continue));
    }
  };

  return (
    <ButtonsContainer>
      <ButtonMedium
        title="Receive"
        iconName={IconNameEnum.ArrowDown}
        onPress={() => navigateToModal(ModalsEnum.Receive, { token })}
        styleConfigOverrides={actionButtonStylesOverrides}
        style={styles.buttonContainer}
        testID={WalletSelectors.receiveButton}
      />

      {!LIMIT_FIN_FEATURES && (
        <>
          <Divider size={formatSize(8)} />
          <ButtonMedium
            disabled={!canUseTezos}
            title="Buy"
            iconName={IconNameEnum.ShoppingCard}
            onPress={() => navigateToScreen({ screen: ScreensEnum.Buy })}
            styleConfigOverrides={actionButtonStylesOverrides}
            style={styles.buttonContainer}
            testID={WalletSelectors.buyButton}
          />
        </>
      )}

      <Divider size={formatSize(8)} />

      <ButtonMedium
        disabled={!canUseTezos || !isTezosMainnet}
        title="Earn"
        iconName={IconNameEnum.Earn}
        onPress={() => navigateToScreen({ screen: ScreensEnum.Earn })}
        styleConfigOverrides={earnButtonStylesOverrides}
        style={styles.buttonContainer}
        testID={WalletSelectors.earnButton}
        testIDProperties={{
          isZeroBalance: new BigNumber(balance).isLessThanOrEqualTo(0)
        }}
      />

      <Divider size={formatSize(8)} />

      <ButtonMedium
        disabled={disabledSendButton}
        title="Send"
        iconName={IconNameEnum.ArrowUp}
        onPress={handleSendButton}
        styleConfigOverrides={sendButtonStylesOverrides}
        style={styles.buttonContainer}
        testID={WalletSelectors.sendButton}
      />
    </ButtonsContainer>
  );
};
