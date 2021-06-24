import { object, SchemaOf } from 'yup';

import { WalletAccountInterface } from '../../../../interfaces/wallet-account.interface';

export interface PermissionRequestConfirmationFormValues {
  approver: WalletAccountInterface;
}

export const permissionRequestConfirmationModalValidationSchema: SchemaOf<PermissionRequestConfirmationFormValues> =
  object().shape({
    approver: object().shape({}).required()
  });
