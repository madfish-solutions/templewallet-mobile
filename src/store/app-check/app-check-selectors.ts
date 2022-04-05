import { useSelector } from 'react-redux';

import { AppCheckInterface } from '../../interfaces/app-check.interface';
import { AppCheckRootState } from './app-check-state';

export const useCheckInfoSelector = () =>
  useSelector<AppCheckRootState, AppCheckInterface>(({ appCheck }) => appCheck.checkInfo.data);
