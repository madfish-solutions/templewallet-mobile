import { object, string } from 'yup';

import { makeRequiredErrorMessage } from '../../../form/validation/messages';
import { ImportAccountPrivateKeyValues } from '../../../interfaces/import-account-type';

export const importAccountPrivateKeyValidationSchema = object().shape({
  privateKey: string().required(makeRequiredErrorMessage('Private key'))
});

export const importAccountPrivateKeyInitialValues: ImportAccountPrivateKeyValues = {
  privateKey: ''
};
