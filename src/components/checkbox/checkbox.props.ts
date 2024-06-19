import { ReactNode } from 'react';

import { TestIdProps } from 'src/interfaces/test-id.props';

export interface CheckboxProps extends TestIdProps {
  disabled?: boolean;
  value: boolean;
  size?: number;
  strokeWidth?: number;
  inverted?: boolean;
  onChange: SyncFn<boolean>;
  children?: ReactNode;
}
