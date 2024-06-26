import { AccountInterface, AccountBaseInterface } from 'src/interfaces/account.interface';
import { ConfirmationModalParams } from 'src/modals/confirmation-modal/confirmation-modal.params';
import { TokenMetadataInterface } from 'src/token/interfaces/token-metadata.interface';
import { EarnOpportunity } from 'src/types/earn-opportunity.types';

export enum ModalsEnum {
  Receive = 'Receive',
  Send = 'Send',
  AddAsset = 'AddAsset',
  RenameAccount = 'RenameAccount',
  SelectBaker = 'SelectBaker',
  Confirmation = 'Confirmation',
  RevealSeedPhrase = 'RevealSeedPhrase',
  RevealPrivateKey = 'RevealPrivateKey',
  EnableBiometryPassword = 'EnableBiometryPassword',
  CollectibleModal = 'CollectibleModal',
  AddCustomRpc = 'AddCustomRpc',
  EditCustomRpc = 'EditCustomRpc',
  AddContact = 'AddContact',
  EditContact = 'EditContact',
  ManageFarmingPool = 'ManageFarmingPool',
  Newsletter = 'Newsletter',
  InAppBrowser = 'InAppBrowser',
  ManageSavingsPool = 'ManageSavingsPool',
  ChooseWalletImportType = 'ChooseWalletImportType',
  ImportWalletFromSeedPhrase = 'ImportWalletFromSeedPhrase',
  ImportWalletFromKeystoreFile = 'ImportWalletFromKeystoreFile',
  SyncInstructions = 'SyncInstructions',
  ConfirmSync = 'ConfirmSync',
  ChooseAccountImportType = 'ChooseAccountImportType',
  ImportAccountFromSeedPhrase = 'ImportAccountFromSeedPhrase',
  ImportAccountFromPrivateKey = 'ImportAccountFromPrivateKey'
}

export type ModalsParamList = {
  [ModalsEnum.Receive]: { token: TokenMetadataInterface };
  [ModalsEnum.Send]: { token: TokenMetadataInterface; receiverPublicKeyHash?: string };
  [ModalsEnum.AddAsset]: undefined;
  [ModalsEnum.RenameAccount]: { account: AccountInterface };
  [ModalsEnum.SelectBaker]: undefined;
  [ModalsEnum.Confirmation]: ConfirmationModalParams;
  [ModalsEnum.RevealSeedPhrase]: { account?: AccountInterface };
  [ModalsEnum.RevealPrivateKey]: { account: AccountInterface };
  [ModalsEnum.EnableBiometryPassword]: undefined;
  [ModalsEnum.CollectibleModal]: { slug: string };
  [ModalsEnum.AddCustomRpc]: undefined;
  [ModalsEnum.EditCustomRpc]: { url: string };
  [ModalsEnum.AddContact]: AccountBaseInterface | undefined;
  [ModalsEnum.EditContact]: { contact: AccountBaseInterface; index: number };
  [ModalsEnum.ManageFarmingPool]: Pick<EarnOpportunity, 'id' | 'contractAddress'>;
  [ModalsEnum.ManageSavingsPool]: Pick<EarnOpportunity, 'id' | 'contractAddress'>;
  [ModalsEnum.Newsletter]: undefined;
  [ModalsEnum.InAppBrowser]: { uri: string };
  [ModalsEnum.ChooseWalletImportType]: undefined;
  [ModalsEnum.ImportWalletFromSeedPhrase]: undefined;
  [ModalsEnum.ImportWalletFromKeystoreFile]: undefined;
  [ModalsEnum.SyncInstructions]: undefined;
  [ModalsEnum.ConfirmSync]: { payload: string };
  [ModalsEnum.ChooseAccountImportType]: undefined;
  [ModalsEnum.ImportAccountFromSeedPhrase]: undefined;
  [ModalsEnum.ImportAccountFromPrivateKey]: undefined;
};
