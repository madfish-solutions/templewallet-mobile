import { BigNumber } from 'bignumber.js';
import { StyleProp, TextInputProps, TextStyle } from 'react-native';

import { EmptyFn, EventFn } from '../../config/general';
import { TestIdProps } from '../../interfaces/test-id.props';
import { TokenInterface } from '../../token/interfaces/token.interface';
import { AssetAmountInterface } from './asset-amount-input';

export interface AssetAmountInputProps extends TestIdProps {
  expectedGasExpense?: BigNumber.Value;
  balanceValueStyles?: StyleProp<TextStyle>;
  maxButton?: boolean;
  value: AssetAmountInterface;
  label: string;
  assetsList: TokenInterface[];
  frozenBalance?: string;
  isError?: boolean;
  editable?: boolean;
  toUsdToggle?: boolean;
  isLoading?: boolean;
  isSearchable?: boolean;
  selectionOptions?: TextInputProps['selection'];
  setSearchValue?: EventFn<string>;
  onBlur?: EmptyFn;
  onFocus?: TextInputProps['onFocus'];
  onValueChange: EventFn<AssetAmountInterface>;
}
