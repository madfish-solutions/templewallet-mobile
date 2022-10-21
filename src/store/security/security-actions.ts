import { createAction } from '@reduxjs/toolkit';

import { AppCheckInterface } from '../../interfaces/app-check.interface';
import { createActions } from '../create-actions';

export const enterPassword = createActions<void, void, void>('security/ENTER_PASSWORD');

export const checkApp = createActions<void, AppCheckInterface, string>('security/CHECK_APP');

export const verifySeedPhrase = createAction<boolean>('security/VERIFY_SEED_PHRASE');

export const showBackupModal = createAction<boolean>('security/SHOW_BACKUP_MODAL');
