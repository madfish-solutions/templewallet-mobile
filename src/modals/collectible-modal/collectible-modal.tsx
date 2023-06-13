import { isNonEmptyArray } from '@apollo/client/utilities';
import { RouteProp, useRoute } from '@react-navigation/core';
import { OpKind, ParamsWithKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, Share, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ScrollView } from 'react-native-gesture-handler';
import { SvgUri } from 'react-native-svg';
import { useDispatch } from 'react-redux';

import { currencyInfoById } from '../../apis/objkt/constants';
import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { CollectibleIcon } from '../../components/collectible-icon/collectible-icon';
import { CollectibleIconSize } from '../../components/collectible-icon/collectible-icon.props';
import { Divider } from '../../components/divider/divider';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { ImageBlurOverlayThemesEnum } from '../../components/image-blur-overlay/image-blur-overlay';
import { LinkWithIcon } from '../../components/link-with-icon/link-with-icon';
import { ModalStatusBar } from '../../components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { TextSegmentControl } from '../../components/segmented-control/text-segment-control/text-segment-control';
import { TouchableWithAnalytics } from '../../components/touchable-with-analytics';
import { Route3TokenStandardEnum } from '../../enums/route3.enum';
import { useCollectibleInfo } from '../../hooks/collectible-info/use-collectible-info.hook';
import { useBurnCollectible } from '../../hooks/use-burn-collectible.hook';
import {
  FxHashBuyCollectibleContractInterface,
  ObjktBuyCollectibleContractInterface
} from '../../interfaces/buy-collectible.interface';
import { ConfirmationTypeEnum } from '../../interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum, ModalsParamList } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { navigateAction } from '../../store/root-state.actions';
import { useSelectedRpcUrlSelector } from '../../store/settings/settings-selectors';
import { useCollectiblesListSelector, useSelectedAccountSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { showErrorToast } from '../../toast/error-toast.utils';
import { getTokenSlug } from '../../token/utils/token.utils';
import { AnalyticsEventCategory } from '../../utils/analytics/analytics-event.enum';
import { usePageAnalytic, useAnalytics } from '../../utils/analytics/use-analytics.hook';
import { copyStringToClipboard } from '../../utils/clipboard.utils';
import { conditionalStyle } from '../../utils/conditional-style';
import { getTempleDynamicLink } from '../../utils/get-temple-dynamic-link.util';
import { formatImgUri } from '../../utils/image.utils';
import { isDefined } from '../../utils/is-defined';
import { isString } from '../../utils/is-string';
import { openUrl } from '../../utils/linking.util';
import { objktCollectionUrl } from '../../utils/objkt-collection-url.util';
import { createTezosToolkit } from '../../utils/rpc/tezos-toolkit.utils';
import { getTruncatedProps } from '../../utils/style.util';
import { getTransferPermissions } from '../../utils/swap-permissions.util';
import { mutezToTz } from '../../utils/tezos.util';
import { CollectibleModalSelectors } from './collectible-modal.selectors';
import { useCollectibleModalStyles } from './collectible-modal.styles';
import { CollectibleAttributes } from './components/collectible-attributes/collectible-attributes';
import { CollectibleProperties } from './components/collectible-properties/collectible-properties';
import { BLURED_COLLECTIBLE_ATTRIBUTE_NAME, COLLECTION_ICON_SIZE, OBJKT_MARKETPLACE_CONTRACT } from './constants';
import { getObjktProfileLink } from './utils/get-objkt-profile-link.util';

enum SegmentControlNamesEnum {
  Attributes = 'Attributes',
  Properties = 'Properties',
  Offers = 'Offers'
}

const SEGMENT_VALUES = [
  SegmentControlNamesEnum.Attributes,
  SegmentControlNamesEnum.Properties,
  SegmentControlNamesEnum.Offers
];

const SHARE_NFT_CONTENT = 'View NFT with Temple Wallet mobile: ';
const OBJKT_BUY_METHOD = 'fulfill_ask';
const DEFAULT_OBJKT_STORAGE_LIMIT = 350;

export const CollectibleModal = () => {
  const { collectible } = useRoute<RouteProp<ModalsParamList, ModalsEnum.CollectibleModal>>().params;

  const { width } = Dimensions.get('window');
  const itemWidth = width - 32;

  const { navigate } = useNavigation();

  const collectibles = useCollectiblesListSelector();

  const selectedRpc = useSelectedRpcUrlSelector();
  const tezos = createTezosToolkit(selectedRpc);

  const selectedAccount = useSelectedAccountSelector();

  const dispatch = useDispatch();

  const [marketplaceContract, setMarketplaceContract] = useState<
    ObjktBuyCollectibleContractInterface | FxHashBuyCollectibleContractInterface
  >();

  const isUserOwnerCurrentCollectible = useMemo(
    () => !!collectibles.find(ownCollectible => getTokenSlug(ownCollectible) === getTokenSlug(collectible)),
    [collectible, collectibles]
  );

  const [segmentControlIndex, setSegmentControlIndex] = useState(0);

  const styles = useCollectibleModalStyles();

  const { collectibleInfo, isLoading } = useCollectibleInfo(collectible.address, collectible.id.toString());

  const burnCollectible = useBurnCollectible(collectible);

  const { fa, creators, description, metadata, timestamp, royalties, supply, attributes, galleries, listings_active } =
    collectibleInfo;

  const purchaseCurrency = useMemo(() => {
    if (!isNonEmptyArray(listings_active)) {
      return {
        price: 0,
        contract: null,
        decimals: 0,
        id: null,
        symbol: ''
      };
    }

    const { price, currency_id } = listings_active[0];
    const currentCurrency = currencyInfoById[currency_id];

    return { price, ...currentCurrency };
  }, [collectibleInfo]);

  useEffect(() => {
    tezos.contract
      .at<ObjktBuyCollectibleContractInterface | FxHashBuyCollectibleContractInterface>(
        isNonEmptyArray(listings_active) ? listings_active[0].marketplace_contract : OBJKT_MARKETPLACE_CONTRACT
      )
      .then(setMarketplaceContract);
  }, [listings_active]);

  const handleSubmit = async () => {
    if (isUserOwnerCurrentCollectible) {
      return navigate(ModalsEnum.Send, { token: collectible });
    }

    const getTransferParams = () => {
      if (isDefined(marketplaceContract) && isNonEmptyArray(listings_active)) {
        const isTezosCurrency = listings_active[0].currency_id === 1;
        const params = isTezosCurrency
          ? { amount: purchaseCurrency.price, mutez: true, source: selectedAccount.publicKeyHash }
          : {};

        if (OBJKT_BUY_METHOD in marketplaceContract?.methods) {
          return [marketplaceContract.methods.fulfill_ask(listings_active[0].bigmap_key).toTransferParams(params)];
        } else {
          return [
            marketplaceContract.methods.listing_accept(1, listings_active[0].bigmap_key).toTransferParams(params)
          ];
        }
      }

      return [];
    };

    const transferParams = getTransferParams();

    const isTokenFa2 = listings_active[0].currency.type === Route3TokenStandardEnum.fa2;

    const token = {
      id: Number(purchaseCurrency.id),
      symbol: purchaseCurrency.symbol,
      standard: isTokenFa2 ? Route3TokenStandardEnum.fa2 : Route3TokenStandardEnum.fa12,
      contract: purchaseCurrency.contract,
      tokenId: `${purchaseCurrency.id}`,
      decimals: purchaseCurrency.decimals
    };

    const { approve, revoke } = await getTransferPermissions(
      tezos,
      listings_active[0].marketplace_contract ?? OBJKT_MARKETPLACE_CONTRACT,
      selectedAccount.publicKeyHash,
      token,
      new BigNumber(purchaseCurrency.price)
    );

    transferParams.unshift(...approve);
    transferParams.push(...revoke);

    const updatedTransferParams = transferParams
      .filter(params => isDefined(params))
      .map(item => ({ ...item, kind: OpKind.TRANSACTION, storageLimit: DEFAULT_OBJKT_STORAGE_LIMIT }));

    dispatch(
      navigateAction(ModalsEnum.Confirmation, {
        type: ConfirmationTypeEnum.InternalOperations,
        opParams: updatedTransferParams as ParamsWithKind[]
      })
    );
  };

  const filteredAttributes = attributes.filter(item => item.attribute.name !== BLURED_COLLECTIBLE_ATTRIBUTE_NAME);

  const isAttributesExist = filteredAttributes.length > 0;

  const segmentValues = isAttributesExist ? SEGMENT_VALUES : SEGMENT_VALUES.slice(1, 3);

  const propertiesIndex = segmentValues.findIndex(item => item === SegmentControlNamesEnum.Properties);
  const disabledOffers = segmentValues.findIndex(item => item === SegmentControlNamesEnum.Offers);

  const isPropertiesSelected = propertiesIndex === segmentControlIndex;

  usePageAnalytic(ModalsEnum.CollectibleModal);
  const { trackEvent } = useAnalytics();

  const handleCollectionNamePress = () => openUrl(objktCollectionUrl(collectible.address));

  const submitButtonTitle = useMemo(() => {
    if (isLoading) {
      return '...';
    }

    if (isUserOwnerCurrentCollectible) {
      return 'Send';
    }

    if (!isNonEmptyArray(listings_active)) {
      return 'Not listed';
    }

    const price = mutezToTz(new BigNumber(purchaseCurrency.price), purchaseCurrency.decimals);

    return `Buy for ${price.toFixed(2)} ${purchaseCurrency.symbol}`;
  }, [isUserOwnerCurrentCollectible, listings_active, isLoading]);

  const collectionLogo = useMemo(() => {
    if (fa.logo.endsWith('.svg')) {
      return (
        <SvgUri
          uri={fa.logo}
          height={COLLECTION_ICON_SIZE}
          width={COLLECTION_ICON_SIZE}
          style={styles.collectionLogo}
        />
      );
    }

    return <FastImage source={{ uri: formatImgUri(fa.logo) }} style={styles.collectionLogo} />;
  }, [fa.logo]);

  const handleShare = useCallback(async () => {
    try {
      const dynamicLink = await getTempleDynamicLink(
        `/nft?jsonData=${encodeURIComponent(JSON.stringify(collectible))}`,
        {
          title: collectible.name,
          descriptionText: description,
          imageUrl: formatImgUri(collectible.thumbnailUri, 'medium')
        }
      );
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
  }, [description]);

  return (
    <ScreenContainer
      fixedFooterContainer={{
        submitButton: (
          <ButtonLargePrimary
            disabled={isLoading || (!isUserOwnerCurrentCollectible && !isNonEmptyArray(listings_active))}
            title={submitButtonTitle}
            onPress={handleSubmit}
            testID={CollectibleModalSelectors.sendButton}
          />
        )
      }}
      isFullScreenMode={true}
    >
      <ScrollView>
        <ModalStatusBar />

        <View>
          <CollectibleIcon
            collectible={collectible}
            size={itemWidth}
            iconSize={CollectibleIconSize.BIG}
            blurLayoutTheme={ImageBlurOverlayThemesEnum.fullView}
            isLoading={isLoading}
          />

          <Divider size={formatSize(12)} />

          <View style={styles.collectionContainer}>
            <TouchableOpacity onPress={handleCollectionNamePress} style={styles.collection}>
              {isDefined(fa.logo) ? collectionLogo : <View style={[styles.collectionLogo, styles.logoFallBack]} />}

              <Text numberOfLines={1} {...getTruncatedProps(styles.collectionName)}>
                {isNonEmptyArray(galleries) ? galleries[0].gallery.name : fa.name}
              </Text>
            </TouchableOpacity>

            {isString(description) && (
              <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                <Icon name={IconNameEnum.Share} />
                <Divider size={formatSize(4)} />
                <Text style={styles.shareButtonText}>Share</Text>
              </TouchableOpacity>
            )}
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

          {!isLoading && (
            <TextSegmentControl
              selectedIndex={segmentControlIndex}
              values={segmentValues}
              onChange={setSegmentControlIndex}
              disabledIndexes={[disabledOffers]}
              style={styles.segmentControl}
            />
          )}

          {!isLoading && isPropertiesSelected && (
            <CollectibleProperties
              contract={collectible.address}
              tokenId={collectible.id}
              editions={supply}
              metadata={metadata}
              minted={timestamp}
              owned={collectible.balance}
              royalties={royalties}
            />
          )}

          {!isLoading && !isPropertiesSelected && isAttributesExist && (
            <CollectibleAttributes attributes={filteredAttributes} />
          )}

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
        </View>
      </ScrollView>
    </ScreenContainer>
  );
};
