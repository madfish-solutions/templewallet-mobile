import React, { FC } from 'react';
import FastImage from 'react-native-fast-image';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { Route3DexTypeEnum } from 'src/enums/route3.enum';
import { formatSize } from 'src/styles/format-size';

import { useDexIconStyles } from './dex-icon.styles';

interface Props {
  dexType: Route3DexTypeEnum | undefined;
}

export const DexIcon: FC<Props> = ({ dexType }) => {
  const styles = useDexIconStyles();

  switch (dexType) {
    case Route3DexTypeEnum.PlentyCtezStable:
    case Route3DexTypeEnum.PlentyTokenToToken:
    case Route3DexTypeEnum.PlentyTokenToTokenStable:
    case Route3DexTypeEnum.PlentyTokenToTokenVolatile:
    case Route3DexTypeEnum.PlentyWrappedTokenBridgeSwap:
      return <Icon name={IconNameEnum.Plenty} size={formatSize(20)} />;
    case Route3DexTypeEnum.QuipuSwapV3:
    case Route3DexTypeEnum.QuipuSwapDex2:
    case Route3DexTypeEnum.QuipuSwapTezToTokenFa12:
    case Route3DexTypeEnum.QuipuSwapTezToTokenFa2:
    case Route3DexTypeEnum.QuipuSwapTokenToToken:
    case Route3DexTypeEnum.QuipuSwapTokenToTokenStable:
      return <Icon name={IconNameEnum.QuipuSwapDark} size={formatSize(20)} />;
    case Route3DexTypeEnum.FlatYouvesStable:
    case Route3DexTypeEnum.FlatYouvesStableUXTZ:
      return <Icon name={IconNameEnum.Youves} size={formatSize(20)} />;
    case Route3DexTypeEnum.VortexTokenToTokenFa12:
    case Route3DexTypeEnum.VortexTokenToTokenFa2:
      return <Icon name={IconNameEnum.Vortex} size={formatSize(20)} />;
    case Route3DexTypeEnum.SpicyTokenToToken:
      return <Icon name={IconNameEnum.Spicy} size={formatSize(20)} />;
    case Route3DexTypeEnum.wTEZSwap:
    case Route3DexTypeEnum.WTZSwap:
      return <FastImage source={require('./images/dexter.png')} style={styles.image} />;
    case Route3DexTypeEnum.DexterLb:
      return <FastImage source={require('./images/wtz.png')} style={styles.image} />;
    case Route3DexTypeEnum.CtezToXtz:
      return <FastImage source={require('./images/ctez.png')} style={styles.image} />;
    default:
      return <Icon name={IconNameEnum.SwapTokenPlaceholderIcon} size={formatSize(20)} />;
  }
};
