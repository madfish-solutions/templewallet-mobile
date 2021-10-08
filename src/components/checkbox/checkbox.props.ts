import { EventFn } from '../../config/general';
import { TestIdProps } from '../../interfaces/test-id.props';

export interface CheckboxProps extends TestIdProps {
  disabled?: boolean;
  value: boolean;
  size?: number;
  strokeWidth?: number;
  onChange: EventFn<boolean>;
}
