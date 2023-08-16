import React, { FC, useMemo } from 'react';
import { Pressable } from 'react-native';
import { useDispatch } from 'react-redux';

import { isAndroid, isIOS } from 'src/config/system';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { setOnRampPossibilityAction } from 'src/store/settings/settings-actions';
import { useSelectedAccountTezosTokenSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { showErrorToast } from 'src/toast/toast.utils';
import { emptyToken, TokenInterface } from 'src/token/interfaces/token.interface';
import { isDefined } from 'src/utils/is-defined';
import { openUrl } from 'src/utils/linking.util';

import { ButtonMedium } from '../button/button-medium/button-medium';
import { ButtonsContainer } from '../button/buttons-container/buttons-container';
import { Divider } from '../divider/divider';
import { IconNameEnum } from '../icon/icon-name.enum';
import { useHeaderCardActionButtonsStyles } from './header-card-action-buttons.styles';

interface Props {
  token: TokenInterface;
}

const CHAINBITS_URL = 'https://buy.chainbits.com';

export const HeaderCardActionButtons: FC<Props> = ({ token }) => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();
  const { metadata, isTezosNode, isTezosMainnet } = useNetworkInfo();
  const tezosToken = useSelectedAccountTezosTokenSelector();
  const styles = useHeaderCardActionButtonsStyles();

  const errorMessage =
    isDefined(token.address) && tezosToken.balance === emptyToken.balance
      ? `You need to have ${metadata.symbol} to pay gas fee`
      : 'Balance is zero';

  const actionButtonStylesOverrides = useMemo(
    () => ({
      titleStyle: styles.actionButtonTitle
    }),
    [styles.actionButtonTitle]
  );

  const emptyBalance = token.balance === emptyToken.balance || tezosToken.balance === emptyToken.balance;
  const disabledSendButton = emptyBalance && isIOS;

  const handleSendButton = () => {
    if (!emptyBalance) {
      return navigate(ModalsEnum.Send, { token });
    }

    showErrorToast({ description: errorMessage });
    dispatch(setOnRampPossibilityAction(true));
  };

  const fallbackSendButton = () => null;

  return (
    <ButtonsContainer>
      <ButtonMedium
        title="Receive"
        iconName={IconNameEnum.ArrowDown}
        onPress={() => navigate(ModalsEnum.Receive, { token })}
        styleConfigOverrides={actionButtonStylesOverrides}
        style={styles.buttonContainer}
      />

      {isAndroid && (
        <>
          <Divider size={formatSize(8)} />
          <ButtonMedium
            title="Buy"
            iconName={IconNameEnum.ShoppingCard}
            onPress={() => (isTezosNode ? navigate(ScreensEnum.Buy) : openUrl(CHAINBITS_URL))}
            styleConfigOverrides={actionButtonStylesOverrides}
            style={styles.buttonContainer}
          />
        </>
      )}

      <Divider size={formatSize(8)} />

      <ButtonMedium
        disabled={!isTezosNode || !isTezosMainnet}
        title="Earn"
        iconName={IconNameEnum.Earn}
        onPress={() => navigate(ScreensEnum.Earn)}
        styleConfigOverrides={actionButtonStylesOverrides}
        style={styles.buttonContainer}
      />

      <Divider size={formatSize(8)} />

      <Pressable onPress={handleSendButton} style={styles.buttonContainer}>
        <ButtonMedium
          title="Send"
          disabled={disabledSendButton}
          iconName={IconNameEnum.ArrowUp}
          onPress={fallbackSendButton}
          styleConfigOverrides={actionButtonStylesOverrides}
        />
      </Pressable>
    </ButtonsContainer>
  );
};
