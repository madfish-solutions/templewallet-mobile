import { isNonEmptyArray } from '@apollo/client/utilities';
import { RouteProp, useRoute } from '@react-navigation/core';
import React, { useState } from 'react';
import { Dimensions, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsContainer } from '../../components/button/buttons-container/buttons-container';
import { CollectibleIcon } from '../../components/collectible-icon/collectible-icon';
import { CollectibleIconSize } from '../../components/collectible-icon/collectible-icon.props';
import { Divider } from '../../components/divider/divider';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { LinkWithIcon } from '../../components/link-with-icon/link-with-icon';
import { ModalStatusBar } from '../../components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { TextSegmentControl } from '../../components/segmented-control/text-segment-control/text-segment-control';
import { useCollectibleInfo } from '../../hooks/use-collectible-info.hook';
import { ModalsEnum, ModalsParamList } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { formatSize } from '../../styles/format-size';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { formatImgUri } from '../../utils/image.utils';
import { isDefined } from '../../utils/is-defined';
import { isString } from '../../utils/is-string';
import { openUrl } from '../../utils/linking.util';
import { objktCollectionUrl } from '../../utils/objkt-collection-url.util';
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

const SEGMENT_CONTROL_PROPERTY_SELECTED = 0;

export const CollectibleModal = () => {
  const { collectible } = useRoute<RouteProp<ModalsParamList, ModalsEnum.CollectibleModal>>().params;

  const { width } = Dimensions.get('window');
  const itemWidth = width - 32;

  const { navigate } = useNavigation();

  const [segmentControlIndex, setSegmentControlIndex] = useState(0);
  const isPropertySelected = segmentControlIndex === SEGMENT_CONTROL_PROPERTY_SELECTED;

  const styles = useCollectibleModalStyles();

  const { collectibleInfo, isLoading } = useCollectibleInfo(collectible.address, collectible.id.toString());
  const { fa, creators, description, metadata, timestamp, royalties, supply, attributes } = collectibleInfo;
  const isAttributesExist = attributes.length > 0;

  usePageAnalytic(ModalsEnum.CollectibleModal);

  const handleCollectionNamePress = () => openUrl(objktCollectionUrl(collectible.address));

  return (
    <ScreenContainer isFullScreenMode={true}>
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
            {fa.name}
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
                  {
                    ...(creators.length > 0 && creators.length !== index + 1 && { marginRight: formatSize(6) })
                  }
                ]}
              />
            ))}
          </View>
        )}

        <TextSegmentControl
          selectedIndex={segmentControlIndex}
          values={[
            isAttributesExist ? SegmentControlNamesEnum.Attributes : '',
            SegmentControlNamesEnum.Properties,
            SegmentControlNamesEnum.Offers
          ]}
          onChange={setSegmentControlIndex}
          disabledIndexes={[2]}
          style={styles.segmentControl}
        />

        {!isLoading && isPropertySelected && (
          <CollectibleProperties
            contract={collectible.address}
            tokenId={collectible.id}
            editions={supply}
            metadata={metadata}
            minted={timestamp}
            owned={collectible.balance}
            royalties={royalties}
            style={styles.marginBottom}
          />
        )}
        {!isLoading && !isPropertySelected && isAttributesExist && (
          <CollectibleAttributes attributes={attributes} style={styles.marginBottom} />
        )}
      </View>

      <View>
        <ButtonsContainer>
          <ButtonLargePrimary
            title="Send"
            onPress={() => navigate(ModalsEnum.Send, { token: collectible })}
            testID={CollectibleModalSelectors.sendButton}
          />
        </ButtonsContainer>

        <InsetSubstitute type="bottom" />
      </View>
    </ScreenContainer>
  );
};
