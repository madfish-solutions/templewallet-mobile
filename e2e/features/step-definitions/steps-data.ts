import { CreateNewPasswordCreateAccountPage } from '../pageobjects/create-new-password-create-wallet.page';
import { CreateNewPasswordImportAccountPage } from '../pageobjects/create-new-password-import-wallet.page';
import { CreateNewWalletPage } from '../pageobjects/create-new-wallet.page';
import { ImportExistingWalletPage } from '../pageobjects/import-existing-wallet.page';
import { VerifyYourSeedPage } from '../pageobjects/verify-your-seed.page';
import { WalletPage } from '../pageobjects/wallet.page';
import { WelcomePage } from '../pageobjects/welcome.page';

export const Pages = {
  welcome: new WelcomePage(),
  importExistingWallet: new ImportExistingWalletPage(),
  createNewPasswordImportAccount: new CreateNewPasswordImportAccountPage(),
  createNewPasswordCreateAccount: new CreateNewPasswordCreateAccountPage(),
  wallet: new WalletPage(),
  createNewWallet: new CreateNewWalletPage(),
  verifyYourSeed: new VerifyYourSeedPage()
};
