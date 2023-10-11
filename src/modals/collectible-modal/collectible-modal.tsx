import { RouteProp, useRoute } from '@react-navigation/core';
import BigNumber from 'bignumber.js';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { Dimensions, Share, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { SvgUri } from 'react-native-svg';
import { useDispatch } from 'react-redux';

import { objktCurrencies } from 'src/apis/objkt/constants';
// import { ActivityIndicator } from 'src/components/activity-indicator/activity-indicator';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { CollectibleIcon } from 'src/components/collectible-icon/collectible-icon';
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
import { showErrorToast } from 'src/toast/error-toast.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { usePageAnalytic, useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';
import { conditionalStyle } from 'src/utils/conditional-style';
import { formatNumber } from 'src/utils/format-price';
import { fromTokenSlug } from 'src/utils/from-token-slug';
import { getTempleDynamicLink } from 'src/utils/get-temple-dynamic-link.util';
import { useInterval } from 'src/utils/hooks';
import { ImageResolutionEnum, formatImgUri } from 'src/utils/image.utils';
import { isString } from 'src/utils/is-string';
import { openUrl } from 'src/utils/linking';
import { SUPPORTED_CONTRACTS, buildBuyCollectibleParams } from 'src/utils/objkt';
import { objktCollectionUrl } from 'src/utils/objkt-collection-url.util';
import { createTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';
import { mutezToTz } from 'src/utils/tezos.util';

import { CollectibleModalSelectors } from './collectible-modal.selectors';
import { useCollectibleModalStyles } from './collectible-modal.styles';
import { CollectibleAttributes } from './components/collectible-attributes';
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

export const SHARE_NFT_CONTENT = 'View NFT with Temple Wallet mobile: ';

export const CollectibleModal = memo(() => {
  const { slug } = useRoute<RouteProp<ModalsParamList, ModalsEnum.CollectibleModal>>().params;

  const [address, id] = fromTokenSlug(slug);
  const accountPkh = useCurrentAccountPkhSelector();
  const selectedRpc = useSelectedRpcUrlSelector();

  const { width } = Dimensions.get('window');
  const imageSize = width - formatSize(32);

  usePageAnalytic(ModalsEnum.CollectibleModal);

  const { trackEvent } = useAnalytics();
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
        onPress: metadata ? () => navigate(ModalsEnum.Send, { token: metadata }) : undefined
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

  const handleShare = useCallback(async () => {
    // Max link length: 7168 symbols, so we need to reduce the amount of data we send
    const urlEncodedData = encodeURIComponent(JSON.stringify({ slug }));

    if (urlEncodedData.length > 7168) {
      return void showErrorToast({ title: 'Cannot share', description: 'Data is too large' });
    }

    try {
      const dynamicLink = await getTempleDynamicLink(`/nft?jsonData=${urlEncodedData}`, {
        title: name,
        descriptionText: details?.description,
        imageUrl: thumbnailUri ? formatImgUri(thumbnailUri, ImageResolutionEnum.MEDIUM) : undefined
      });

      await Share.share({
        message: SHARE_NFT_CONTENT + dynamicLink
      });

      await trackEvent(CollectibleModalSelectors.shareNFTSuccess, AnalyticsEventCategory.ButtonPress);
    } catch (e: any) {
      showErrorToast({
        description: e.message,
        isCopyButtonVisible: true,
        onPress: () => copyStringToClipboard(e.message)
      });

      await trackEvent(CollectibleModalSelectors.shareNFTFailed, AnalyticsEventCategory.ButtonPress, {
        errorMessage: e.message
      });
    }
  }, [slug, name, details?.description, thumbnailUri, trackEvent]);

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

    const title = (() => {
      if (galleries.length) {
        return galleries[0]!.gallery.name;
      }

      return collection && collection.name;
    })();

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

  // if (!isString(collectible?.address)) {
  //   return <ActivityIndicator size="large" />;
  // }

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
        <View style={[styles.imageWrap, { width: imageSize, height: imageSize }]}>
          <CollectibleIcon
            slug={slug}
            artifactUri={artifactUri}
            displayUri={displayUri}
            mime={details?.mime || ''}
            size={imageSize}
            isBigIcon={true}
            isTouchableBlurOverlay
            isModalWindow
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

        {details?.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{details.description}</Text>
          </View>
        )}

        {creators?.length && (
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
        )}

        {segments.values.length && (
          <TextSegmentControl
            selectedIndex={segmentControlIndex}
            values={segments.values}
            onChange={setSegmentControlIndex}
            style={styles.segmentControl}
          />
        )}

        {segments.current === 'properties' && (
          <CollectibleProperties contract={address} tokenId={Number(id)} details={details} owned={balance ?? '0'} />
        )}

        {segments.current === 'attributes' && <CollectibleAttributes attributes={attributes!} />}

        {isAccountHolder && (
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
        )}
      </View>
    </ScreenContainer>
  );
});
