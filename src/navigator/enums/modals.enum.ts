import { Account } from 'src/interfaces/account.interfaces';
import { Contact } from 'src/interfaces/contact.interface';
import { ConfirmationModalParams } from 'src/modals/confirmation-modal/confirmation-modal.params';
import { TezosTokenMetadata } from 'src/token/interfaces/token-metadata.interface';
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
  SyncInstructions = 'SyncInstructions',
  ConfirmSync = 'ConfirmSync',
  ChooseAccountImportType = 'ChooseAccountImportType',
  ImportAccountFromSeedPhrase = 'ImportAccountFromSeedPhrase',
  ImportAccountFromPrivateKey = 'ImportAccountFromPrivateKey',
  ImportAccountFromKeystoreFile = 'ImportAccountFromKeystoreFile',
  KoloCard = 'KoloCard',
  ShieldedAnnouncement = 'ShieldedAnnouncement',
  Rebalance = 'Rebalance'
}

export type ModalsParamList = {
  [ModalsEnum.Receive]: { token: TezosTokenMetadata };
  [ModalsEnum.Send]: { token: TezosTokenMetadata; receiverPublicKeyHash?: string };
  [ModalsEnum.AddAsset]: undefined;
  [ModalsEnum.RenameAccount]: { account: Account };
  [ModalsEnum.SelectBaker]: undefined;
  [ModalsEnum.Confirmation]: ConfirmationModalParams;
  [ModalsEnum.RevealSeedPhrase]: { account?: Account };
  [ModalsEnum.RevealPrivateKey]: { account: Account };
  [ModalsEnum.EnableBiometryPassword]: undefined;
  [ModalsEnum.CollectibleModal]: { slug: string };
  [ModalsEnum.AddCustomRpc]: undefined;
  [ModalsEnum.EditCustomRpc]: { url: string };
  [ModalsEnum.AddContact]: Contact | undefined;
  [ModalsEnum.EditContact]: { contact: Contact; index: number };
  [ModalsEnum.ManageFarmingPool]: Pick<EarnOpportunity, 'id' | 'contractAddress'>;
  [ModalsEnum.ManageSavingsPool]: Pick<EarnOpportunity, 'id' | 'contractAddress'>;
  [ModalsEnum.Newsletter]: undefined;
  [ModalsEnum.InAppBrowser]: { uri: string };
  [ModalsEnum.ChooseWalletImportType]: undefined;
  [ModalsEnum.ImportWalletFromSeedPhrase]: undefined;
  [ModalsEnum.SyncInstructions]: undefined;
  [ModalsEnum.ConfirmSync]: { payload: string };
  [ModalsEnum.ChooseAccountImportType]: undefined;
  [ModalsEnum.ImportAccountFromSeedPhrase]: undefined;
  [ModalsEnum.ImportAccountFromPrivateKey]: undefined;
  [ModalsEnum.ImportAccountFromKeystoreFile]: undefined;
  [ModalsEnum.KoloCard]: undefined;
  [ModalsEnum.ShieldedAnnouncement]: undefined;
  [ModalsEnum.Rebalance]: undefined;
};

type ModalParamsPart<T extends ModalsEnum> = undefined extends ModalsParamList[T]
  ? { screen: T; params?: ModalsParamList[T] }
  : { screen: T; params: ModalsParamList[T] };

export type ModalParams =
  | ModalParamsPart<ModalsEnum.Receive>
  | ModalParamsPart<ModalsEnum.Send>
  | ModalParamsPart<ModalsEnum.AddAsset>
  | ModalParamsPart<ModalsEnum.RenameAccount>
  | ModalParamsPart<ModalsEnum.SelectBaker>
  | ModalParamsPart<ModalsEnum.Confirmation>
  | ModalParamsPart<ModalsEnum.RevealSeedPhrase>
  | ModalParamsPart<ModalsEnum.RevealPrivateKey>
  | ModalParamsPart<ModalsEnum.EnableBiometryPassword>
  | ModalParamsPart<ModalsEnum.CollectibleModal>
  | ModalParamsPart<ModalsEnum.AddCustomRpc>
  | ModalParamsPart<ModalsEnum.EditCustomRpc>
  | ModalParamsPart<ModalsEnum.AddContact>
  | ModalParamsPart<ModalsEnum.EditContact>
  | ModalParamsPart<ModalsEnum.ManageFarmingPool>
  | ModalParamsPart<ModalsEnum.ManageSavingsPool>
  | ModalParamsPart<ModalsEnum.Newsletter>
  | ModalParamsPart<ModalsEnum.InAppBrowser>
  | ModalParamsPart<ModalsEnum.ChooseWalletImportType>
  | ModalParamsPart<ModalsEnum.ImportWalletFromSeedPhrase>
  | ModalParamsPart<ModalsEnum.SyncInstructions>
  | ModalParamsPart<ModalsEnum.ConfirmSync>
  | ModalParamsPart<ModalsEnum.ChooseAccountImportType>
  | ModalParamsPart<ModalsEnum.ImportAccountFromSeedPhrase>
  | ModalParamsPart<ModalsEnum.ImportAccountFromPrivateKey>
  | ModalParamsPart<ModalsEnum.ImportAccountFromKeystoreFile>
  | ModalParamsPart<ModalsEnum.KoloCard>
  | ModalParamsPart<ModalsEnum.ShieldedAnnouncement>
  | ModalParamsPart<ModalsEnum.Rebalance>;
