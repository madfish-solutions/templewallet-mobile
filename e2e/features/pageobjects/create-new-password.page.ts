import { CreateNewPasswordSelectors } from '../../../src/screens/import-account/create-new-password/create-new-password.selectors';
import { Page } from './page';

export class CreateNewPasswordPage extends Page {
  passwordInput = browser.$(`~${CreateNewPasswordSelectors.PasswordInput}`);
  repeatPasswordInput = browser.$(`~${CreateNewPasswordSelectors.RepeatPasswordInput}`);
  acceptTermsCheckbox = browser.$(`~${CreateNewPasswordSelectors.AcceptTermsCheckbox}`);
  importButton = browser.$(`~${CreateNewPasswordSelectors.ImportButton}`);

  async isVisible() {
    await this.passwordInput.waitForDisplayed();
    await this.repeatPasswordInput.waitForDisplayed();
    await this.acceptTermsCheckbox.waitForDisplayed();
    await this.importButton.waitForDisplayed();
  }
}
