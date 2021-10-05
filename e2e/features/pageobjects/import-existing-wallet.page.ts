import { ImportWalletFromSeedPhraseSelectors } from '../../../src/screens/import-account/import-wallet/import-wallet-from-seed-phrase/import-wallet-from-seed-phrase.selectors';
import { findElement } from '../../utils/search.utils';
import { Page } from './page';

export class ImportExistingWalletPage extends Page {
  seedPhraseInput = findElement(ImportWalletFromSeedPhraseSelectors.SeedPhraseInput);
  nextButton = findElement(ImportWalletFromSeedPhraseSelectors.NextButton);

  async isVisible() {
    await this.seedPhraseInput.waitForDisplayed();
    await this.nextButton.waitForDisplayed();
  }
}
