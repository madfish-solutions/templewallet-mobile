import React, { FC } from 'react';
import { View } from 'react-native';

import { emptyFn } from '../../config/general';
import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useTezosBalanceSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { showErrorToast } from '../../toast/toast.utils';
import { TokenInterface } from '../../token/interfaces/token.interface';
import { isDefined } from '../../utils/is-defined';
import { ButtonMedium } from '../button/button-medium/button-medium';
import { ButtonsContainer } from '../button/buttons-container/buttons-container';
import { Divider } from '../divider/divider';
import { IconNameEnum } from '../icon/icon-name.enum';
import { useHeaderCardActionButtonsStyles } from './header-card-action-buttons.styles';

interface Props {
  token: TokenInterface;
}

export const HeaderCardActionButtons: FC<Props> = ({ token }) => {
  const { navigate } = useNavigation();
  const rawTezosBalance = useTezosBalanceSelector();
  const tezosBalance = Number(rawTezosBalance);
  const styles = useHeaderCardActionButtonsStyles();

  const errorMessage =
    isDefined(token.address) && tezosBalance === 0 ? 'You need to have TEZ to pay gas fee' : 'Balance is zero';

  const disableSendAsset = Number(token.balance) === 0 || tezosBalance === 0;

  return (
    <ButtonsContainer>
      <ButtonMedium
        title="RECEIVE"
        iconName={IconNameEnum.ArrowDown}
        onPress={() => navigate(ModalsEnum.Receive, { asset: token })}
      />
      <Divider size={formatSize(8)} />
      <View
        style={styles.buttonContainer}
        onTouchStart={() => void (disableSendAsset && showErrorToast(`Can't send ${token.symbol}`, errorMessage))}>
        <ButtonMedium
          title="SEND"
          disabled={disableSendAsset}
          iconName={IconNameEnum.ArrowUp}
          onPress={() => navigate(ModalsEnum.Send, { asset: token })}
        />
      </View>
      <Divider size={formatSize(8)} />
      <ButtonMedium title="BUY" iconName={IconNameEnum.ShoppingCard} disabled={true} onPress={emptyFn} />
    </ButtonsContainer>
  );
};
