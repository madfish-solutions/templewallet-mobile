import { object, string } from 'yup';

import { makeRequiredErrorMessage } from 'src/form/validation/messages';

export const importAccountPrivateKeyValidationSchema = object().shape({
  privateKey: string().required(makeRequiredErrorMessage('Private key'))
});

export const importAccountPrivateKeyInitialValues: { privateKey: string } = {
  privateKey: ''
};
