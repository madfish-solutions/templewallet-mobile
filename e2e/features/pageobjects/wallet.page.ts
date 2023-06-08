import { WalletSelectors } from '../../../src/screens/wallet/wallet.selectors';
import { findElement } from '../../utils/search.utils';
import { Page } from './page';

export class WalletPage extends Page {
  tokenList = findElement(WalletSelectors.tokenList);

  async isVisible() {
    await this.tokenList.waitForDisplayed();
  }
}
