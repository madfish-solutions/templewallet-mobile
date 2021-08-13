import { BigNumber } from 'bignumber.js';

import { EventFn } from '../../config/general';
import { StyledTextInputProps } from '../styled-text-input/styled-text-input';

export interface StyledNumericInputProps
  extends Pick<
    StyledTextInputProps,
    'containerStyle' | 'editable' | 'placeholder' | 'isError' | 'isShowCleanButton' | 'style' | 'onBlur' | 'onFocus'
  > {
  value?: BigNumber;
  decimals?: number;
  onChange?: EventFn<BigNumber | undefined>;
}
