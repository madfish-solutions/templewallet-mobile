import { CreateNewPasswordImportAccountPage } from '../pageobjects/create-new-password-import-wallet.page';
import { CreateNewWalletPage } from '../pageobjects/create-new-wallet.page';
import { ImportExistingWalletPage } from '../pageobjects/import-existing-wallet.page';
import { VerifySeedPhrasePage } from '../pageobjects/verify-seed-phrase.page';
import { WalletPage } from '../pageobjects/wallet.page';
import { WelcomePage } from '../pageobjects/welcome.page';

export const Pages = {
  welcome: new WelcomePage(),
  importExistingWallet: new ImportExistingWalletPage(),
  createNewPasswordImportAccount: new CreateNewPasswordImportAccountPage(),
  createNewWallet: new CreateNewWalletPage(),
  wallet: new WalletPage(),
  verifyYourSeed: new VerifySeedPhrasePage()
};
