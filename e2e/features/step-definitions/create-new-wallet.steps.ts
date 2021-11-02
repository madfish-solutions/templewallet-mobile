import { Given } from '@wdio/cucumber-framework';

import { Pages } from './pages';

const { welcome, createNewWallet, verifyYourSeed } = Pages;

let seedPhrase = '';

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

Given(/^I save seed phrase$/, async () => {
  seedPhrase = await createNewWallet.seedPhraseOut.getValue();
});

Given(/^I enter correct seed words$/, async () => {
  const confirmationTitles = await verifyYourSeed.getConfirmationTitles();
  const confirmationInputs = await verifyYourSeed.getConfirmationInputs();

  const seedPhraseWords = seedPhrase.split(' ');

  for (let i = 0; i < confirmationTitles.length; i++) {
    const title = confirmationTitles[i];
    const input = confirmationInputs[i];

    const titleText = await title.getValue();

    const [, wordNumber] = titleText.split(' ');
    const wordIndex = +wordNumber - 1;
    const confirmationWord = seedPhraseWords[wordIndex];

    await input.setValue(confirmationWord);
  }
});
