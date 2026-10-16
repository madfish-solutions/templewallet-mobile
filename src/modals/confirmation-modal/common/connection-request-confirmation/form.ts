import { object, SchemaOf } from 'yup';

import { Account } from 'src/interfaces/account.interfaces';

export interface ConnectionRequestConfirmationFormValues<T extends Account = Account> {
  approver: T;
}

export const connectionRequestConfirmationValidationSchema: SchemaOf<ConnectionRequestConfirmationFormValues> =
  object().shape({
    approver: object().shape({}).required()
  });
