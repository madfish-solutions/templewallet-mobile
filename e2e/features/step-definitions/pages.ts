import { CreateNewPasswordPage } from '../pageobjects/create-new-password.page';
import { CreateNewWalletPage } from '../pageobjects/create-new-wallet.page';
import { ImportExistingWalletPage } from '../pageobjects/import-existing-wallet.page';
import { WalletPage } from '../pageobjects/wallet.page';
import { WelcomePage } from '../pageobjects/welcome.page';

export const Pages = {
  welcome: new WelcomePage(),
  importExistingWallet: new ImportExistingWalletPage(),
  createNewPassword: new CreateNewPasswordPage(),
  wallet: new WalletPage(),
  createNewWallet: new CreateNewWalletPage()
};
