import { CreateNewWalletSelectors } from '../../../src/screens/create-new-wallet/create-new-wallet.selectors';
import { findElement } from '../../utils/search.utils';
import { Page } from './page';

export class CreateNewWalletPage extends Page {
  passwordInput = findElement(CreateNewWalletSelectors.PasswordInput);
  repeatPasswordInput = findElement(CreateNewWalletSelectors.RepeatPasswordInput);
  acceptTermsCheckbox = findElement(CreateNewWalletSelectors.AcceptTermsCheckbox);
  createButton = findElement(CreateNewWalletSelectors.CreateButton);

  async isVisible() {
    await this.passwordInput.waitForDisplayed();
    await this.repeatPasswordInput.waitForDisplayed();
    await this.acceptTermsCheckbox.waitForDisplayed();
    await this.createButton.waitForDisplayed();
  }
}
