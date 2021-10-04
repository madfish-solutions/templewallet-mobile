import { CreateNewPasswordSelectors } from '../../../src/screens/import-account/create-new-password/create-new-password.selectors';
import { findElement } from '../../utils/search.utils';
import { Page } from './page';

export class CreateNewPasswordPage extends Page {
  passwordInput = findElement(CreateNewPasswordSelectors.PasswordInput);
  repeatPasswordInput = findElement(CreateNewPasswordSelectors.RepeatPasswordInput);
  acceptTermsCheckbox = findElement(CreateNewPasswordSelectors.AcceptTermsCheckbox);
  importButton = findElement(CreateNewPasswordSelectors.ImportButton);

  async isVisible() {
    await this.passwordInput.waitForDisplayed();
    await this.repeatPasswordInput.waitForDisplayed();
    await this.acceptTermsCheckbox.waitForDisplayed();
    await this.importButton.waitForDisplayed();
  }
}
