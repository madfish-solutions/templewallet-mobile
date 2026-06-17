import { object, SchemaOf } from 'yup';

import { Account } from 'src/interfaces/account.interfaces';

export interface PermissionRequestConfirmationFormValues {
  approver: Account;
}

export const permissionRequestConfirmationModalValidationSchema: SchemaOf<PermissionRequestConfirmationFormValues> =
  object().shape({
    approver: object().shape({}).required()
  });
