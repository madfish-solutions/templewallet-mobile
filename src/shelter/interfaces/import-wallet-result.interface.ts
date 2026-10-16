import { Account } from 'src/interfaces/account.interfaces';
import { SaplingAccountCredentials } from 'src/interfaces/sapling-service.interface';

export interface ImportWalletResult {
  accounts: Account[];
  saplingCredentials: SaplingAccountCredentials[];
}
