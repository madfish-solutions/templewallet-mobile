import BigNumber from 'bignumber.js';

import { TestIdProps } from 'src/interfaces/test-id.props';

import { StyledTextInputProps } from '../styled-text-input/styled-text-input.props';

export interface StyledNumericInputProps
  extends TestIdProps,
    Pick<StyledTextInputProps, 'editable' | 'placeholder' | 'isError' | 'isShowCleanButton' | 'onBlur' | 'onFocus'> {
  value?: BigNumber;
  minValue?: BigNumber.Value;
  maxValue?: BigNumber.Value;
  decimals?: number;
  onChange?: SyncFn<BigNumber | undefined>;
}
