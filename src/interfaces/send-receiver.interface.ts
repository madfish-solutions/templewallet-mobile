import { Account } from './account.interfaces';
import { Contact } from './contact.interface';

export interface AccountReceiver extends Contact {
  kind: 'account';
  account: Account;
}

export interface ContactReceiver extends Contact {
  kind: 'contact';
}

export type SendReceiver = AccountReceiver | ContactReceiver;
