import { TokenListSelectors } from '../../../src/screens/wallet/token-list/token-list.selectors';
import { findElement } from '../../utils/search.utils';
import { Page } from './page';

export class WalletPage extends Page {
  tokenList = findElement(TokenListSelectors.tokenList);

  async isVisible() {
    await this.tokenList.waitForDisplayed();
  }
}
