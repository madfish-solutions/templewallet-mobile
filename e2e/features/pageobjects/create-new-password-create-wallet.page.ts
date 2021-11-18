import { CreateNewPasswordCreateAccountSelectors } from '../../../src/screens/create-account/create-new-password/create-new-password.selectors';
import { findElement } from '../../utils/search.utils';
import { Page } from './page';

export class CreateNewPasswordCreateAccountPage extends Page {
  passwordInputCreateAccount = findElement(CreateNewPasswordCreateAccountSelectors.PasswordInput);
  repeatPasswordInputCreateAccount = findElement(CreateNewPasswordCreateAccountSelectors.RepeatPasswordInput);
  acceptTermsCheckboxCreateAccount = findElement(CreateNewPasswordCreateAccountSelectors.AcceptTermsCheckbox);
  createButtonCreateAccount = findElement(CreateNewPasswordCreateAccountSelectors.CreateButton);

  async isVisible() {
    await this.passwordInputCreateAccount.waitForDisplayed();
    await this.repeatPasswordInputCreateAccount.waitForDisplayed();
    await this.acceptTermsCheckboxCreateAccount.waitForDisplayed();
    await this.createButtonCreateAccount.waitForDisplayed();
  }
}
