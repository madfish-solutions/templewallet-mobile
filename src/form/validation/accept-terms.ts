import { boolean } from 'yup';

const termOfUsageError = 'Unable to continue without accepting Terms of Use';

export const acceptTermsValidation = boolean().required(termOfUsageError).oneOf([true], termOfUsageError);
