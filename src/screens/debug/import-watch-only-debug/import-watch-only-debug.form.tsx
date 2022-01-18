import { object, SchemaOf, string } from 'yup';

import { makeRequiredErrorMessage } from '../../../form/validation/messages';
import { walletAddressValidation } from '../../../form/validation/wallet-address';

export type ImportWatchOnlyDebugValues = {
  name: string;
  address: string;
};

export const importWatchOnlyDebugInitialValues: ImportWatchOnlyDebugValues = {
  name: '',
  address: ''
};

export const importWatchOnlyDebugValidationSchema: SchemaOf<ImportWatchOnlyDebugValues> = object().shape({
  name: string().required(makeRequiredErrorMessage('Name')),
  address: walletAddressValidation
});
