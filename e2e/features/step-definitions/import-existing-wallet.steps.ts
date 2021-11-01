import { Given } from '@wdio/cucumber-framework';

import { getEnv } from '../../utils/env.utils';
import { Pages } from './pages';

const seedPhrase = getEnv('E2E_SEED_PHRASE');
const appPassword = getEnv('E2E_APP_PASSWORD');

const { welcome, importExistingWallet, createNewPassword } = Pages;

Given(/^I am on the (\w+) page$/, async (page: keyof typeof Pages) => {
  await Pages[page].isVisible();
});

Given(/^I press IMPORT EXISTING WALLET button$/, async () => {
  await welcome.importExistingWalletButton.click();
});

Given(/^I type SEED PHRASE into SEED PHRASE input$/, async () => {
  await importExistingWallet.seedPhraseInput.setValue(seedPhrase);
});

Given(/^I press NEXT button$/, async () => {
  await importExistingWallet.nextButton.click();
});

Given(/^I type PASSWORD into PASSWORD input$/, async () => {
  await createNewPassword.passwordInput.setValue(appPassword);
});

Given(/^I type PASSWORD into REPEAT PASSWORD input$/, async () => {
  await createNewPassword.repeatPasswordInput.setValue(appPassword);
});

Given(/^I press ACCEPT TERMS checkbox$/, async () => {
  await createNewPassword.acceptTermsCheckbox.click();
});

Given(/^I press IMPORT button$/, async () => {
  await createNewPassword.importButton.click();
});
