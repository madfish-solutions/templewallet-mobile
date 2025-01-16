import BigNumber from 'bignumber.js';
import React, { memo, useLayoutEffect, useRef } from 'react';
import { StyleProp, Text, TextStyle, View } from 'react-native';

import { useHideBalance } from 'src/hooks/hide-balance/hide-balance.hook';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { useTotalBalance } from 'src/hooks/use-total-balance';
import { WalletSelectors } from 'src/screens/wallet/wallet.selectors';
import { useCurrentFiatCurrencyMetadataSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { isDefined } from 'src/utils/is-defined';
import { formatAssetAmount } from 'src/utils/number.util';

import { AssetValueText } from '../asset-value-text/asset-value-text';
import { Divider } from '../divider/divider';
import { ErrorBoundary } from '../error-boundary';
import { HideBalance } from '../hide-balance/hide-balance';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TouchableIcon } from '../icon/touchable-icon/touchable-icon';

import { useAssetEquityTextStyles, useTokenEquityValueStyles } from './token-equity-value.styles';

const currentDate = new Date().toLocaleString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

interface Props {
  token: TokenInterface;
  forTotalBalance?: boolean;
}

const ErrorBoundaryFallback = memo(() => {
  const styles = useTokenEquityValueStyles();

  return (
    <View style={styles.container}>
      <Text style={styles.mainValueText}>---</Text>
    </View>
  );
});

export const TokenEquityValue = memo<Props>(props => {
  const errorBoundaryRef = useRef<ErrorBoundary>(null);

  useLayoutEffect(() => {
    if (errorBoundaryRef.current) {
      console.log('restart');
      errorBoundaryRef.current.tryAgainIfNecessary();
    }
  }, []);

  return (
    <ErrorBoundary Fallback={ErrorBoundaryFallback} ref={errorBoundaryRef}>
      <TokenEquityValueContent {...props} />
    </ErrorBoundary>
  );
});

const TokenEquityValueContent = memo<Props>(({ token, forTotalBalance = false }) => {
  const styles = useTokenEquityValueStyles();

  const { isTezosNode } = useNetworkInfo();

  const { toggleHideBalance, isBalanceHidden } = useHideBalance();
  const totalBalance = useTotalBalance();

  const exchangeRate = token.exchangeRate;

  return isTezosNode ? (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableIcon
          name={isBalanceHidden ? IconNameEnum.EyeClosedBold : IconNameEnum.EyeOpenBold}
          size={formatSize(24)}
          onPress={toggleHideBalance}
          testID={WalletSelectors.tokenEquityButton}
        />

        {!forTotalBalance ? (
          <View style={styles.equityContainer}>
            <Text style={styles.dateText}>Equity Value {currentDate}</Text>
            {isDefined(exchangeRate) ? (
              <AssetEquityText style={styles.dateText} assetSymbol={token.symbol} exchangeRate={exchangeRate} />
            ) : null}
          </View>
        ) : (
          <Text style={styles.dateText}>Equity Value {currentDate}</Text>
        )}
      </View>

      {!forTotalBalance ? (
        <>
          <HideBalance style={styles.mainValueText}>
            <AssetValueText asset={token} amount={token.balance} />
          </HideBalance>
          <HideBalance style={styles.additionalValueText}>
            <AssetValueText convertToDollar asset={token} amount={token.balance} />
          </HideBalance>
        </>
      ) : (
        <HideBalance style={styles.mainValueText}>
          <AssetValueText convertToDollar asset={totalBalance} amount={totalBalance.balance} />
        </HideBalance>
      )}
    </View>
  ) : (
    <Divider />
  );
});

interface AssetEquityTextProps {
  assetSymbol: string;
  exchangeRate: number;
  style?: StyleProp<TextStyle>;
}

const AssetEquityText = memo<AssetEquityTextProps>(({ assetSymbol, exchangeRate, style }) => {
  const styles = useAssetEquityTextStyles();
  const { symbol } = useCurrentFiatCurrencyMetadataSelector();

  const formattedExchangeRate = formatAssetAmount(new BigNumber(exchangeRate ?? 0), 2);

  return (
    <Text style={style}>
      <Text style={[style, styles.numberText]}>1</Text> <Text style={style}>{assetSymbol}</Text>
      <Text style={style}> ≈ </Text>
      <Text style={[style, styles.numberText]}>{formattedExchangeRate}</Text>
      <Text style={style}>{symbol}</Text>
    </Text>
  );
});
