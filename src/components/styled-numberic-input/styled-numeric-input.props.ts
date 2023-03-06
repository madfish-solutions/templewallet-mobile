import { BigNumber } from 'bignumber.js';

import { EventFn } from '../../config/general';
import { TestIdProps } from '../../interfaces/test-id.props';
import { StyledTextInputProps } from '../styled-text-input/styled-text-input.props';

export interface StyledNumericInputProps
  extends TestIdProps,
    Pick<StyledTextInputProps, 'editable' | 'placeholder' | 'isError' | 'isShowCleanButton' | 'onBlur' | 'onFocus'> {
  value?: BigNumber;
  minValue?: BigNumber;
  maxValue?: BigNumber;
  decimals?: number;
  onChange?: EventFn<BigNumber | undefined>;
}
