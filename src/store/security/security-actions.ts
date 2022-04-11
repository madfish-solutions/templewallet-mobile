import { createActions } from '../create-actions';

export const enterPassword = createActions<void, void, void>('security/ENTER_PASSWORD');

export const checkApp = createActions<void, boolean, string>('security/CHECK_APP');
