import { ImportWalletFromSeedPhraseSelectors } from '../../../src/screens/import-account/import-wallet/import-wallet-from-seed-phrase/import-wallet-from-seed-phrase.selectors';
import { Page } from './page';

export class ImportExistingWalletPage extends Page {
  seedPhraseInput = browser.$(`~${ImportWalletFromSeedPhraseSelectors.SeedPhraseInput}`);
  nextButton = browser.$(`~${ImportWalletFromSeedPhraseSelectors.NextButton}`);

  async isVisible() {
    await this.seedPhraseInput.waitForDisplayed();
    await this.nextButton.waitForDisplayed();
  }
}
