import { WalletAccountInterface } from '../interfaces/wallet-account.interface';

export enum ModalsEnum {
  Receive = 'Receive',
  Send = 'Send',
  AddToken = 'AddToken',
  CreateHdAccount = 'CreateHdAccount',
  SelectBaker = 'SelectBaker',
  RevealSeedPhrase = 'RevealSeedPhrase',
  RevealPrivateKey = 'RevealPrivateKey'
}

export type ModalsParamList = {
  [ModalsEnum.Receive]: undefined;
  [ModalsEnum.Send]: undefined;
  [ModalsEnum.AddToken]: undefined;
  [ModalsEnum.CreateHdAccount]: undefined;
  [ModalsEnum.SelectBaker]: undefined;
  [ModalsEnum.RevealSeedPhrase]: { account?: WalletAccountInterface };
  [ModalsEnum.RevealPrivateKey]: { account: WalletAccountInterface };
};
