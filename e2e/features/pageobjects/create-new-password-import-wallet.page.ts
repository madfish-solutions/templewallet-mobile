import { CreateNewPasswordSelectors } from '../../../src/screens/import-account/create-new-password/create-new-password.selectors';
import { findElement } from '../../utils/search.utils';
import { Page } from './page';

export class CreateNewPasswordImportAccountPage extends Page {
  passwordInputImportAccount = findElement(CreateNewPasswordSelectors.PasswordInput);
  repeatPasswordInputImportAccount = findElement(CreateNewPasswordSelectors.RepeatPasswordInput);
  acceptTermsCheckboxImportAccount = findElement(CreateNewPasswordSelectors.AcceptTermsCheckbox);
  importButtonImportAccount = findElement(CreateNewPasswordSelectors.ImportButton);

  async isVisible() {
    await this.passwordInputImportAccount.waitForDisplayed();
    await this.repeatPasswordInputImportAccount.waitForDisplayed();
    await this.acceptTermsCheckboxImportAccount.waitForDisplayed();
    await this.importButtonImportAccount.waitForDisplayed();
  }
}
