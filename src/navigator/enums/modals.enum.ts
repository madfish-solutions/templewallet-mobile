import { WalletAccountInterface } from '../../interfaces/wallet-account.interface';
import { ConfirmationModalParams } from '../../modals/confirmation-modal/confirmation-modal.params';
import { TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { TokenInterface } from '../../token/interfaces/token.interface';

export enum ModalsEnum {
  Receive = 'Receive',
  Send = 'Send',
  AddToken = 'AddToken',
  RenameAccount = 'RenameAccount',
  SelectBaker = 'SelectBaker',
  Confirmation = 'Confirmation',
  RevealSeedPhrase = 'RevealSeedPhrase',
  RevealPrivateKey = 'RevealPrivateKey',
  EnableBiometryPassword = 'EnableBiometryPassword',
  ImportAccount = 'ImportAccount',
  CollectibleModal = 'CollectibleModal'
}

export type ModalsParamList = {
  [ModalsEnum.Receive]: { token: TokenMetadataInterface };
  [ModalsEnum.Send]: { token: TokenMetadataInterface; receiverPublicKeyHash?: string };
  [ModalsEnum.AddToken]: undefined;
  [ModalsEnum.RenameAccount]: { account: WalletAccountInterface };
  [ModalsEnum.SelectBaker]: undefined;
  [ModalsEnum.Confirmation]: ConfirmationModalParams;
  [ModalsEnum.RevealSeedPhrase]: { account?: WalletAccountInterface };
  [ModalsEnum.RevealPrivateKey]: { account: WalletAccountInterface };
  [ModalsEnum.EnableBiometryPassword]: undefined;
  [ModalsEnum.ImportAccount]: undefined;
  [ModalsEnum.CollectibleModal]: { collectible: TokenInterface };
};
