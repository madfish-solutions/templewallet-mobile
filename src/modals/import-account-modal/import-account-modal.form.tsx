import { mixed, object, SchemaOf, string } from 'yup';

import { seedPhraseValidation } from '../../form/validation/seed-phrase';
import {
  ImportAccountDerivationEnum,
  ImportAccountPrivateKeyValues,
  ImportAccountSeedValues,
  ImportAccountTypeEnum,
  ImportAccountTypeValues
} from '../../interfaces/import-account-type';
import { getDerivationPath } from '../../utils/keys.util';
import {makeRequiredErrorMessage} from "../../form/validation/messages";

export const importAccountTypeValidationSchema: SchemaOf<ImportAccountTypeValues> = object().shape({
  type: mixed<ImportAccountTypeEnum>().oneOf(Object.values(ImportAccountTypeEnum)).required()
});

export const importAccountTypeInitialValues: ImportAccountTypeValues = {
  type: ImportAccountTypeEnum.PRIVATE_KEY
};

export const importAccountSeedFormInitialValues: ImportAccountSeedValues = {
  seedPhrase: '',
  password: '',
  derivation: ImportAccountDerivationEnum.DEFAULT,
  derivationPath: getDerivationPath(0)
};

export const importAccountPrivateKeyFormInitialValues: ImportAccountPrivateKeyValues = {
  privateKey: ''
};

export const importAccountSeedFormValidationSchema: SchemaOf<ImportAccountSeedValues> = object().shape({
  seedPhrase: seedPhraseValidation,
  password: string(),
  derivation: mixed<ImportAccountTypeEnum>().oneOf(Object.values(ImportAccountTypeEnum)).required(),
  derivationPath: string()
});

export const importAccountPrivateKeyFormValidationSchema = object().shape({
  privateKey: string().required(makeRequiredErrorMessage('Private key'))
});
