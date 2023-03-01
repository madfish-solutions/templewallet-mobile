import { CreateNewPasswordSelectors } from '../../../src/screens/import-account/create-new-password/create-new-password.selectors';
import { findElement } from '../../utils/search.utils';
import { Page } from './page';

export class CreateNewPasswordImportAccountPage extends Page {
  passwordInputImportAccount = findElement(CreateNewPasswordSelectors.passwordInput);
  repeatPasswordInputImportAccount = findElement(CreateNewPasswordSelectors.repeatPasswordInput);
  acceptTermsCheckboxImportAccount = findElement(CreateNewPasswordSelectors.acceptTermsCheckbox);
  importButtonImportAccount = findElement(CreateNewPasswordSelectors.createButton);

  async isVisible() {
    await this.passwordInputImportAccount.waitForDisplayed();
    await this.repeatPasswordInputImportAccount.waitForDisplayed();
    await this.acceptTermsCheckboxImportAccount.waitForDisplayed();
    await this.importButtonImportAccount.waitForDisplayed();
  }
}
