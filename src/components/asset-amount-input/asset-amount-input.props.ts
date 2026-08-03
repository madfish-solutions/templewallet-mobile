import BigNumber from 'bignumber.js';
import { ReactNode } from 'react';
import { TextInputProps, TextStyle, ViewStyle } from 'react-native';

import { AssetInterface } from 'src/interfaces/asset.interface';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { TokenInterface } from 'src/token/interfaces/token.interface';

import type { AssetAmountInterface } from './asset-amount-input';
import type { AssetAmountInputVariant } from './asset-amount-input.variants';

export interface AssetAmountInputStylesConfig {
  balanceText?: TextStyle;
  amountInput?: TextStyle;
  inputContainer?: ViewStyle;
}

export interface AssetAmountInputProps<TAsset extends AssetInterface = TokenInterface> extends TestIdProps {
  variant?: AssetAmountInputVariant;
  expectedGasExpense?: BigNumber.Value;
  stylesConfig?: AssetAmountInputStylesConfig;
  maxButton?: boolean;
  value: AssetAmountInterface<TAsset>;
  label: string;
  assetsList: TAsset[];
  balance?: string;
  balanceLabel?: string;
  frozenBalance?: string;
  isError?: boolean;
  footerErrorMessage?: string;
  editable?: boolean;
  toUsdToggle?: boolean;
  isLoading?: boolean;
  isSearchable?: boolean;
  searchPlaceholder?: string;
  dropdownListHeader?: ReactNode;
  dropdownDescription?: string;
  isShowNameForValue?: boolean;
  isSingleAsset?: boolean;
  selectionOptions?: TextInputProps['selection'];
  setSearchValue?: SyncFn<string>;
  onBlur?: EmptyFn;
  onFocus?: TextInputProps['onFocus'];
  onValueChange: SyncFn<AssetAmountInterface<TAsset>>;
  tokenTestID?: string;
  switcherTestID?: string;
  maxButtonTestID?: string;
}
