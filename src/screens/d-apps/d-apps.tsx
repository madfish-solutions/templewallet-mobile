import React, { useState } from 'react';
import { View, Text, FlatList } from 'react-native';

import { Divider } from '../../components/divider/divider';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { SearchInput } from '../../components/search-input/search-input';
import { formatSize } from '../../styles/format-size';
import { useDAppsStyles } from './d-apps.styles';
import { IntegratedDApp } from './integrated/integrated';
import { OthersDApp } from './others/others';

const data = [
  {
    name: 'Hic et nunc',
    short_description: 'NFT marketplace',
    full_description:
      'The H=N platform combines the cost-effective utility working artists need and the eco-friendly characteristics they care about.',
    website: 'https://www.hicetnunc.xyz/',
    slug: 'hen',
    authors: [],
    social_links: ['https://twitter.com/hicetnunc2000', 'https://github.com/hicetnunc2000'],
    interfaces: ['FA2'],
    categories: ['NFT', 'Token'],
    soon: false,
    logo: 'https://bcd-static-assets.s3.eu-central-1.amazonaws.com/dapps/hen/hen_logo.jpg',
    cover: 'https://bcd-static-assets.s3.eu-central-1.amazonaws.com/dapps/hen/hen_cover.jpg',
    tvl: '9666231.56'
  },
  {
    name: 'objkt.com',
    short_description: 'The largest NFT marketplace on Tezos.',
    full_description:
      'objkt.com is the first FA2 marketplace that aggregates tokens across contracts and provides a cohesive user interface to interact with and trade multimedia NFTs.',
    website: 'https://objkt.com',
    slug: 'objkt',
    authors: ['objkt.com'],
    social_links: ['https://twitter.com/objktcom'],
    interfaces: null,
    categories: ['NFT', 'Marketplace'],
    soon: false,
    logo: 'https://bcd-static-assets.s3.eu-central-1.amazonaws.com/dapps/objkt/objkt_logo.png',
    cover: 'https://bcd-static-assets.s3.eu-central-1.amazonaws.com/dapps/objkt/objkt_cover.png',
    screenshots: [
      {
        type: 'desktop',
        link: 'https://bcd-static-assets.s3.eu-central-1.amazonaws.com/dapps/objkt/objkt_screen_1.png'
      },
      {
        type: 'desktop',
        link: 'https://bcd-static-assets.s3.eu-central-1.amazonaws.com/dapps/objkt/objkt_screen_2.png'
      },
      {
        type: 'desktop',
        link: 'https://bcd-static-assets.s3.eu-central-1.amazonaws.com/dapps/objkt/objkt_screen_3.png'
      }
    ],
    tvl: '68026.49'
  },
  {
    name: 'QuipuSwap',
    short_description: 'A decentralized exchange on Tezos',
    full_description:
      'QuipuSwap is an open-source protocol that provides an interface for the seamless decentralized exchange of Tezos-based Tokens and XTZ. Using the advantages of Tezos protocol such as liquid XTZ delegation, liquidity providers earn both from swap fees and bakers rewards.',
    website: 'https://quipuswap.com/',
    slug: 'quipuswap',
    authors: ['Madfish Solutions'],
    social_links: [
      'https://twitter.com/madfishofficial',
      'https://www.reddit.com/r/MadFishCommunity',
      'https://t.me/MadFishCommunity',
      'https://discord.com/invite/qFRZ8kVzkv'
    ],
    interfaces: ['FA1.2', 'FA2'],
    categories: ['DEX'],
    soon: false,
    logo: 'https://bcd-static-assets.s3.eu-central-1.amazonaws.com/dapps/quipuswap/quipuswap_logo.jpg',
    cover: 'https://bcd-static-assets.s3.eu-central-1.amazonaws.com/dapps/quipuswap/quipuswap_cover.png',
    tvl: '30171599.12'
  },
  {
    name: 'Pixel Potus',
    short_description: 'Digital collectable competition',
    full_description:
      'We hold these truths to be self-evident, that all NFTs are NOT created equal, that some are endowed by their Creator with certain unalienable rights, that among these are Life, Liberty and the pursuit of Pixelation.',
    website: 'https://www.pixelpotus.com/',
    slug: 'pixelpotus',
    authors: [],
    social_links: [
      'https://twitter.com/PixelPotus',
      'https://t.me/joinchat/YTjc8t6oiahkMzMx',
      'https://discord.gg/CbdbvwtwkM'
    ],
    interfaces: ['TZIP-12'],
    categories: ['NFT'],
    soon: false,
    logo: 'https://bcd-static-assets.s3.eu-central-1.amazonaws.com/dapps/pixelpotus/pixelpotus_logo.png',
    cover: 'https://bcd-static-assets.s3.eu-central-1.amazonaws.com/dapps/pixelpotus/pixelpotus_cover.jpg',
    tvl: '0'
  },
  {
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
  },
  {
    name: 'WRAP Protocol',
    short_description: 'Decentralized bridge between Ethereum and Tezos',
    full_description:
      'Through Wrap, users issue wTokens (wrapped tokens) which are representations of ERC20 and ERC721 tokens on the Tezos blockchain. wTokens can then be used on the Tezos blockchain, and their value is pegged to the original tokens. Wrap is a decentralized protocol, relying on a strong federation (the Signers Quorum) that guarantees the stability of the protocol, and a community of WRAP governance token holders.',
    website: 'https://www.benderlabs.io/wrap',
    slug: 'tzwrap',
    authors: ['Bender Labs'],
    social_links: ['https://twitter.com/BenderLabs', 'https://t.me/benderlabs', 'https://github.com/bender-labs'],
    interfaces: ['FA2'],
    categories: ['Token', 'Wrapped'],
    soon: false,
    logo: 'https://bcd-static-assets.s3.eu-central-1.amazonaws.com/dapps/tzwrap/tzwrap_logo.png',
    cover: 'https://bcd-static-assets.s3.eu-central-1.amazonaws.com/dapps/tzwrap/tzwrap_cover.png',
    tvl: '24300917.71'
  },
  {
    name: 'Kalamint',
    short_description: 'NFT marketplace focused on the future',
    full_description:
      'We are an NFT marketplace focused on moving into the future of NFTs and staying true to blockchain technology. We are building our platform around the artist and not the other way around and are building strategic partnerships to help us achieve these goals. Kalamint hopes to be the bridge between other platforms, different mediums, and the real world and make NFTs so readily available that they become main stream without people knowing.',
    website: 'https://www.kalamint.io',
    slug: 'kalamint',
    authors: ['21 Chain Labs Limited'],
    social_links: [
      'https://t.me/kalamint',
      'https://www.instagram.com/kalamint_io/',
      'https://twitter.com/kalamint_io',
      'https://www.youtube.com/channel/UCqqC7-KBJiAFfwECX2ZXAHA'
    ],
    interfaces: ['TZIP-12'],
    categories: ['NFT', 'Marketplace'],
    soon: false,
    logo: 'https://bcd-static-assets.s3.eu-central-1.amazonaws.com/dapps/kalamint/kalamint_logo.png',
    cover: 'https://bcd-static-assets.s3.eu-central-1.amazonaws.com/dapps/kalamint/kalamint_cover.jpg',
    screenshots: [
      {
        type: 'desktop',
        link: 'https://bcd-static-assets.s3.eu-central-1.amazonaws.com/dapps/kalamint/kalamint_desktop.png'
      }
    ],
    tvl: '0'
  },
  {
    name: 'Tezos Domains',
    short_description: 'Friendly names on Tezos blockchain',
    full_description:
      "Tezos Domains is a distributed, open and extensible naming system using the Tezos blockchain. The main function is to translate a meaningful and user-friendly alias to it's corresponding Tezos address and vice versa. This translation is globally consistent so that all users see the same address for a given alias. Domains can be used to associate an address, share an avatar, publish contact information and more. Wallets and other projects in the ecosystem will let you use domain names directly instead of addresses and show domain names where Tezos addresses would be normally. The long term plan for Tezos Domains includes allowing websites to be built on Tezos Domains using decentralized content hosting like IPFS. This could serve as an alternative to traditional centralized solutions (i.e. DNS with centralized content hosting).",
    website: 'https://tezos.domains/',
    slug: 'tezosdomains',
    authors: ['Agile Ventures'],
    social_links: ['https://t.me/tezosdomains', 'https://twitter.com/tezosdomains', 'https://gitlab.com/tezos-domains'],
    interfaces: ['TZIP-12'],
    categories: ['NFT'],
    soon: false,
    logo: 'https://bcd-static-assets.s3.eu-central-1.amazonaws.com/dapps/tezosdomains/tezosdomains_logo.png',
    cover: 'https://bcd-static-assets.s3.eu-central-1.amazonaws.com/dapps/tezosdomains/tezosdomains_cover.png',
    tvl: '52184.47'
  },
  {
    name: 'Crunchy network',
    short_description: 'DeFi-as-a-Service',
    full_description:
      'Crunchy provides DeFi services and solutions on Tezos to projects, developers, and end users. We like to think of ourselves as a DeFi-as-a-Service (DaaS) platform. Crunchy is maintained by independent developers and is governed by CrDAO holders.',
    website: 'https://app.crunchy.network/',
    slug: 'crunchy',
    authors: [],
    social_links: [
      'https://t.me/crunchy_network',
      'https://twitter.com/CrunchyTez',
      'https://discord.com/invite/99UnxxgB46'
    ],
    interfaces: [],
    categories: ['Farming'],
    soon: false,
    logo: 'https://bcd-static-assets.s3.eu-central-1.amazonaws.com/dapps/crunchy/crunchy_logo.jpg',
    cover: 'https://bcd-static-assets.s3.eu-central-1.amazonaws.com/dapps/crunchy/crunchy_cover.png',
    tvl: '2203098.57'
  },
  {
    name: 'Hic et nunc',
    short_description: 'NFT marketplace',
    full_description:
      'The H=N platform combines the cost-effective utility working artists need and the eco-friendly characteristics they care about.',
    website: 'https://www.hicetnunc.xyz/',
    slug: 'hen',
    authors: [],
    social_links: ['https://twitter.com/hicetnunc2000', 'https://github.com/hicetnunc2000'],
    interfaces: ['FA2'],
    categories: ['NFT', 'Token'],
    soon: false,
    logo: 'https://bcd-static-assets.s3.eu-central-1.amazonaws.com/dapps/hen/hen_logo.jpg',
    cover: 'https://bcd-static-assets.s3.eu-central-1.amazonaws.com/dapps/hen/hen_cover.jpg',
    tvl: '9666231.56'
  },
  {
    name: 'objkt.com',
    short_description: 'The largest NFT marketplace on Tezos.',
    full_description:
      'objkt.com is the first FA2 marketplace that aggregates tokens across contracts and provides a cohesive user interface to interact with and trade multimedia NFTs.',
    website: 'https://objkt.com',
    slug: 'objkt',
    authors: ['objkt.com'],
    social_links: ['https://twitter.com/objktcom'],
    interfaces: null,
    categories: ['NFT', 'Marketplace'],
    soon: false,
    logo: 'https://bcd-static-assets.s3.eu-central-1.amazonaws.com/dapps/objkt/objkt_logo.png',
    cover: 'https://bcd-static-assets.s3.eu-central-1.amazonaws.com/dapps/objkt/objkt_cover.png',
    screenshots: [
      {
        type: 'desktop',
        link: 'https://bcd-static-assets.s3.eu-central-1.amazonaws.com/dapps/objkt/objkt_screen_1.png'
      },
      {
        type: 'desktop',
        link: 'https://bcd-static-assets.s3.eu-central-1.amazonaws.com/dapps/objkt/objkt_screen_2.png'
      },
      {
        type: 'desktop',
        link: 'https://bcd-static-assets.s3.eu-central-1.amazonaws.com/dapps/objkt/objkt_screen_3.png'
      }
    ],
    tvl: '68026.49'
  },
  {
    name: 'QuipuSwap',
    short_description: 'A decentralized exchange on Tezos',
    full_description:
      'QuipuSwap is an open-source protocol that provides an interface for the seamless decentralized exchange of Tezos-based Tokens and XTZ. Using the advantages of Tezos protocol such as liquid XTZ delegation, liquidity providers earn both from swap fees and bakers rewards.',
    website: 'https://quipuswap.com/',
    slug: 'quipuswap',
    authors: ['Madfish Solutions'],
    social_links: [
      'https://twitter.com/madfishofficial',
      'https://www.reddit.com/r/MadFishCommunity',
      'https://t.me/MadFishCommunity',
      'https://discord.com/invite/qFRZ8kVzkv'
    ],
    interfaces: ['FA1.2', 'FA2'],
    categories: ['DEX'],
    soon: false,
    logo: 'https://bcd-static-assets.s3.eu-central-1.amazonaws.com/dapps/quipuswap/quipuswap_logo.jpg',
    cover: 'https://bcd-static-assets.s3.eu-central-1.amazonaws.com/dapps/quipuswap/quipuswap_cover.png',
    tvl: '30171599.12'
  },
  {
    name: 'Pixel Potus',
    short_description: 'Digital collectable competition',
    full_description:
      'We hold these truths to be self-evident, that all NFTs are NOT created equal, that some are endowed by their Creator with certain unalienable rights, that among these are Life, Liberty and the pursuit of Pixelation.',
    website: 'https://www.pixelpotus.com/',
    slug: 'pixelpotus',
    authors: [],
    social_links: [
      'https://twitter.com/PixelPotus',
      'https://t.me/joinchat/YTjc8t6oiahkMzMx',
      'https://discord.gg/CbdbvwtwkM'
    ],
    interfaces: ['TZIP-12'],
    categories: ['NFT'],
    soon: false,
    logo: 'https://bcd-static-assets.s3.eu-central-1.amazonaws.com/dapps/pixelpotus/pixelpotus_logo.png',
    cover: 'https://bcd-static-assets.s3.eu-central-1.amazonaws.com/dapps/pixelpotus/pixelpotus_cover.jpg',
    tvl: '0'
  }
];

export const DApps = () => {
  // const data = useDApps();

  const styles = useDAppsStyles();
  const [searchValue, setSearchValue] = useState<string>();

  return (
    <>
      <SearchInput placeholder="Search token" onChangeText={setSearchValue} />
      <Divider size={formatSize(28)} />
      <View style={styles.container}>
        <Text style={styles.title}>Integrated</Text>
        <Divider size={formatSize(12)} />
        <IntegratedDApp
          iconName={IconNameEnum.QuipuSwap}
          title="QuipuSwap"
          description="The most efficient DApp for Tezos"
          url="https://quipuswap.com"
        />
      </View>
      <Divider size={formatSize(36)} />
      <View style={{ marginLeft: formatSize(15) }}>
        <Text style={styles.title}>Others</Text>
        <Divider size={formatSize(12)} />
        <View style={styles.list}>
          <FlatList
            data={data}
            renderItem={item => <OthersDApp item={item} />}
            keyExtractor={item => item.name}
            numColumns={2}
          />
        </View>
      </View>
    </>
  );
};
