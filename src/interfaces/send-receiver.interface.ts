import { Contact } from './contact.interface';

export interface SendReceiver extends Contact {
  accountId?: string;
}
