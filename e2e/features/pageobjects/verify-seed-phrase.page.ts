import { SeedPhraseWordInputSelectors } from '../../../src/components/seed-phrase-word-input/seed-phrase-word-input.selectors';
import { VerifySeedPhraseSelectors } from '../../../src/screens/manual-backup/verify-seed-phrase/verify-seed-phrase.selectors';
import { findElement, findElements } from '../../utils/search.utils';
import { Page } from './page';

export class VerifySeedPhrasePage extends Page {
  verifyYourSeedNextButton = findElement(VerifySeedPhraseSelectors.NextButton);

  getConfirmationTitles = () => findElements(SeedPhraseWordInputSelectors.Title);
  getConfirmationInputs = () => findElements(SeedPhraseWordInputSelectors.Input);

  async isVisible() {
    await this.verifyYourSeedNextButton.waitForDisplayed();
  }
}
