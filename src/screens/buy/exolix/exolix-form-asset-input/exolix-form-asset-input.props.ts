import { TextInputProps } from 'react-native';

import { EmptyFn, EventFn } from '../../../../config/general';
import { CurrenciesInterface } from '../../../../interfaces/exolix.interface';
import { ExolixAssetAmountInterface } from './exolix-asset-amount-input';

export interface ExolixFormAssetAmountInputProps {
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
  onValueChange?: EventFn<ExolixAssetAmountInterface>;
}

export interface ExolixAssetAmountInputProps {
  value: ExolixAssetAmountInterface;
  name: string;
  label: string;
  assetsList: CurrenciesInterface[];
  isError?: boolean;
  editable?: boolean;
  isSearchable?: boolean;
  selectionOptions?: TextInputProps['selection'];
  setSearchValue?: EventFn<string>;
  onBlur?: EmptyFn;
  onFocus?: TextInputProps['onFocus'];
  onValueChange: EventFn<ExolixAssetAmountInterface>;
}
