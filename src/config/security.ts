export const MAX_PASSWORD_ATTEMPTS = 3;
export const WRONG_PASSWORD_LOCK_TIME = 60 * 1000;
export const INITIAL_ENTER_WRONG_PASSWORD_ATTEMPTS = 1;
export const INITIAL_ENTER_PASSWORD_LOCKTIME = 0;
export const RANDOM_DELAY_TIME = 1000;
export const CONSTANT_DELAY_TIME = 1000;

export const MIN_PASSWORD_LENGTH = 8;
export const UPPER_CASE_LOWER_CASE_MIXTURE_REGX = /(?=.*[a-z])(?=.*[A-Z])/;
export const LETTERS_NUMBERS_MIXTURE_REGX = /(?=.*\d)(?=.*[A-Za-z])/;
export const SPECIAL_CHARACTER_REGX = /[!@#$%^&*()_+\-=\]{};':"\\|,.<>?]/;
