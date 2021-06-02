import React, { FC } from 'react';

import { Divider } from '../../../components/divider/divider';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { TouchableIcon } from '../../../components/icon/touchable-icon/touchable-icon';
import { Switch } from '../../../components/switch/switch';
import { TokenContainer } from '../../../components/token-container/token-container';
import { formatSize } from '../../../styles/format-size';
import { TokenInterface } from '../../../token/interfaces/token.interface';

interface Props {
  token: TokenInterface;
}

export const ManageAssetsItem: FC<Props> = ({ token }) => {
  return (
    <TokenContainer symbol={token.symbol} name={token.name} iconName={token.iconName}>
      <TouchableIcon name={IconNameEnum.Trash} size={formatSize(16)} onPress={() => null} />
      <Divider size={formatSize(16)} />
      <Switch value={token.isShown} disabled={true} />
    </TokenContainer>
  );
};
