import { BigNumber } from 'bignumber.js';
import { TextInputProps } from 'react-native';

import { EmptyFn, EventFn } from 'src/config/general';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { TopUpInputInterface } from 'src/store/buy-with-credit-card/types';

export interface TopUpAssetAmountInterface {
  asset: TopUpInputInterface;
  amount?: BigNumber;
  min?: number;
  max?: number;
}

export interface TopUpFormAssetAmountInputProps extends TestIdProps {
  name: string;
  label: string;
  description?: string;
  emptyListText?: string;
  assetsList?: TopUpInputInterface[];
  singleAsset?: boolean;
  isError?: boolean;
  editable?: boolean;
  isSearchable?: boolean;
  selectionOptions?: TextInputProps['selection'];
  precision?: number;
  newValueFn?: (
    prevValue: TopUpAssetAmountInterface,
    newAsset: TopUpInputInterface,
    newAmount: BigNumber | undefined
  ) => TopUpAssetAmountInterface;
  setSearchValue?: EventFn<string>;
  onBlur?: EmptyFn;
  onFocus?: TextInputProps['onFocus'];
  onValueChange?: EventFn<TopUpAssetAmountInterface>;
}

export interface TopUpAssetAmountInputProps extends TopUpFormAssetAmountInputProps {
  value?: TopUpAssetAmountInterface;
  onValueChange: EventFn<TopUpAssetAmountInterface>;
}
