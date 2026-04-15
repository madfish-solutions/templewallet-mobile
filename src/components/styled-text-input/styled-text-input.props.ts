import { TextInputProps } from 'react-native';

import { TestIdProps } from 'src/interfaces/test-id.props';

export interface StyledTextInputProps extends TextInputProps, TestIdProps {
  isError?: boolean;
  isPasswordInput?: boolean;
  isShowCleanButton?: boolean;
  onBlur?: EmptyFn;
}
