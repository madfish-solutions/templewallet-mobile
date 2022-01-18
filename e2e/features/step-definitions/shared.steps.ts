import { Given } from '@wdio/cucumber-framework';

import { getInputText } from '../../utils/input.utils';
import { findElement } from '../../utils/search.utils';
import { Pages } from './steps-data';

const { createNewWallet, verifyYourSeed } = Pages;

let temporarySeedPhrase = '';

Given(/^I save seed phrase$/, async () => {
  temporarySeedPhrase = await createNewWallet.seedPhraseOut.getValue();
});

Given(/^I enter correct seed words$/, async () => {
  const confirmationTitles = await verifyYourSeed.getConfirmationTitles();
  const confirmationInputs = await verifyYourSeed.getConfirmationInputs();

  const seedPhraseWords = temporarySeedPhrase.split(' ');

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

Given(/^I am on the (\w+) page$/, async (page: keyof typeof Pages) => {
  await Pages[page].isVisible();
});

Given(/I press (.*)/, async (buttonSelector: string) => {
  await findElement(buttonSelector).click();
});

Given(/I enter "(.*)" into (.*)/, async (inputText: string, buttonSelector: string) => {
  await findElement(buttonSelector).setValue(inputText);
});

Given(/I enter (seed|password) into (.*)/, async (inputType: string, buttonSelector: string) => {
  const inputText = getInputText(inputType, temporarySeedPhrase);

  await findElement(buttonSelector).setValue(inputText);
});
