import React, { FC, useMemo } from 'react';
import { View } from 'react-native';

import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
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
  const { navigate } = useNavigation();
  const { metadata, isTezosNode, isTezosMainnet } = useNetworkInfo();
  const tezosToken = useSelectedAccountTezosTokenSelector();
  const styles = useHeaderCardActionButtonsStyles();

  const errorMessage =
    isDefined(token.address) && tezosToken.balance === emptyToken.balance
      ? `You need to have ${metadata.symbol} to pay gas fee`
      : 'Balance is zero';

  const disableSendAsset = token.balance === emptyToken.balance || tezosToken.balance === emptyToken.balance;

  const actionButtonStylesOverrides = useMemo(
    () => ({
      titleStyle: styles.actionButtonTitle
    }),
    [styles.actionButtonTitle]
  );

  return (
    <ButtonsContainer>
      <View style={styles.buttonContainer}>
        <ButtonMedium
          title="Receive"
          iconName={IconNameEnum.ArrowDown}
          onPress={() => navigate(ModalsEnum.Receive, { token })}
          styleConfigOverrides={actionButtonStylesOverrides}
        />
      </View>
      <Divider size={formatSize(8)} />
      <View style={styles.buttonContainer}>
        <ButtonMedium
          title="Buy"
          iconName={IconNameEnum.ShoppingCard}
          onPress={() => (isTezosNode ? navigate(ScreensEnum.Buy) : openUrl(CHAINBITS_URL))}
          styleConfigOverrides={actionButtonStylesOverrides}
        />
      </View>
      <Divider size={formatSize(8)} />
      <View style={styles.buttonContainer}>
        <ButtonMedium
          disabled={!isTezosNode || !isTezosMainnet}
          title="Earn"
          iconName={IconNameEnum.Earn}
          onPress={() => navigate(ScreensEnum.Earn)}
          styleConfigOverrides={actionButtonStylesOverrides}
        />
      </View>
      <Divider size={formatSize(8)} />
      <View
        style={styles.buttonContainer}
        onTouchStart={() => void (disableSendAsset && showErrorToast({ description: errorMessage }))}
      >
        <ButtonMedium
          title="Send"
          disabled={disableSendAsset}
          iconName={IconNameEnum.ArrowUp}
          onPress={() => navigate(ModalsEnum.Send, { token })}
          styleConfigOverrides={actionButtonStylesOverrides}
        />
      </View>
    </ButtonsContainer>
  );
};
