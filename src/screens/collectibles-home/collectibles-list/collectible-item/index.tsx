import BigNumber from 'bignumber.js';
import React, { FC, memo, ReactNode, useCallback, useMemo } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';

import { objktCurrencies } from 'src/apis/objkt/constants';
import { CollectibleImage } from 'src/components/collectible-image';
import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { NetworkIcon } from 'src/components/network-icon';
import { SafeTouchableOpacity } from 'src/components/safe-touchable-opacity';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigateToModal } from 'src/navigator/hooks/use-navigation.hook';
import {
  useCollectibleDetailsLoadingSelector,
  useCollectibleDetailsSelector
} from 'src/store/collectibles/collectibles-selectors';
import { DisplayedCollectible } from 'src/utils/assets/types';
import { formatNumber } from 'src/utils/format-price';
import { isSvgDataUriInBase64Encoding } from 'src/utils/image.utils';
import { isDefined } from 'src/utils/is-defined';
import { mutezToTz } from 'src/utils/tezos.util';

import { Balance } from './balance';
import { CollectibleItemImage } from './item-image';
import { useCollectibleItemStyles } from './styles';

interface Props {
  collectible: DisplayedCollectible;
  size: number;
  showInfo?: boolean;
  style?: StyleProp<ViewStyle>;
}

type TezosCollectible = Extract<DisplayedCollectible, { chainKind: TempleChainKind.Tezos }>;
type EvmCollectible = Extract<DisplayedCollectible, { chainKind: TempleChainKind.EVM }>;
type CommonAdapterProps = Omit<Props, 'collectible'>;

export const CollectibleItem: FC<Props> = props =>
  props.collectible.chainKind === TempleChainKind.EVM ? (
    <EvmCollectibleItem {...props} collectible={props.collectible} />
  ) : (
    <TezosCollectibleItem {...props} collectible={props.collectible} />
  );

const TezosCollectibleItem = memo<CommonAdapterProps & { collectible: TezosCollectible }>(
  ({ collectible, size, showInfo = false, style }) => {
    const navigateToModal = useNavigateToModal();
    const { asset, slug } = collectible;
    const areDetailsLoading = useCollectibleDetailsLoadingSelector();
    const details = useCollectibleDetailsSelector(slug);

    const listing = useMemo(() => {
      const cheapestListing = details?.listingsActive[0];
      if (!cheapestListing) {
        return null;
      }

      const currency = objktCurrencies[cheapestListing.currency_id];
      if (!isDefined(currency)) {
        return null;
      }

      const floorPrice = mutezToTz(new BigNumber(cheapestListing.price), currency.decimals).toNumber();

      return { floorPriceDisplayed: formatNumber(floorPrice), symbol: currency.symbol };
    }, [details]);

    const handleNavigate = useCallback(
      () => navigateToModal(ModalsEnum.CollectibleModal, { chainKind: TempleChainKind.Tezos, slug }),
      [navigateToModal, slug]
    );

    return (
      <CollectibleItemView
        balance={asset.balance}
        displayName={asset.name}
        image={
          <CollectibleItemImage
            slug={slug}
            size={size}
            artifactUri={
              details?.artifactUri != null &&
              (isSvgDataUriInBase64Encoding(details.artifactUri) || asset.artifactUri === 'UNSUPPORTED_EXTENSION')
                ? details.artifactUri
                : asset.artifactUri
            }
            displayUri={asset.displayUri ?? details?.displayUri}
            thumbnailUri={asset.thumbnailUri ?? details?.thumbnailUri}
            areDetailsLoading={areDetailsLoading && details === undefined}
          />
        }
        networkIcon={CryptoLogoNameEnum.Tezos}
        onPress={handleNavigate}
        showInfo={showInfo}
        size={size}
        style={style}
        subtitle={listing ? `Floor: ${listing.floorPriceDisplayed} ${listing.symbol}` : 'Not listed'}
      />
    );
  }
);

const EvmCollectibleItem = memo<CommonAdapterProps & { collectible: EvmCollectible }>(
  ({ collectible, size, showInfo = false, style }) => {
    const navigateToModal = useNavigateToModal();
    const { metadata, tokenId, balance, slug, chainId } = collectible;

    const handleNavigate = useCallback(
      () => navigateToModal(ModalsEnum.CollectibleModal, { chainKind: TempleChainKind.EVM, chainId, slug }),
      [chainId, navigateToModal, slug]
    );

    return (
      <CollectibleItemView
        balance={balance}
        displayName={metadata?.collectibleName ?? metadata?.name ?? tokenId}
        image={
          <CollectibleImage
            chainKind={TempleChainKind.EVM}
            slug={slug}
            chainId={chainId}
            uri={metadata?.image ?? metadata?.iconURL}
            size={size}
          />
        }
        networkIcon={CryptoLogoNameEnum.Etherlink}
        onPress={handleNavigate}
        showInfo={showInfo}
        size={size}
        style={style}
        subtitle="No value"
      />
    );
  }
);

interface CollectibleItemViewProps extends Omit<CommonAdapterProps, 'showInfo'> {
  balance?: string;
  displayName: string;
  image: ReactNode;
  networkIcon: CryptoLogoNameEnum;
  onPress: EmptyFn;
  showInfo: boolean;
  subtitle: string;
}

const CollectibleItemView = memo<CollectibleItemViewProps>(
  ({ balance, displayName, image, networkIcon, onPress, showInfo, size, style, subtitle }) => {
    const styles = useCollectibleItemStyles();

    return (
      <SafeTouchableOpacity activeOpacity={0.7} onPress={onPress} style={[styles.root, style, { width: size }]}>
        <View style={[styles.image, { width: size, height: size }]}>
          {image}
          {showInfo && isDefined(balance) ? <Balance balance={balance} /> : null}
          <View style={styles.networkBadge}>
            <NetworkIcon name={networkIcon} variant="nftBadge" />
          </View>
        </View>

        {showInfo ? (
          <View style={styles.description}>
            <Text numberOfLines={1} lineBreakMode="tail" style={styles.name}>
              {displayName}
            </Text>
            <Text style={styles.price}>{subtitle}</Text>
          </View>
        ) : null}
      </SafeTouchableOpacity>
    );
  }
);
