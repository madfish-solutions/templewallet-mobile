import { ConfirmPayload } from '../interfaces/confirm-payload/confirm-payload.type';
import { WalletAccountInterface } from '../interfaces/wallet-account.interface';
import { TokenInterface } from '../token/interfaces/token.interface';

export enum ModalsEnum {
  Receive = 'Receive',
  Send = 'Send',
  AddToken = 'AddToken',
  CreateHdAccount = 'CreateHdAccount',
  SelectBaker = 'SelectBaker',
  Confirm = 'Confirm',
  RevealSeedPhrase = 'RevealSeedPhrase',
  RevealPrivateKey = 'RevealPrivateKey'
}

export type ModalsParamList = {
  [ModalsEnum.Receive]: undefined;
  [ModalsEnum.Send]: { token?: TokenInterface };
  [ModalsEnum.AddToken]: undefined;
  [ModalsEnum.CreateHdAccount]: undefined;
  [ModalsEnum.SelectBaker]: undefined;
  [ModalsEnum.Confirm]: ConfirmPayload;
  [ModalsEnum.RevealSeedPhrase]: { account?: WalletAccountInterface };
  [ModalsEnum.RevealPrivateKey]: { account: WalletAccountInterface };
};
