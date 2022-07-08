import { TextInputProps } from 'react-native';

import { EmptyFn, EventFn } from '../../../../config/general';
import { CurrenciesInterface } from '../../../../interfaces/exolix.interface';
import { ExolixAssetAmountInterface } from './exolix-asset-amount-input';

export interface ExolixFormAssetAmountInputProps {
  name: string;
  value: ExolixAssetAmountInterface;
  label: string;
  assetsList: CurrenciesInterface[];
  frozenBalance?: string;
  isError?: boolean;
  editable?: boolean;
  toUsdToggle?: boolean;
  isSearchable?: boolean;
  selectionOptions?: TextInputProps['selection'];
  setSearchValue?: EventFn<string>;
  onBlur?: EmptyFn;
  onFocus?: TextInputProps['onFocus'];
  onValueChange: EventFn<ExolixAssetAmountInterface>;
}
