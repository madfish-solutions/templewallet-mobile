import { isNonEmptyArray } from '@apollo/client/utilities';
import { RouteProp, useRoute } from '@react-navigation/core';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { Dimensions, Share, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { SvgUri } from 'react-native-svg';
import { useDispatch } from 'react-redux';

import { SUPPORTED_CONTRACTS } from 'src/apis/objkt/constants';
import { ActivityIndicator } from 'src/components/activity-indicator/activity-indicator';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { CollectibleIcon, CollectibleIconSize } from 'src/components/collectible-icon/collectible-icon';
import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { LinkWithIcon } from 'src/components/link-with-icon/link-with-icon';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { TextSegmentControl } from 'src/components/segmented-control/text-segment-control/text-segment-control';
import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { TruncatedText } from 'src/components/truncated-text';
import { ONE_MINUTE } from 'src/config/fixed-times';
import { useBurnCollectible } from 'src/hooks/use-burn-collectible.hook';
import { useBuyCollectible } from 'src/hooks/use-buy-collectible.hook';
import { useCollectibleOwnerCheck } from 'src/hooks/use-check-is-user-collectible-owner.hook';
import { useCurrentCollectibleFullData } from 'src/hooks/use-current-collectible-full-data.hook';
import { useFetchCollectibleAttributes } from 'src/hooks/use-fetch-collectible-attributes.hook';
import { ModalsEnum, ModalsParamList } from 'src/navigator/enums/modals.enum';
import { loadCollectiblesDetailsActions } from 'src/store/collectibles/collectibles-actions';
import { useCollectibleDetailsLoadingSelector } from 'src/store/collectibles/collectibles-selectors';
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
import { isDefined } from 'src/utils/is-defined';
import { isString } from 'src/utils/is-string';
import { openUrl } from 'src/utils/linking';
import { objktCollectionUrl } from 'src/utils/objkt-collection-url.util';

import { CollectibleModalSelectors } from './collectible-modal.selectors';
import { useCollectibleModalStyles } from './collectible-modal.styles';
import { CollectibleAttributes } from './components/collectible-attributes/collectible-attributes';
import { CollectibleProperties } from './components/collectible-properties/collectible-properties';
import { COLLECTION_ICON_SIZE } from './constants';
import { getObjktProfileLink } from './utils/get-objkt-profile-link.util';

enum SegmentControlNamesEnum {
  Attributes = 'Attributes',
  Properties = 'Properties'
}

const SEGMENT_VALUES = [SegmentControlNamesEnum.Attributes, SegmentControlNamesEnum.Properties];

const SHARE_NFT_CONTENT = 'View NFT with Temple Wallet mobile: ';

export const CollectibleModal = memo(() => {
  const { slug } = useRoute<RouteProp<ModalsParamList, ModalsEnum.CollectibleModal>>().params;

  const [address, id] = fromTokenSlug(slug);

  const { width } = Dimensions.get('window');
  const iconSize = width - formatSize(32);

  usePageAnalytic(ModalsEnum.CollectibleModal);

  const { trackEvent } = useAnalytics();
  const dispatch = useDispatch();

  const styles = useCollectibleModalStyles();

  const [segmentControlIndex, setSegmentControlIndex] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const isUserOwnerCurrentCollectible = useCollectibleOwnerCheck(slug);

  const { collectible } = useCurrentCollectibleFullData(slug, isUserOwnerCurrentCollectible);

  const burnCollectible = useBurnCollectible(collectible);
  const { attributes, isLoading } = useFetchCollectibleAttributes(collectible);
  const { buyCollectible, purchaseCurrency } = useBuyCollectible(collectible);

  const isLoadingDetails = useCollectibleDetailsLoadingSelector();

  const {
    collection,
    creators,
    description,
    metadata,
    timestamp,
    royalties,
    editions,
    galleries,
    listingsActive,
    name,
    thumbnailUri
  } = collectible;

  useInterval(
    () => {
      if (!isUserOwnerCurrentCollectible) {
        dispatch(loadCollectiblesDetailsActions.submit([slug]));
      }
    },
    ONE_MINUTE,
    [slug, isUserOwnerCurrentCollectible],
    false
  );

  const isAttributesExist = attributes.length > 0;

  const segmentValues = isAttributesExist ? SEGMENT_VALUES : SEGMENT_VALUES.slice(1, 2);

  const handleCollectionNamePress = () => openUrl(objktCollectionUrl(address));

  const isSupportedContract = useMemo(
    () =>
      isNonEmptyArray(listingsActive) ? SUPPORTED_CONTRACTS.includes(listingsActive[0].marketplaceContract) : true,
    [listingsActive]
  );

  const submitButtonTitle = useMemo(() => {
    if (!isSupportedContract) {
      return 'Buy';
    }

    if ((isLoadingDetails && !isUserOwnerCurrentCollectible) || isLoadingDetails) {
      return '';
    }

    if (isUserOwnerCurrentCollectible) {
      return 'Send';
    }

    if (!isNonEmptyArray(listingsActive)) {
      return 'Not listed';
    }

    return `Buy for ${formatNumber(purchaseCurrency.priceToDisplay)} ${purchaseCurrency.symbol}`;
  }, [isUserOwnerCurrentCollectible, purchaseCurrency, listingsActive, isLoadingDetails, isSupportedContract]);

  const collectionLogo = useMemo(() => {
    if (isDefined(collection) && isDefined(collection.logo)) {
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
    }

    return null;
  }, [collection]);

  const handleShare = useCallback(async () => {
    // Max link length: 7168 symbols, so we need to reduce the amount of data we send
    const urlEncodedData = encodeURIComponent(JSON.stringify({ slug }));

    if (urlEncodedData.length > 7168) {
      return void showErrorToast({ title: 'Cannot share', description: 'Data is too large' });
    }

    try {
      const dynamicLink = await getTempleDynamicLink(`/nft?jsonData=${urlEncodedData}`, {
        title: name,
        descriptionText: description,
        imageUrl: isDefined(thumbnailUri) ? formatImgUri(thumbnailUri, ImageResolutionEnum.MEDIUM) : undefined
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
  }, [slug, name, description, thumbnailUri]);

  const propertiesIndex = segmentValues.findIndex(item => item === SegmentControlNamesEnum.Properties);

  const isPropertiesSelected = propertiesIndex === segmentControlIndex;

  const collectionName = useMemo(() => {
    if (isNonEmptyArray(galleries)) {
      return galleries[0].gallery.name;
    }

    if (isDefined(collection)) {
      return collection.name;
    }

    return 'Unknown collection';
  }, [galleries, collection]);

  const isDisabled =
    (!isUserOwnerCurrentCollectible && !isNonEmptyArray(listingsActive)) || isLoadingDetails || !isSupportedContract;

  const isShowSegment = segmentValues.length > 1;

  if (!isString(collectible.address)) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <ScreenContainer
      fixedFooterContainer={{
        submitButton: (
          <ButtonLargePrimary
            disabled={isDisabled}
            title={submitButtonTitle}
            isLoading={isLoadingDetails}
            onPress={buyCollectible}
            testID={CollectibleModalSelectors.sendButton}
          />
        )
      }}
      isFullScreenMode={true}
      scrollEnabled={scrollEnabled}
    >
      <ModalStatusBar />

      <View>
        <CollectibleIcon
          collectible={collectible}
          size={iconSize}
          iconSize={CollectibleIconSize.BIG}
          isTouchableBlurOverlay
          isModalWindow
          setScrollEnabled={setScrollEnabled}
        />

        <Divider size={formatSize(12)} />

        <View style={styles.collectionContainer}>
          <TouchableOpacity onPress={handleCollectionNamePress} style={styles.collection}>
            {isDefined(collection) && isDefined(collection.logo) ? (
              collectionLogo
            ) : (
              <View style={[styles.collectionLogo, styles.logoFallBack]} />
            )}

            <TruncatedText style={styles.collectionName}>{collectionName}</TruncatedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Icon name={IconNameEnum.Share} />
            <Divider size={formatSize(4)} />
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.nameContainer}>
          <Text style={styles.name}>{collectible.name}</Text>
        </View>

        {isString(description) && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{description}</Text>
          </View>
        )}

        {isNonEmptyArray(creators) && (
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

        {!isLoading && isShowSegment && (
          <TextSegmentControl
            selectedIndex={segmentControlIndex}
            values={segmentValues}
            onChange={setSegmentControlIndex}
            style={styles.segmentControl}
          />
        )}

        {!isLoading && isPropertiesSelected && (
          <CollectibleProperties
            contract={address}
            tokenId={Number(id)}
            editions={editions}
            metadata={metadata}
            minted={timestamp}
            owned={collectible.balance ?? '0'}
            royalties={royalties}
          />
        )}

        {!isLoading && !isPropertiesSelected && isAttributesExist && <CollectibleAttributes attributes={attributes} />}

        {isUserOwnerCurrentCollectible && (
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
