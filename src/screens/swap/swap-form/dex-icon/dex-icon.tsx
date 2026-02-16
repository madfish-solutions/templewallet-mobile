import React, { FC } from 'react';
import FastImage from '@d11/react-native-fast-image';

import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { Route3DexTypeEnum } from 'src/enums/route3.enum';
import { formatSize } from 'src/styles/format-size';

import { useDexIconStyles } from './dex-icon.styles';

interface Props {
  dexType: Route3DexTypeEnum | undefined;
}

// TODO: use this component to display a route
export const DexIcon: FC<Props> = ({ dexType }) => {
  const styles = useDexIconStyles();

  switch (dexType) {
    case Route3DexTypeEnum.PlentyCtezStable:
    case Route3DexTypeEnum.PlentyTokenToToken:
    case Route3DexTypeEnum.PlentyTokenTez:
    case Route3DexTypeEnum.PlentyTokenToTokenStable:
    case Route3DexTypeEnum.PlentyTokenToTokenVolatile:
    case Route3DexTypeEnum.PlentyWrappedTokenBridgeSwap:
    case Route3DexTypeEnum.PlentySwapV3:
      return <Icon name={IconNameEnum.Plenty} size={formatSize(20)} />;
    case Route3DexTypeEnum.QuipuSwapV3:
    case Route3DexTypeEnum.QuipuSwapDex2:
    case Route3DexTypeEnum.QuipuSwapTezToTokenFa12:
    case Route3DexTypeEnum.QuipuSwapTezToTokenFa2:
    case Route3DexTypeEnum.QuipuSwapTokenToToken:
    case Route3DexTypeEnum.QuipuSwapTokenToTokenStable:
    case Route3DexTypeEnum.QuipuSwapTokenToTokenStableV2:
      return <Icon name={IconNameEnum.QuipuSwapDark} size={formatSize(20)} />;
    case Route3DexTypeEnum.FlatYouvesStable:
    case Route3DexTypeEnum.FlatYouvesStableUXTZ:
    case Route3DexTypeEnum.FlatYouvesCPMM:
    case Route3DexTypeEnum.YouvesTargetMultiToken2:
      return <Icon name={IconNameEnum.Youves} size={formatSize(20)} />;
    case Route3DexTypeEnum.VortexTokenToTokenFa12:
    case Route3DexTypeEnum.VortexTokenToTokenFa2:
      return <Icon name={IconNameEnum.Vortex} size={formatSize(20)} />;
    case Route3DexTypeEnum.SpicyTokenToToken:
    case Route3DexTypeEnum.SpicySwapStable:
      return <Icon name={IconNameEnum.Spicy} size={formatSize(20)} />;
    case Route3DexTypeEnum.wTEZSwap:
      return <Icon name={IconNameEnum.WTez} size={formatSize(20)} />;
    case Route3DexTypeEnum.WTZSwap:
      return <FastImage source={require('./images/wtz.png')} style={styles.image} />;
    case Route3DexTypeEnum.DexterLb:
      return <FastImage source={require('./images/dexter.png')} style={styles.image} />;
    case Route3DexTypeEnum.CtezToXtz:
      return <FastImage source={require('./images/ctez.png')} style={styles.image} />;
    case Route3DexTypeEnum.oXTZSwap:
      return <Icon name={IconNameEnum.OXtz} size={formatSize(20)} />;
    case Route3DexTypeEnum.KordTezLend:
      return <FastImage source={require('./images/kord.png')} style={styles.image} />;
    default:
      return <Icon name={IconNameEnum.SwapTokenPlaceholderIcon} size={formatSize(20)} />;
  }
};
