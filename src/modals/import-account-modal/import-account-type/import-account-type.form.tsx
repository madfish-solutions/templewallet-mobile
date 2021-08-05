import { mixed, object, SchemaOf } from 'yup';

import { ImportAccountTypeEnum, ImportAccountTypeValues } from '../../../interfaces/import-account-type';

export const importAccountTypeValidationSchema: SchemaOf<ImportAccountTypeValues> = object().shape({
  type: mixed<ImportAccountTypeEnum>().oneOf(Object.values(ImportAccountTypeEnum)).required()
});

export const importAccountTypeInitialValues: ImportAccountTypeValues = {
  type: ImportAccountTypeEnum.PRIVATE_KEY
};
