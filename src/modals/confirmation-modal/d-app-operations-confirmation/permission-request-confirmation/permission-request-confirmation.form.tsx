import { object, SchemaOf } from 'yup';

import { AccountInterface } from 'src/interfaces/account.interface';

export interface PermissionRequestConfirmationFormValues {
  approver: AccountInterface;
}

export const permissionRequestConfirmationModalValidationSchema: SchemaOf<PermissionRequestConfirmationFormValues> =
  object().shape({
    approver: object().shape({}).required()
  });
