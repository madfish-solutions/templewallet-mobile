import { BigNumber } from 'bignumber.js';

import { EventFn } from '../../config/general';
import { StyledTextInputProps } from '../styled-text-input/styled-text-input';

export interface StyledNumericInputProps
  extends Pick<StyledTextInputProps, 'editable' | 'isError' | 'isShowCleanButton' | 'onBlur' | 'onFocus'> {
  value?: BigNumber;
  decimals?: number;
  min?: BigNumber;
  max?: BigNumber;
  onChange?: EventFn<BigNumber | undefined>;
}
