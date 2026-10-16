import { ReactNode } from 'react';

import { TestIdProps } from 'src/interfaces/test-id.props';

import { IconV2Props } from '../icon-v2';

export interface CheckboxProps extends TestIdProps {
  disabled?: boolean;
  value: boolean;
  size?: IconV2Props['size'];
  onChange: SyncFn<boolean>;
  children?: ReactNode;
}
