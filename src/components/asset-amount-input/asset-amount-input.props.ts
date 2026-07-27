import BigNumber from 'bignumber.js';
import { ReactNode } from 'react';
import { TextInputProps, TextStyle, ViewStyle } from 'react-native';

import { TestIdProps } from 'src/interfaces/test-id.props';
import { TokenInterface } from 'src/token/interfaces/token.interface';

import type { AssetAmountInterface } from './asset-amount-input';

export interface AssetAmountInputStylesConfig {
  balanceText?: TextStyle;
  amountInput?: TextStyle;
  inputContainer?: ViewStyle;
}

export interface AssetAmountInputProps extends TestIdProps {
  expectedGasExpense?: BigNumber.Value;
  stylesConfig?: AssetAmountInputStylesConfig;
  maxButton?: boolean;
  value: AssetAmountInterface;
  label: string;
  assetsList: TokenInterface[];
  balance?: string;
  balanceLabel?: string;
  frozenBalance?: string;
  isError?: boolean;
  footerErrorMessage?: string;
  editable?: boolean;
  toUsdToggle?: boolean;
  inputTypeSwitcherGap?: number;
  inputTypeSwitcherVariant?: 'default' | 'figma';
  inputTypeSwitcherWidth?: number;
  inputHeight?: number;
  dropdownVerticalPadding?: number;
  isLoading?: boolean;
  isSearchable?: boolean;
  searchPlaceholder?: string;
  dropdownListHeader?: ReactNode;
  dropdownDescription?: string;
  isShowNameForValue?: boolean;
  selectedTokenIconSize?: number;
  selectedTokenIconVisualSize?: number;
  selectedTokenIconGap?: number;
  selectedTokenDropdownWidth?: number;
  isSingleAsset?: boolean;
  selectionOptions?: TextInputProps['selection'];
  setSearchValue?: SyncFn<string>;
  onBlur?: EmptyFn;
  onFocus?: TextInputProps['onFocus'];
  onValueChange: SyncFn<AssetAmountInterface>;
  tokenTestID?: string;
  switcherTestID?: string;
  maxButtonTestID?: string;
}
