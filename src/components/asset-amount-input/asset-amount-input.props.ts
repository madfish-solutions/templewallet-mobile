import { TextInputProps } from 'react-native';

import { EmptyFn, EventFn } from '../../config/general';
import { TokenInterface } from '../../token/interfaces/token.interface';
import { AssetAmountInterface } from './asset-amount-input';

export interface AssetAmountInputProps {
  value: AssetAmountInterface;
  label: string;
  assetsList: TokenInterface[];
  frozenBalance?: string;
  isError?: boolean;
  editable?: boolean;
  toUsdToggle?: boolean;
  isSearchable?: boolean;
  selectionOptions?:
    | {
        start: number;
        end?: number | undefined;
      }
    | undefined;
  setSearchValue?: EventFn<string>;
  onBlur?: EmptyFn;
  onFocus?: TextInputProps['onFocus'];
  onValueChange: EventFn<AssetAmountInterface>;
}
