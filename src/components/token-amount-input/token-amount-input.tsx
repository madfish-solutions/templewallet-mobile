import { BigNumber } from 'bignumber.js';
import React, { FC, useMemo, useState } from 'react';
import { Keyboard, Text, View } from 'react-native';

import { useLayoutSizes } from '../../hooks/use-layout-sizes.hook';
import { useTokenExchangeRate } from '../../hooks/use-token-exchange-rate.hook';
import { TokenAmountInputValue } from '../../interfaces/token-amount-input-value.interface';
import { formatSize } from '../../styles/format-size';
import { TokenInterface } from '../../token/interfaces/token.interface';
import { conditionalStyle } from '../../utils/conditional-style';
import { tokenToUsd, usdToToken } from '../../utils/exchange-rate.utils';
import { isDefined } from '../../utils/is-defined';
import { formatAssetAmount } from '../../utils/number.util';
import { mutezToTz } from '../../utils/tezos.util';
import { Divider } from '../divider/divider';
import { Dropdown } from '../dropdown/dropdown';
import { tileMargin } from '../segmented-control/segmented-control.styles';
import { TextSegmentControl } from '../segmented-control/text-segment-control/text-segment-control';
import { StyledNumericInput } from '../styled-numberic-input/styled-numeric-input';
import { StyledNumericInputProps } from '../styled-numberic-input/styled-numeric-input.props';
import { useTokenAmountInputStyles } from './token-amount-input.styles';
import { renderTokenListItem } from './token-dropdown-item/token-dropdown-item';
import { tokenEqualityFn } from './token-equality-fn';
import { TokenValue } from './token-value/token-value';

export interface TokenAmountInputProps extends Pick<StyledNumericInputProps, 'onBlur' | 'isError'> {
  defaultValue?: TokenAmountInputValue;
  title: string;
  tokens: TokenInterface[];
  value?: TokenAmountInputValue;
  onChange: (newValue: TokenAmountInputValue) => void;
}

const ESTIMATED_SWITCHER_CHAR_WIDTH = formatSize(10.533);
const DEFAULT_USD_LABEL_WIDTH = formatSize(30.556);

export const TokenAmountInput: FC<TokenAmountInputProps> = ({
  defaultValue,
  isError = false,
  onBlur,
  title,
  tokens,
  value = defaultValue ?? { token: tokens[0] },
  onChange
}) => {
  const { amount, token, usdAmount } = value;
  const balance = useMemo(
    () => mutezToTz(new BigNumber(token.balance), token.decimals),
    [token.balance, token.decimals]
  );
  const styles = useTokenAmountInputStyles();
  const tokenExchangeRate = useTokenExchangeRate(token);

  const [switcherIndex, setSwitcherIndex] = useState(0);
  const inputValue = switcherIndex === 0 ? amount : usdAmount;

  const { layoutWidth: tokenTextWidth, handleLayout: handleTokenTextLayout } = useLayoutSizes(
    token.symbol.length * ESTIMATED_SWITCHER_CHAR_WIDTH
  );
  const { layoutWidth: usdTextWidth, handleLayout: handleUsdTextLayout } = useLayoutSizes(DEFAULT_USD_LABEL_WIDTH);
  const maxSwitcherOptionWidth = Math.max(tokenTextWidth, usdTextWidth);
  const switcherWidth = (maxSwitcherOptionWidth + formatSize(16) + tileMargin) * 2;

  const handleTokenChange = (newToken: TokenInterface | undefined) => {
    setSwitcherIndex(0);
    onChange({ amount: undefined, token: newToken ?? tokens[0], usdAmount: undefined });
  };
  const handleAmountChange = (rawAmount?: BigNumber) => {
    const newAmount =
      switcherIndex === 1 && isDefined(rawAmount)
        ? usdToToken(rawAmount, token.decimals, tokenExchangeRate)
        : rawAmount;
    const newUsdAmount =
      switcherIndex === 0 && isDefined(rawAmount) ? tokenToUsd(rawAmount, tokenExchangeRate) : rawAmount;
    onChange({ amount: newAmount, token: value.token, usdAmount: newUsdAmount });
  };
  const handleSwitcherChange = (newIndex: number) => {
    setSwitcherIndex(newIndex);
    Keyboard.dismiss();
  };

  const equivalentLabel = useMemo(() => {
    if (switcherIndex === 0) {
      return isDefined(usdAmount) ? `≈ ${usdAmount.toFixed(2)} $` : '';
    }

    return isDefined(amount) ? `≈ ${formatAssetAmount(amount)} ${token.symbol}` : '';
  }, [usdAmount, amount, token.symbol, switcherIndex]);

  const balanceLabel = useMemo(() => {
    if (switcherIndex === 0) {
      return `${formatAssetAmount(balance)} ${token.symbol}`;
    }

    const balanceInUsd = tokenToUsd(balance, tokenExchangeRate);

    return `≈ ${balanceInUsd.toFixed()} $`;
  }, [token.symbol, balance, tokenExchangeRate, switcherIndex]);

  return (
    <>
      <View style={styles.measurementTextsContainer}>
        <Text style={styles.switcherOptionText} accessibilityLabel="" onLayout={handleTokenTextLayout}>
          {token.symbol}
        </Text>
        <Text style={styles.switcherOptionText} accessibilityLabel="" onLayout={handleUsdTextLayout}>
          USD
        </Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>

        {isDefined(tokenExchangeRate) && tokenExchangeRate !== 0 && (
          <TextSegmentControl
            values={[token.symbol, 'USD']}
            width={switcherWidth}
            selectedIndex={switcherIndex}
            onChange={handleSwitcherChange}
          />
        )}
      </View>
      <Divider size={formatSize(8)} />
      <View style={[styles.mainInputWrapper, conditionalStyle(isError, styles.mainInputWrapperError)]}>
        <StyledNumericInput
          containerStyle={styles.amountInputContainer}
          isShowCleanButton={true}
          placeholder="0.00"
          value={inputValue}
          decimals={token.decimals}
          onChange={handleAmountChange}
          onBlur={onBlur}
        />

        <Dropdown
          title="Assets"
          list={tokens}
          equalityFn={tokenEqualityFn}
          renderValue={TokenValue}
          renderListItem={renderTokenListItem}
          valueContainerStyle={styles.dropdownValueContainer}
          onValueChange={handleTokenChange}
          value={token}
        />
      </View>
      <Divider size={formatSize(8)} />
      <View style={styles.row}>
        <Text style={styles.equivalent}>{equivalentLabel}</Text>

        <Text style={styles.balanceValue}>
          <Text style={styles.balanceTitle}>Balance:</Text> {balanceLabel}
        </Text>
      </View>
    </>
  );
};
