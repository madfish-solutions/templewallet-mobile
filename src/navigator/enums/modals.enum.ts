import { AccountInterface, AccountBaseInterface } from 'src/interfaces/account.interface';
import { ConfirmationModalParams } from 'src/modals/confirmation-modal/confirmation-modal.params';
import { TokenMetadataInterface } from 'src/token/interfaces/token-metadata.interface';
import { EarnOpportunity } from 'src/types/earn-opportunity.type';

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
  ImportAccount = 'ImportAccount',
  CollectibleModal = 'CollectibleModal',
  AddCustomRpc = 'AddCustomRpc',
  EditCustomRpc = 'EditCustomRpc',
  AddContact = 'AddContact',
  EditContact = 'EditContact',
  ManageFarmingPool = 'ManageFarmingPool',
  Newsletter = 'Newsletter',
  InAppBrowser = 'InAppBrowser',
  ManageSavingsPool = 'ManageSavingsPool',
  ChooseImportType = 'ChooseImportType',
  ImportFromSeed = 'ImportFromSeed',
  ImportFromKeystore = 'ImportFromKeystore',
  SyncInstructions = 'SyncInstructions',
  ConfirmSync = 'ConfirmSync'
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
  [ModalsEnum.ImportAccount]: undefined;
  [ModalsEnum.CollectibleModal]: { slug: string };
  [ModalsEnum.AddCustomRpc]: undefined;
  [ModalsEnum.EditCustomRpc]: { url: string };
  [ModalsEnum.AddContact]: AccountBaseInterface | undefined;
  [ModalsEnum.EditContact]: { contact: AccountBaseInterface; index: number };
  [ModalsEnum.ManageFarmingPool]: Pick<EarnOpportunity, 'id' | 'contractAddress'>;
  [ModalsEnum.ManageSavingsPool]: Pick<EarnOpportunity, 'id' | 'contractAddress'>;
  [ModalsEnum.Newsletter]: undefined;
  [ModalsEnum.InAppBrowser]: { uri: string };
  [ModalsEnum.ChooseImportType]: undefined;
  [ModalsEnum.ImportFromSeed]: undefined;
  [ModalsEnum.ImportFromKeystore]: undefined;
  [ModalsEnum.SyncInstructions]: undefined;
  [ModalsEnum.ConfirmSync]: { payload: string };
};
