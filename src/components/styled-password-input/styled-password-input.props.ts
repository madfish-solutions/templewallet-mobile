import { StyledTextInputProps } from '../styled-text-input/styled-text-input.props';

export type StyledPasswordInputProps = Omit<StyledTextInputProps, 'isPasswordInput'>;
