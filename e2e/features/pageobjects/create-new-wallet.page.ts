import { MnemonicCreateSelectors } from '../../../src/components/mnemonic/mnemonic-create/mnemonic-create.selectors';
import { findElement } from '../../utils/search.utils';
import { Page } from './page';

export class CreateNewWalletPage extends Page {
  copySeedButton = findElement(MnemonicCreateSelectors.CopyButton);

  isVisible = () => true;
}
