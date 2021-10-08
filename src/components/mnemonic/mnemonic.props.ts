import { StyledTextInputProps } from '../styled-text-input/styled-text-input.props';

export type MnemonicProps = Pick<
  StyledTextInputProps,
  'value' | 'isError' | 'placeholder' | 'onBlur' | 'onChangeText' | 'testID'
>;
