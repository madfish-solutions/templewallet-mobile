import { WelcomeSelectors } from '../../../src/screens/welcome/welcome.selectors';
import { findElement } from '../../utils/search.utils';
import { Page } from './page';

export class WelcomePage extends Page {
  createNewWalletButton = findElement(WelcomeSelectors.createNewWalletButton);
  importExistingWalletButton = findElement(WelcomeSelectors.importExistingWalletButton);

  async isVisible() {
    await this.createNewWalletButton.waitForDisplayed();
    await this.importExistingWalletButton.waitForDisplayed();
  }
}
