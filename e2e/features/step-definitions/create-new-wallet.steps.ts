import { Given } from '@wdio/cucumber-framework';

import { Pages } from './pages';

const { welcome, createNewWallet } = Pages;
let seed = '';

Given(/^I press CREATE NEW WALLET button$/, async () => {
  await welcome.createNewWalletButton.click();
});

Given(/^I press GEN NEW button in SEED PHRASE output$/, async () => {
  await createNewWallet.genNewSeedButton.click();
});

Given(/^I press MADE SEED PHRASE BACKUP checkbox$/, async () => {
  await createNewWallet.madeSeedPhraseBackupCheckbox.click();
});

Given(/^I press COPY button in SEED PHRASE output$/, async () => {
  await createNewWallet.copySeedButton.click();
});

Given(/^I save seed$/, async () => {
  seed = await createNewWallet.seedPhraseOut.getValue();
  const words = seed.split(' ');
  console.log(seed);
  console.log(words[3]);
});

Given(/^I am confirming seed phrase$/, async () => {
  const position = ;
});
