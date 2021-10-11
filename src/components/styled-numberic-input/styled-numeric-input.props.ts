import { BigNumber } from 'bignumber.js';

import { EventFn } from '../../config/general';
import { StyledTextInputProps } from '../styled-text-input/styled-text-input.props';

export interface StyledNumericInputProps
  extends Pick<
    StyledTextInputProps,
    'editable' | 'placeholder' | 'isError' | 'isShowCleanButton' | 'onBlur' | 'onFocus'
  > {
  value?: BigNumber;
  decimals?: number;
  onChange?: EventFn<BigNumber | undefined>;
}
