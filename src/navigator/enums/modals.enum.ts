import { WalletAccountInterface } from '../../interfaces/wallet-account.interface';
import { ConfirmationModalParams } from '../../modals/confirmation-modal/confirmation-modal.params';
import { AssetMetadataInterface } from '../../token/interfaces/token-metadata.interface';

export enum ModalsEnum {
  Receive = 'Receive',
  Send = 'Send',
  AddToken = 'AddToken',
  CreateHdAccount = 'CreateHdAccount',
  SelectBaker = 'SelectBaker',
  Confirmation = 'Confirmation',
  RevealSeedPhrase = 'RevealSeedPhrase',
  RevealPrivateKey = 'RevealPrivateKey',
  ApprovePassword = 'ApprovePassword'
}

export type ModalsParamList = {
  [ModalsEnum.Receive]: undefined;
  [ModalsEnum.Send]: { asset: AssetMetadataInterface };
  [ModalsEnum.AddToken]: undefined;
  [ModalsEnum.CreateHdAccount]: undefined;
  [ModalsEnum.SelectBaker]: undefined;
  [ModalsEnum.Confirmation]: ConfirmationModalParams;
  [ModalsEnum.RevealSeedPhrase]: { account?: WalletAccountInterface };
  [ModalsEnum.RevealPrivateKey]: { account: WalletAccountInterface };
  [ModalsEnum.ApprovePassword]: { shouldEnableBiometry: boolean };
};
