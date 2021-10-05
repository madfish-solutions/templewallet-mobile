import { Given } from '@wdio/cucumber-framework';

import { getEnv } from '../../utils/env.utils';
import { CreateNewPasswordPage } from '../pageobjects/create-new-password.page';
import { ImportExistingWalletPage } from '../pageobjects/import-existing-wallet.page';
import { WalletPage } from '../pageobjects/wallet.page';
import { WelcomePage } from '../pageobjects/welcome.page';

const seedPhrase = getEnv('E2E_SEED_PHRASE');
const appPassword = getEnv('E2E_APP_PASSWORD');

const pages = {
  welcome: new WelcomePage(),
  importExistingWallet: new ImportExistingWalletPage(),
  createNewPassword: new CreateNewPasswordPage(),
  wallet: new WalletPage()
};

Given(/^I am on the (\w+) page$/, async (page: keyof typeof pages) => {
  await pages[page].isVisible();
});

Given(/^I press IMPORT EXISTING WALLET button$/, async () => {
  await pages.welcome.importExistingWalletButton.click();
});

Given(/^I type SEED PHRASE into SEED PHRASE input$/, async () => {
  await pages.importExistingWallet.seedPhraseInput.setValue(seedPhrase);
});

Given(/^I press NEXT button$/, async () => {
  await pages.importExistingWallet.nextButton.click();
});

Given(/^I type PASSWORD into PASSWORD input$/, async () => {
  await pages.createNewPassword.passwordInput.setValue(appPassword);
});

Given(/^I type PASSWORD into REPEAT PASSWORD input$/, async () => {
  await pages.createNewPassword.repeatPasswordInput.setValue(appPassword);
});

Given(/^I press ACCEPT TERMS checkbox$/, async () => {
  await pages.createNewPassword.acceptTermsCheckbox.click();
});

Given(/^I press IMPORT button$/, async () => {
  await pages.createNewPassword.importButton.click();
});
