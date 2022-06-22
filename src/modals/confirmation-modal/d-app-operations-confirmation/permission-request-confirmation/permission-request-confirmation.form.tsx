import { object, SchemaOf } from 'yup';

import { AccountInterface } from '../../../../interfaces/account.interface';

export interface PermissionRequestConfirmationFormValues {
  approver: AccountInterface;
}

export const permissionRequestConfirmationModalValidationSchema: SchemaOf<PermissionRequestConfirmationFormValues> =
  object().shape({
    approver: object().shape({}).required()
  });
