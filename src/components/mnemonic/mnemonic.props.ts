import { StyledTextInputProps } from '../styled-text-input/styled-text-input';

export type MnemonicProps = Pick<StyledTextInputProps, 'value' | 'isError' | 'onChangeText' | 'onBlur'>;
