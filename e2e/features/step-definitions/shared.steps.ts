import { Given, Before } from '@wdio/cucumber-framework';
import { useDispatch } from 'react-redux';

import { ScreensEnum } from '../../../src/navigator/enums/screens.enum';
import { useNavigation } from '../../../src/navigator/hooks/use-navigation.hook';
import { useAppLock } from '../../../src/shelter/use-app-lock.hook';
import { useShelter } from '../../../src/shelter/use-shelter.hook';
import { rootStateResetAction } from '../../../src/store/root-state.actions';
import { getInputText } from '../../utils/input.utils';
import { findElement } from '../../utils/search.utils';
import { Pages } from './steps-data';

const { createNewWallet, verifyYourSeed } = Pages;

const Accounts = {
  testAccount: {
    pk: '1',
    pkh: '2',
    sk: '3'
  }
};

let temporarySeedPhrase = '';

Before(scenario => {
  // @ts-ignore
  this.put = scenario.gherkinDocument.feature;

  // @ts-ignore
  this.myContext = {
    fileName: null,
    fileContent: null
  };
});

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
  // @ts-ignore
  console.log(`context is: ${this.put}`);
  await Pages[page].isVisible();
});

Given(/^I have (\w+) account$/, async (account: keyof typeof Accounts) => {
  const dispatch = useDispatch();
  dispatch(rootStateResetAction.submit());
  console.log(`context is: ${account}`);
  const { importWallet } = useShelter();
  importWallet({
    password: getInputText('password'),
    seedPhrase: getInputText('seed')
  });
  const { unlock } = useAppLock();
  unlock(getInputText('password'));
  const { navigate } = useNavigation();
  navigate(ScreensEnum.Wallet);
  // unlock(getInputText('password'));
  // await Pages[page].isVisible();
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
