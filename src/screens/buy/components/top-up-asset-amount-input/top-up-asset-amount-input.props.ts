import { BigNumber } from 'bignumber.js';
import { TextInputProps } from 'react-native';

import { EmptyFn, EventFn } from '../../../../config/general';
import { TopUpInputInterface } from '../../../../interfaces/topup.interface';

export interface TopUpAssetAmountInterface {
  asset: TopUpInputInterface;
  amount?: BigNumber;
  min?: number;
  max?: number;
}

export interface TopUpFormAssetAmountInputProps {
  name: string;
  label: string;
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
