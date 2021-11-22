import { MnemonicCreateSelectors } from '../../../src/components/mnemonic/mnemonic-create/mnemonic-create.selectors';
import { CreateNewWalletSelectors } from '../../../src/screens/create-account/create-new-wallet/create-new-wallet.selectors';
import { findElement } from '../../utils/search.utils';
import { Page } from './page';

export class CreateNewWalletPage extends Page {
  seedPhraseOut = findElement(CreateNewWalletSelectors.SeedPhraseOut);
  genNewSeedButton = findElement(MnemonicCreateSelectors.GenNewSeedButton);
  madeSeedPhraseBackupCheckbox = findElement(CreateNewWalletSelectors.MadeSeedPhraseBackupCheckbox);
  createANewWalletNextButton = findElement(CreateNewWalletSelectors.NextButton);
  copySeedButton = findElement(MnemonicCreateSelectors.CopyButton);

  async isVisible() {
    await this.seedPhraseOut.waitForExist();
    await this.genNewSeedButton.waitForDisplayed();
    await this.madeSeedPhraseBackupCheckbox.waitForDisplayed();
    await this.createANewWalletNextButton.waitForDisplayed();
  }
}
