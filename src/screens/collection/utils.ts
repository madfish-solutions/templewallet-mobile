import { openUrl } from 'src/utils/linking';

export const ITEM_WIDTH = 327;
export const GAP_SIZE = 8;
export const BORDER_RADIUS = 10;

export const navigateToObjktForBuy = (contract: string, id: string) =>
  openUrl(`https://objkt.com/asset/${contract}/${id}`);
