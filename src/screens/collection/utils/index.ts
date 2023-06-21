import { openUrl } from 'src/utils/linking.util';

export const navigateToObjktForBuy = (contract: string, id: number) =>
  openUrl(`https://objkt.com/asset/${contract}/${id}`);
