import { isNonEmptyArray } from '@apollo/client/utilities';
import { RouteProp, useRoute } from '@react-navigation/core';
import React from 'react';
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
import { useCollectibleInfo } from '../../hooks/use-collectible-info.hook';
import { ModalsEnum, ModalsParamList } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { formatSize } from '../../styles/format-size';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { formatImgUri } from '../../utils/image.utils';
import { isString } from '../../utils/is-string';
import { openUrl } from '../../utils/linking.util';
import { CollectibleModalSelectors } from './collectible-modal.selectors';
import { useCollectibleModalStyles } from './collectible-modal.styles';

const navigateToCollection = (address: string) => openUrl(`https://objkt.com/collection/${address}`);

export const CollectibleModal = () => {
  const { collectible } = useRoute<RouteProp<ModalsParamList, ModalsEnum.CollectibleModal>>().params;
  const { width } = Dimensions.get('window');
  const itemWidth = width - 32;
  const { navigate } = useNavigation();
  const styles = useCollectibleModalStyles();

  const { collectibleInfo } = useCollectibleInfo(collectible.address, collectible.id.toString());
  const { collection, creators, description } = collectibleInfo;

  usePageAnalytic(ModalsEnum.CollectibleModal);

  const handleCollectionNamePress = () => navigateToCollection(collectible.address);

  return (
    <ScreenContainer isFullScreenMode={true}>
      <ModalStatusBar />

      <View>
        <CollectibleIcon collectible={collectible} size={itemWidth} iconSize={CollectibleIconSize.BIG} />

        <Divider size={formatSize(12)} />

        <TouchableOpacity onPress={handleCollectionNamePress} style={styles.collection}>
          {collection.logo ? (
            <FastImage style={styles.collectionLogo} source={{ uri: formatImgUri(collection.logo) }} />
          ) : (
            <View style={[styles.collectionLogo, styles.logoFallBack]} />
          )}

          <Text numberOfLines={1} style={styles.collectionName}>
            {collection.name}
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
                text={isString(holder.tzdomain) ? holder.tzdomain : holder.address}
                userAddress={holder.address}
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
