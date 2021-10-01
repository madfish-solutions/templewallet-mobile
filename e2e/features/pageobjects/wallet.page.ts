import { TokenListSelectors } from '../../../src/screens/wallet/token-list/token-list.selectors';
import { Page } from './page';

export class WalletPage extends Page {
  tokenList = browser.$(`~${TokenListSelectors.TokenList}`);

  async isVisible() {
    await this.tokenList.waitForDisplayed();
  }
}
