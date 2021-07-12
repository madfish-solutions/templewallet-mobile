import React, { FC } from 'react';

import { emptyFn } from '../../config/general';
import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useTezosBalanceSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { AssetMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { ButtonMedium } from '../button/button-medium/button-medium';
import { ButtonsContainer } from '../button/buttons-container/buttons-container';
import { Divider } from '../divider/divider';
import { IconNameEnum } from '../icon/icon-name.enum';

interface Props {
  asset: AssetMetadataInterface;
  balance: string;
}

export const HeaderCardActionButtons: FC<Props> = ({ asset, balance }) => {
  const { navigate } = useNavigation();
  const tezosBalance = useTezosBalanceSelector();

  return (
    <ButtonsContainer>
      <ButtonMedium
        title="RECEIVE"
        iconName={IconNameEnum.ArrowDown}
        onPress={() => navigate(ModalsEnum.Receive, { asset })}
      />
      <Divider size={formatSize(8)} />
      <ButtonMedium
        title="SEND"
        disabled={Number(balance) === 0 || Number(tezosBalance) === 0}
        iconName={IconNameEnum.ArrowUp}
        onPress={() => navigate(ModalsEnum.Send, { asset })}
      />
      <Divider size={formatSize(8)} />
      <ButtonMedium title="BUY" iconName={IconNameEnum.ShoppingCard} disabled={true} onPress={emptyFn} />
    </ButtonsContainer>
  );
};
