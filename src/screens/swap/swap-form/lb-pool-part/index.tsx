import React, { FC, useMemo } from 'react';
import { View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TokenIcon } from 'src/components/token-icon/token-icon';
import { formatSize } from 'src/styles/format-size';
import { SIRS_TOKEN_METADATA } from 'src/token/data/tokens-metadata';
import { conditionalStyle } from 'src/utils/conditional-style';

import { SwapRouteAmounts } from '../swap-route-amounts';
import { useLbPoolPartStyles } from './styles';

interface Props {
  isLbOutput: boolean;
  amount: string | undefined;
  totalChains: number;
}

export const LbPoolPart: FC<Props> = ({ isLbOutput, amount, totalChains }) => {
  const styles = useLbPoolPartStyles();

  const advancedLbPoolItemStyles = useMemo(() => ({ height: formatSize(40 * totalChains - 8) }), [totalChains]);

  return (
    <View style={[styles.root, conditionalStyle(isLbOutput, styles.reverse)]}>
      <SwapRouteAmounts
        alignment={isLbOutput ? 'flex-end' : 'flex-start'}
        amount={amount ?? '0'}
        baseAmount={amount}
        style={styles.amounts}
      />
      <Divider size={formatSize(4)} />
      <View style={styles.dashWrapper}>
        <Icon width={formatSize(263)} height={formatSize(16)} name={IconNameEnum.SwapRouteItemBackground} />
      </View>
      <View style={[styles.item, advancedLbPoolItemStyles]}>
        <TokenIcon size={formatSize(20)} thumbnailUri={SIRS_TOKEN_METADATA.thumbnailUri} />
      </View>
    </View>
  );
};
