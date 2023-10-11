import { openUrl } from 'src/utils/linking';

export const navigateToObjktForBuy = (contract: string, id: string) =>
  openUrl(`https://objkt.com/asset/${contract}/${id}`);
