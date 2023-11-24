import { RouteProp, useRoute } from '@react-navigation/core';
import BigNumber from 'bignumber.js';
import React, { memo, useMemo, useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { SvgUri } from 'react-native-svg';
import { useDispatch } from 'react-redux';

import { objktCurrencies } from 'src/apis/objkt/constants';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { LinkWithIcon } from 'src/components/link-with-icon/link-with-icon';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { TextSegmentControl } from 'src/components/segmented-control/text-segment-control/text-segment-control';
import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { TruncatedText } from 'src/components/truncated-text';
import { BLOCK_DURATION } from 'src/config/fixed-times';
import { emptyFn } from 'src/config/general';
import { useShareNFT } from 'src/hooks/use-share-nft.hook';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum, ModalsParamList } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { loadCollectiblesDetailsActions } from 'src/store/collectibles/collectibles-actions';
import {
  useCollectibleDetailsLoadingSelector,
  useCollectibleDetailsSelector
} from 'src/store/collectibles/collectibles-selectors';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { useAssetMetadataSelector } from 'src/store/tokens-metadata/tokens-metadata-selectors';
import { useAssetBalanceSelector, useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { conditionalStyle } from 'src/utils/conditional-style';
import { formatNumber } from 'src/utils/format-price';
import { fromTokenSlug } from 'src/utils/from-token-slug';
import { useInterval } from 'src/utils/hooks';
import { formatImgUri } from 'src/utils/image.utils';
import { isString } from 'src/utils/is-string';
import { openUrl } from 'src/utils/linking';
import { SUPPORTED_CONTRACTS, buildBuyCollectibleParams } from 'src/utils/objkt';
import { objktCollectionUrl } from 'src/utils/objkt-collection-url.util';
import { createTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';
import { mutezToTz } from 'src/utils/tezos.util';

import { CollectibleModalSelectors } from './collectible-modal.selectors';
import { useCollectibleModalStyles } from './collectible-modal.styles';
import { CollectibleAttributes } from './components/collectible-attributes';
import { CollectibleMedia } from './components/collectible-media';
import { CollectibleProperties } from './components/collectible-properties';
import { COLLECTION_ICON_SIZE } from './constants';
import { getObjktProfileLink } from './utils/get-objkt-profile-link.util';
import { useAttributesWithRarity } from './utils/use-attributes-with-rarity.hook';
import { useBurnCollectible } from './utils/use-burn-collectible.hook';

const DETAILS_SYNC_INTERVAL = 4 * BLOCK_DURATION;

enum SegmentControlNamesEnum {
  attributes = 'Attributes',
  properties = 'Properties'
}

export const CollectibleModal = memo(() => {
  const { slug } = useRoute<RouteProp<ModalsParamList, ModalsEnum.CollectibleModal>>().params;

  const [address, id] = fromTokenSlug(slug);
  const accountPkh = useCurrentAccountPkhSelector();
  const selectedRpc = useSelectedRpcUrlSelector();

  const { width } = Dimensions.get('window');
  const imageSize = width - formatSize(32);

  usePageAnalytic(ModalsEnum.CollectibleModal);

  const dispatch = useDispatch();

  const styles = useCollectibleModalStyles();

  const [scrollEnabled, setScrollEnabled] = useState(true);

  const metadata = useAssetMetadataSelector(slug);
  const details = useCollectibleDetailsSelector(slug);
  const balance = useAssetBalanceSelector(slug);
  const isAccountHolder = isString(balance) && balance !== '0';
  const areDetailsLoading = useCollectibleDetailsLoadingSelector();

  const attributes = useAttributesWithRarity(details);

  const burnCollectible = useBurnCollectible(metadata);

  const creators = details?.creators;

  useInterval(() => void dispatch(loadCollectiblesDetailsActions.submit([slug])), DETAILS_SYNC_INTERVAL, [slug], true);

  const handleCollectionNamePress = () => openUrl(objktCollectionUrl(address));

  const { navigate } = useNavigation();

  const button = useMemo(() => {
    if (isAccountHolder) {
      return {
        title: 'Send',
        disabled: !metadata,
        onPress: metadata ? (): void => navigate(ModalsEnum.Send, { token: metadata }) : undefined
      };
    }

    const listing = details?.listingsActive[0] ?? null;

    if (!listing) {
      return {
        title: 'Not listed',
        disabled: true,
        loading: areDetailsLoading
      };
    }

    const isSupportedContract = SUPPORTED_CONTRACTS.includes(listing.marketplace_contract);
    const purchaseCurrency = objktCurrencies[listing.currency_id];

    if (!isSupportedContract || !purchaseCurrency) {
      return {
        title: 'Buy',
        disabled: true
      };
    }

    const priceToDisplay = +mutezToTz(new BigNumber(listing.price), purchaseCurrency.decimals);

    return {
      title: `Buy for ${formatNumber(priceToDisplay)} ${purchaseCurrency.symbol}`,
      onPress: () =>
        void buildBuyCollectibleParams(createTezosToolkit(selectedRpc), accountPkh, listing, purchaseCurrency).then(
          opParams =>
            navigate(ModalsEnum.Confirmation, {
              type: ConfirmationTypeEnum.InternalOperations,
              opParams
            })
        )
    };
  }, [isAccountHolder, areDetailsLoading, metadata, details?.listingsActive, accountPkh, selectedRpc, navigate]);

  const name = metadata?.name ?? details?.name;
  const artifactUri = metadata?.artifactUri ?? details?.artifactUri;
  const thumbnailUri = metadata?.thumbnailUri ?? details?.thumbnailUri;
  const displayUri = metadata?.displayUri ?? details?.displayUri;

  const handleShare = useShareNFT(slug, thumbnailUri, name, details?.description);

  const [segmentControlIndex, setSegmentControlIndex] = useState(0);

  const segments = useMemo<{ values: string[]; current: keyof typeof SegmentControlNamesEnum }>(
    () =>
      attributes.length
        ? {
            values: [SegmentControlNamesEnum.attributes, SegmentControlNamesEnum.properties],
            current: segmentControlIndex === 1 ? 'properties' : 'attributes'
          }
        : { values: [SegmentControlNamesEnum.properties], current: 'properties' },
    [attributes.length, segmentControlIndex]
  );

  const collection = useMemo(() => {
    if (!details) {
      return null;
    }
    const { collection, galleries } = details;

    const title = galleries[0]?.gallery.name ?? collection?.name;

    const logo = (() => {
      if (!collection.logo) {
        return null;
      }
      if (collection.logo.endsWith('.svg')) {
        return (
          <SvgUri
            uri={collection.logo}
            height={COLLECTION_ICON_SIZE}
            width={COLLECTION_ICON_SIZE}
            style={styles.collectionLogo}
          />
        );
      }

      return <FastImage source={{ uri: formatImgUri(collection.logo) }} style={styles.collectionLogo} />;
    })();

    return { title, logo };
  }, [details, styles.collectionLogo]);

  return (
    <ScreenContainer
      fixedFooterContainer={{
        submitButton: (
          <ButtonLargePrimary
            disabled={button.disabled}
            title={button.title}
            isLoading={button.loading}
            onPress={button.onPress || emptyFn}
            testID={CollectibleModalSelectors.sendButton}
          />
        )
      }}
      isFullScreenMode={true}
      scrollEnabled={scrollEnabled}
    >
      <ModalStatusBar />

      <View>
        <View style={[styles.mediaContainer, { width: imageSize, height: imageSize }]}>
          <CollectibleMedia
            slug={slug}
            artifactUri={artifactUri}
            displayUri={displayUri}
            thumbnailUri={thumbnailUri}
            mime={details?.mime}
            size={imageSize}
            areDetailsLoading={areDetailsLoading && details === undefined}
            setScrollEnabled={setScrollEnabled}
          />
        </View>

        <Divider size={formatSize(12)} />

        <View style={styles.collectionContainer}>
          <TouchableOpacity onPress={handleCollectionNamePress} style={styles.collection}>
            {collection?.logo ?? <View style={[styles.collectionLogo, styles.logoFallBack]} />}

            <TruncatedText style={styles.collectionName}>{collection?.title ?? 'Unknown collection'}</TruncatedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Icon name={IconNameEnum.Share} />
            <Divider size={formatSize(4)} />
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.nameContainer}>
          <Text style={styles.name}>{name ?? '---'}</Text>
        </View>

        {details?.description ? (
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{details.description}</Text>
          </View>
        ) : null}

        {creators?.length ? (
          <View style={styles.creatorsContainer}>
            <Text style={styles.creatorsText}>{creators.length > 1 ? 'Creators' : 'Creator'}:</Text>

            {creators.map(({ holder }, index) => (
              <LinkWithIcon
                key={holder.address}
                text={isString(holder.tzdomain) ? holder.tzdomain : holder.address}
                link={getObjktProfileLink(holder.address)}
                valueToClipboard={isString(holder.tzdomain) ? holder.tzdomain : holder.address}
                style={[
                  styles.linkWithIcon,
                  conditionalStyle(creators.length > 0 && creators.length !== index + 1, styles.marginRight)
                ]}
              />
            ))}
          </View>
        ) : null}

        {segments.values.length ? (
          <TextSegmentControl
            selectedIndex={segmentControlIndex}
            values={segments.values}
            onChange={setSegmentControlIndex}
            style={styles.segmentControl}
          />
        ) : null}

        {segments.current === 'properties' ? (
          <CollectibleProperties contract={address} tokenId={Number(id)} details={details} owned={balance ?? '0'} />
        ) : null}

        {segments.current === 'attributes' ? <CollectibleAttributes attributes={attributes!} /> : null}

        {isAccountHolder ? (
          <View style={styles.burnContainer}>
            <TouchableWithAnalytics
              Component={TouchableOpacity}
              onPress={burnCollectible}
              style={styles.burnButton}
              testID={CollectibleModalSelectors.burnButton}
            >
              <Text style={styles.burnButtonText}>Burn Nft</Text>
              <Icon name={IconNameEnum.Burn} />
            </TouchableWithAnalytics>
          </View>
        ) : null}
      </View>
    </ScreenContainer>
  );
});
