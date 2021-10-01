import { WelcomeSelectors } from '../../../src/screens/welcome/welcome.selectors';
import { Page } from './page';

export class WelcomePage extends Page {
  createNewWalletButton = browser.$(`~${WelcomeSelectors.CreateNewWalletButton}`);
  importExistingWalletButton = browser.$(`~${WelcomeSelectors.ImportExistingWalletButton}`);

  async isVisible() {
    await this.createNewWalletButton.waitForDisplayed();
    await this.importExistingWalletButton.waitForDisplayed();
  }
}
