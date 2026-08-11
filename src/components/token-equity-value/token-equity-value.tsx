import React, { memo, useLayoutEffect, useMemo, useRef } from 'react';
import { Text, View } from 'react-native';

import { useTotalBalance } from 'src/hooks/use-total-balance';
import { WalletSelectors } from 'src/screens/wallet/wallet.selectors';
import { useFiatToUsdRateSelector } from 'src/store/settings/settings-selectors';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { isDefined } from 'src/utils/is-defined';
import { ZERO } from 'src/utils/number.util';

import { AssetValueText } from '../asset-value-text/asset-value-text';
import { ErrorBoundary } from '../error-boundary';
import { FormattedAmount } from '../formatted-amount';
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

  const totalDollarBalance = useTotalBalance();
  const fiatToUsdRate = useFiatToUsdRateSelector();

  const totalFiatBalance = useMemo(
    () => (isDefined(fiatToUsdRate) ? totalDollarBalance.times(fiatToUsdRate) : ZERO),
    [totalDollarBalance, fiatToUsdRate]
  );

  return (
    <View style={styles.container}>
      {forTotalBalance ? (
        <>
          <Text style={styles.totalEquityText}>Total Equity Value</Text>
          <HideBalance textStyle={styles.mainValueText} interactive testID={WalletSelectors.tokenEquity}>
            <FormattedAmount isDollarValue amount={totalFiatBalance} />
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
