import { AccountInterface } from 'src/interfaces/account.interface';

export type ReadOnlySignerPayload = Pick<AccountInterface, 'publicKey' | 'publicKeyHash'>;
