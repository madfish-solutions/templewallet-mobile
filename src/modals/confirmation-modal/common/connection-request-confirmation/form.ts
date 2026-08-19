import { object, SchemaOf } from 'yup';

import { Account } from 'src/interfaces/account.interfaces';

export interface ConnectionRequestConfirmationFormValues {
  approver: Account;
}

export const connectionRequestConfirmationValidationSchema: SchemaOf<ConnectionRequestConfirmationFormValues> =
  object().shape({
    approver: object().shape({}).required()
  });
