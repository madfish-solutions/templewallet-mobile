import { SeedPhraseWordInputSelectors } from '../../../src/components/seed-phrase-word-input/seed-phrase-word-input.selectors';
import { VerifySeedPhraseSelectors } from '../../../src/screens/manual-backup/verify-seed-phrase/verify-seed-phrase.selectors';
import { findElement, findElements } from '../../utils/search.utils';
import { Page } from './page';

export class VerifySeedPhrasePage extends Page {
  verifyYourSeedNextButton = findElement(VerifySeedPhraseSelectors.nextButton);

  getConfirmationTitles = () => findElements(SeedPhraseWordInputSelectors.wordTitle);
  getConfirmationInputs = () => findElements(SeedPhraseWordInputSelectors.wordInput);

  async isVisible() {
    await this.verifyYourSeedNextButton.waitForDisplayed();
  }
}
