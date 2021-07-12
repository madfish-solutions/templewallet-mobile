import React, { FC } from 'react';
import { View } from 'react-native';

import { emptyFn } from '../../config/general';
import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useTezosBalanceSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { showErrorToast } from '../../toast/toast.utils';
import { AssetMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { isDefined } from '../../utils/is-defined';
import { ButtonMedium } from '../button/button-medium/button-medium';
import { ButtonsContainer } from '../button/buttons-container/buttons-container';
import { Divider } from '../divider/divider';
import { IconNameEnum } from '../icon/icon-name.enum';
import { useHeaderCardActionButtonsStyles } from './header-card-action-buttons.styles';

interface Props {
  asset: AssetMetadataInterface;
  balance: string;
}

export const HeaderCardActionButtons: FC<Props> = ({ asset, balance }) => {
  const { navigate } = useNavigation();
  const rawTezosBalance = useTezosBalanceSelector();
  const tezosBalance = Number(rawTezosBalance);
  const styles = useHeaderCardActionButtonsStyles();

  const errorMessage =
    isDefined(asset.address) && tezosBalance === 0 ? 'You need to have TEZ to pay gas fee' : 'Balance is zero';

  return (
    <ButtonsContainer>
      <View style={styles.buttonContainer}>
        <ButtonMedium
          title="RECEIVE"
          iconName={IconNameEnum.ArrowDown}
          onPress={() => navigate(ModalsEnum.Receive, { asset })}
        />
      </View>
      <Divider size={formatSize(8)} />
      <View
        onTouchStart={() => showErrorToast(`Can't send ${asset.symbol}`, errorMessage)}
        style={styles.buttonContainer}>
        <ButtonMedium
          title="SEND"
          disabled={Number(balance) === 0 || tezosBalance === 0}
          iconName={IconNameEnum.ArrowUp}
          onPress={() => navigate(ModalsEnum.Send, { asset })}
        />
      </View>
      <Divider size={formatSize(8)} />
      <View style={styles.buttonContainer}>
        <ButtonMedium title="BUY" iconName={IconNameEnum.ShoppingCard} disabled={true} onPress={emptyFn} />
      </View>
    </ButtonsContainer>
  );
};
