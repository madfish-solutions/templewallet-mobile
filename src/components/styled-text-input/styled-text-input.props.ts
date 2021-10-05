import { TextInputProps } from 'react-native';

import { EmptyFn } from '../../config/general';
import { TestIdProps } from '../../interfaces/test-id.props';

export interface StyledTextInputProps extends TextInputProps, TestIdProps {
  isError?: boolean;
  isPasswordInput?: boolean;
  isShowCleanButton?: boolean;
  onBlur?: EmptyFn;
}
