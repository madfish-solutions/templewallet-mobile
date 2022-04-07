import { AppCheckInterface } from '../../interfaces/app-check.interface';
import { createActions } from '../create-actions';

export const enterPassword = createActions<void, void, void>('security/ENTER_PASSWORD');

export const checkApp = createActions<string, AppCheckInterface, string>('security/CHECK_APP');
