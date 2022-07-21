import { BigNumber } from 'bignumber.js';
import { TextInputProps } from 'react-native';

import { EmptyFn, EventFn } from '../../../../config/general';
import { CurrenciesInterface } from '../../../../interfaces/exolix.interface';

export interface TopUpAssetAmountInterface {
  asset: CurrenciesInterface;
  amount?: BigNumber;
  min?: number;
  max?: number;
}

export interface TopUpFormAssetAmountInputProps {
  name: string;
  label: string;
  assetsList?: CurrenciesInterface[];
  isError?: boolean;
  editable?: boolean;
  isSearchable?: boolean;
  selectionOptions?: TextInputProps['selection'];
  setSearchValue?: EventFn<string>;
  onBlur?: EmptyFn;
  onFocus?: TextInputProps['onFocus'];
  onValueChange?: EventFn<TopUpAssetAmountInterface>;
}

export interface TopUpAssetAmountInputProps extends TopUpFormAssetAmountInputProps {
  value: TopUpAssetAmountInterface;
  onValueChange: EventFn<TopUpAssetAmountInterface>;
}
