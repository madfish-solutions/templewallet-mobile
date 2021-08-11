import { AccountTypeEnum } from '../enums/account-type.enum';
import { mockAccountCredentials } from '../mocks/account-credentials.mock';
import { WalletAccountInterface } from './wallet-account.interface';

export const mockAccount: WalletAccountInterface = {
  name: 'mockAccount',
  publicKey: mockAccountCredentials.publicKey,
  type: AccountTypeEnum.HD_ACCOUNT,
  publicKeyHash: mockAccountCredentials.publicKeyHash,
  tezosBalance: { isLoading: false, data: '1000000' },
  tokensList: []
};
