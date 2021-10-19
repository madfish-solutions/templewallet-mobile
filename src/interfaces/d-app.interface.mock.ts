import { CustomDAppInfo } from './dapps.interface';

export const mockDApp: CustomDAppInfo = {
  name: 'Plenty DeFi',
  short_description: 'Sustainable yield farming',
  full_description:
    'Plenty is a decentralized yield farm. The primary goal of Plenty is to bring more liquidity into the Tezos ecosytem. Plenty is incentivizing liquidity providers of other blockchains to bridge their assets to Tezos.',
  website: 'https://www.plentydefi.com/',
  slug: 'plenty',
  authors: ['Tezsure', 'DGH'],
  social_links: [
    'https://twitter.com/plentydefi',
    'https://t.me/PlentyDeFi',
    'https://medium.com/plenty-defi',
    'https://discord.gg/Ph9GWPNRbv',
    'https://github.com/orgs/Plenty-DeFi/'
  ],
  interfaces: ['TZIP-7', 'TZIP-16'],
  categories: ['Farming'],
  soon: false,
  logo: 'https://bcd-static-assets.s3.eu-central-1.amazonaws.com/dapps/plenty/plenty_logo.png',
  cover: 'https://bcd-static-assets.s3.eu-central-1.amazonaws.com/dapps/plenty/plenty_cover.png',
  tvl: '52403206'
};
