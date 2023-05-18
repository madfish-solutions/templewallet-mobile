import { isNonEmptyArray } from '@apollo/client/utilities';
import { RouteProp, useRoute } from '@react-navigation/core';
import { BigNumber } from 'bignumber.js';
import React, { useCallback, useMemo, useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ScrollView } from 'react-native-gesture-handler';

import { currencyInfoById } from '../../apis/objkt/constants';
import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { CollectibleIcon } from '../../components/collectible-icon/collectible-icon';
import { CollectibleIconSize } from '../../components/collectible-icon/collectible-icon.props';
import { Divider } from '../../components/divider/divider';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { LinkWithIcon } from '../../components/link-with-icon/link-with-icon';
import { ModalStatusBar } from '../../components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { TextSegmentControl } from '../../components/segmented-control/text-segment-control/text-segment-control';
import { TouchableWithAnalytics } from '../../components/touchable-with-analytics';
import { Route3TokenStandardEnum } from '../../enums/route3.enum';
import { useCollectibleInfo } from '../../hooks/collectible-info/use-collectible-info.hook';
import { useBurnCollectible } from '../../hooks/use-burn-collectible.hook';
import { useBuyCollectible } from '../../hooks/use-buy-collectible.hook';
import { ModalsEnum, ModalsParamList } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useCollectiblesListSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { getTokenSlug } from '../../token/utils/token.utils';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { conditionalStyle } from '../../utils/conditional-style';
import { formatImgUri } from '../../utils/image.utils';
import { isDefined } from '../../utils/is-defined';
import { isString } from '../../utils/is-string';
import { openUrl } from '../../utils/linking.util';
import { objktCollectionUrl } from '../../utils/objkt-collection-url.util';
import { mutezToTz } from '../../utils/tezos.util';
import { CollectibleModalSelectors } from './collectible-modal.selectors';
import { useCollectibleModalStyles } from './collectible-modal.styles';
import { CollectibleAttributes } from './components/collectible-attributes/collectible-attributes';
import { CollectibleProperties } from './components/collectible-properties/collectible-properties';
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

export const CollectibleModal = () => {
  const { collectible } = useRoute<RouteProp<ModalsParamList, ModalsEnum.CollectibleModal>>().params;

  const { width } = Dimensions.get('window');
  const itemWidth = width - 32;

  const { navigate } = useNavigation();

  const collectibles = useCollectiblesListSelector();

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
  }, [listings_active]);

  const handleBuyCollectible = useBuyCollectible({
    bigmapKey: isNonEmptyArray(listings_active) ? listings_active[0].bigmap_key : 0,
    marketplace: isNonEmptyArray(listings_active) ? listings_active[0].marketplace_contract : '',
    tokenToSpend: {
      id: 0,
      contract: purchaseCurrency.contract,
      tokenId: purchaseCurrency.id,
      decimals: collectible.decimals,
      standard: Route3TokenStandardEnum.fa2,
      symbol: purchaseCurrency.symbol
    }
  });

  const isAttributesExist = attributes.length > 0;

  const segmentValues = isAttributesExist ? SEGMENT_VALUES : SEGMENT_VALUES.slice(1, 3);

  const propertiesIndex = segmentValues.findIndex(item => item === SegmentControlNamesEnum.Properties);
  const disabledOffers = segmentValues.findIndex(item => item === SegmentControlNamesEnum.Offers);

  const isPropertiesSelected = propertiesIndex === segmentControlIndex;

  usePageAnalytic(ModalsEnum.CollectibleModal);

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

  const handleSubmitButton = useCallback(() => {
    if (isUserOwnerCurrentCollectible) {
      return navigate(ModalsEnum.Send, { token: collectible });
    }

    return handleBuyCollectible;
  }, []);

  return (
    <ScreenContainer
      fixedFooterContainer={{
        submitButton: (
          <ButtonLargePrimary
            disabled={isLoading || (!isUserOwnerCurrentCollectible && !isNonEmptyArray(listings_active))}
            title={submitButtonTitle}
            onPress={handleSubmitButton}
            testID={CollectibleModalSelectors.sendButton}
          />
        )
      }}
      isFullScreenMode={true}
    >
      <ScrollView>
        <ModalStatusBar />

        <View>
          <CollectibleIcon collectible={collectible} size={itemWidth} iconSize={CollectibleIconSize.BIG} />

          <Divider size={formatSize(12)} />

          <TouchableOpacity onPress={handleCollectionNamePress} style={styles.collection}>
            {isDefined(fa.logo) ? (
              <FastImage style={styles.collectionLogo} source={{ uri: formatImgUri(fa.logo) }} />
            ) : (
              <View style={[styles.collectionLogo, styles.logoFallBack]} />
            )}

            <Text numberOfLines={1} style={styles.collectionName}>
              {isNonEmptyArray(galleries) ? galleries[0].gallery.name : fa.name}
            </Text>
          </TouchableOpacity>

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
              <Text style={styles.creatorsText}>Creators:</Text>

              {creators.map(({ holder }, index) => (
                <LinkWithIcon
                  key={holder.address}
                  text={isString(holder.tzdomain) ? holder.tzdomain : holder.address}
                  link={getObjktProfileLink(holder.address)}
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
            <CollectibleAttributes attributes={attributes} />
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
