import { mixed, object, SchemaOf } from 'yup';

import { ImportAccountTypeEnum } from '../../../enums/account-type.enum';

export const importAccountTypeValidationSchema: SchemaOf<{ type: ImportAccountTypeEnum }> = object().shape({
  type: mixed<ImportAccountTypeEnum>().oneOf(Object.values(ImportAccountTypeEnum)).required()
});

export const importAccountTypeInitialValues: { type: ImportAccountTypeEnum } = {
  type: ImportAccountTypeEnum.PRIVATE_KEY
};
