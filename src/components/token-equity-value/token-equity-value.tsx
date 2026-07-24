import React, { memo, useLayoutEffect, useRef } from 'react';
import { Text, View } from 'react-native';

import { useTotalBalance } from 'src/hooks/use-total-balance';
import { WalletSelectors } from 'src/screens/wallet/wallet.selectors';
import { TokenInterface } from 'src/token/interfaces/token.interface';

import { AssetValueText } from '../asset-value-text/asset-value-text';
import { ErrorBoundary } from '../error-boundary';
import { HideBalance } from '../hide-balance/hide-balance';

import { useTokenEquityValueStyles } from './token-equity-value.styles';

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

  const totalBalance = useTotalBalance();

  return (
    <View style={styles.container}>
      {forTotalBalance ? (
        <>
          <Text style={styles.totalEquityText}>Total Equity Value</Text>
          <HideBalance textStyle={styles.mainValueText} interactive testID={WalletSelectors.tokenEquity}>
            <AssetValueText convertToDollar asset={totalBalance} amount={totalBalance.balance} hideApproximateSign />
          </HideBalance>
        </>
      ) : (
        <>
          <HideBalance textStyle={styles.mainValueText} interactive testID={WalletSelectors.tokenEquity}>
            <AssetValueText asset={token} amount={token.balance} />
          </HideBalance>
          <HideBalance textStyle={styles.additionalValueText}>
            <AssetValueText convertToDollar asset={token} amount={token.balance} hideApproximateSign />
          </HideBalance>
        </>
      )}
    </View>
  );
});
