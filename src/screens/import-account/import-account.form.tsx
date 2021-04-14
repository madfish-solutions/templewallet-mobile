import { boolean, object, ref, SchemaOf, string } from 'yup';
import { requiredErrorMessage } from '../../form/validation/shared';
import { seedPhraseValidation } from '../../form/validation/seed-phrase';
import { passwordValidation } from '../../form/validation/password';

export type ImportAccountFormValues = {
  seedPhrase: string;
  password: string;
  passwordConfirmation: string;
  acceptTerms: boolean;
};

const repeatPasswordError = 'Must be equal to password above';
const termOfUsageError = 'Unable to continue without confirming Terms of Usage';

export const importAccountValidationSchema: SchemaOf<ImportAccountFormValues> = object().shape({
  seedPhrase: seedPhraseValidation,
  password: passwordValidation,
  passwordConfirmation: string()
    .required(requiredErrorMessage)
    .oneOf([ref('password')], repeatPasswordError),
  acceptTerms: boolean().required(termOfUsageError).oneOf([true], termOfUsageError)
});

export const importAccountInitialValues: ImportAccountFormValues = {
  seedPhrase: '',
  password: '',
  passwordConfirmation: '',
  acceptTerms: false
};
