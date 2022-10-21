import { SeedPhraseWordInputSelectors } from '../../../src/components/seed-phrase-word-input/seed-phrase-word-input.selectors';
import { findElements } from '../../utils/search.utils';
import { Page } from './page';

export class VerifyYourSeedPage extends Page {
  getConfirmationTitles = () => findElements(SeedPhraseWordInputSelectors.Title);
  getConfirmationInputs = () => findElements(SeedPhraseWordInputSelectors.Input);

  isVisible = () => true;
}
