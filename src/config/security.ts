import { ONE_MINUTE } from './fixed-times';

export const MAX_PASSWORD_ATTEMPTS = 3;
export const WRONG_PASSWORD_LOCK_TIME = ONE_MINUTE;
export const WALLET_AUTOLOCK_TIME = 3 * ONE_MINUTE;
export const INITIAL_ENTER_WRONG_PASSWORD_ATTEMPTS = 1;
export const INITIAL_ENTER_PASSWORD_LOCKTIME = 0;
export const RANDOM_DELAY_TIME = 1000;
export const CONSTANT_DELAY_TIME = 1000;

export const MIN_CHARS_REGX = /^.{8,}$/;
export const AT_LEAST_ONE_NUMBER_REGX = /\d/;
export const AT_LEAST_ONE_LOWER_CASE_REGX = /[a-z]/;
export const AT_LEAST_ONE_UPPER_CASE_REGX = /[A-Z]/;
export const SPECIAL_CHARACTER_REGX = /[!@#$%^&*()_+\-=\]{};':"\\|,.<>?]/;
