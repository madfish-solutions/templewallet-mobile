import type { TextInputProps } from 'react-native';

import type { TestIdProps } from 'src/interfaces/test-id.props';
import type { TopUpInterfaceBase } from 'src/interfaces/topup.interface';

export interface TopUpAssetAmountInterface {
  asset: TopUpInterfaceBase;
  amount?: BigNumber;
  min?: number;
  max?: number;
}

export interface TopUpFormAssetAmountInputProps extends TestIdProps {
  name: string;
  label: string;
  description?: string;
  emptyListText?: string;
  assetsList?: TopUpInterfaceBase[];
  singleAsset?: boolean;
  isError?: boolean;
  editable?: boolean;
  isSearchable?: boolean;
  selectionOptions?: TextInputProps['selection'];
  precision?: number;
  tokenTestID?: string;
  newValueFn?: (
    prevValue: TopUpAssetAmountInterface,
    newAsset: TopUpInterfaceBase,
    newAmount: BigNumber | undefined
  ) => TopUpAssetAmountInterface;
  setSearchValue?: SyncFn<string>;
  onBlur?: EmptyFn;
  onFocus?: TextInputProps['onFocus'];
  onValueChange?: SyncFn<TopUpAssetAmountInterface>;
}

export interface TopUpAssetAmountInputProps extends TopUpFormAssetAmountInputProps {
  value: TopUpAssetAmountInterface;
  onValueChange: SyncFn<TopUpAssetAmountInterface>;
}
