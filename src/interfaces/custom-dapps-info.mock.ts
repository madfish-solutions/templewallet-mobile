import { CustomDAppInfo, DappEnum } from './custom-dapps-info.interface';

export const mockDApp: CustomDAppInfo = {
  name: 'QuipuSwap',
  dappUrl: 'https://quipuswap.com',
  type: DappEnum.DeFi,
  logo: 'https://bcd-static-assets.fra1.digitaloceanspaces.com/dapps/quipuswap/quipuswap_logo.jpg',
  slug: 'quipuswap',
  categories: [DappEnum.DeFi]
};
