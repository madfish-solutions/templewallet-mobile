import React, { FC } from 'react';
import { View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { TokenIcon } from 'src/components/token-icon/token-icon';
import { Route3DexTypeEnum } from 'src/enums/route3.enum';
import { formatSize } from 'src/styles/format-size';
import { TokenInterface } from 'src/token/interfaces/token.interface';

import { DexIcon } from '../dex-icon/dex-icon';

import { useHopItemStyles } from './hop-item.styles';

interface Props {
  dexType: Route3DexTypeEnum | undefined;
  aToken: TokenInterface | undefined;
  bToken: TokenInterface | undefined;
}

export const HopItem: FC<Props> = ({ dexType, aToken, bToken }) => {
  const styles = useHopItemStyles();

  return (
    <View style={styles.container}>
      <DexIcon dexType={dexType} />
      <Divider size={formatSize(4)} />
      <TokenIcon iconName={aToken?.iconName} thumbnailUri={aToken?.thumbnailUri} size={formatSize(20)} />
      <View style={styles.lastTokenContainer}>
        <TokenIcon iconName={bToken?.iconName} thumbnailUri={bToken?.thumbnailUri} size={formatSize(20)} />
      </View>
    </View>
  );
};
