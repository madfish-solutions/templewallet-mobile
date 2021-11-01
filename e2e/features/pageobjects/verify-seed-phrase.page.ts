import { SeedPhraseWordInputSelectors } from '../../../src/components/seed-phrase-word-input/seed-phrase-word-input.selectors';
import { VerifySeedPhraseSelectors } from '../../../src/screens/create-account/verify-seed-phrase/verify-seed-phrase.selectors';
import { findElement } from '../../utils/search.utils';
import { Page } from './page';

export class VerifySeedPhrasePage extends Page {
  nextButton = findElement(VerifySeedPhraseSelectors.NextButton);
  firstConfirmationTitle = findElement(SeedPhraseWordInputSelectors.Title);
  secondConfirmationTitle = findElement(SeedPhraseWordInputSelectors.Title);

  async isVisible() {
    await this.nextButton.waitForDisplayed();
  }
}
