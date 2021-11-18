import { CreateNewWalletSelectors } from '../../../src/screens/create-account/create-new-wallet/create-new-wallet.selectors';
import { findElement } from '../../utils/search.utils';
import { Page } from './page';

export class CreateNewWalletPage extends Page {
  seedPhraseOut = findElement(CreateNewWalletSelectors.SeedPhraseOut);
  genNewSeedButton = findElement(CreateNewWalletSelectors.GenNewSeedButton);
  madeSeedPhraseBackupCheckbox = findElement(CreateNewWalletSelectors.MadeSeedPhraseBackupCheckbox);
  createANewWalletNextButton = findElement(CreateNewWalletSelectors.NextButton);
  copySeedButton = findElement(CreateNewWalletSelectors.CopyButton);

  async isVisible() {
    await this.seedPhraseOut.waitForExist();
    await this.genNewSeedButton.waitForDisplayed();
    await this.madeSeedPhraseBackupCheckbox.waitForDisplayed();
    await this.createANewWalletNextButton.waitForDisplayed();
  }
}
