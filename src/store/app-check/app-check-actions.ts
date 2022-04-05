import { AppCheckInterface } from '../../interfaces/app-check.interface';
import { createActions } from '../create-actions';

export const checkApp = createActions<void, AppCheckInterface, string>('app-check/CHECK_APP');
