import { RouteProp, useRoute } from '@react-navigation/core';
import React, { useCallback } from 'react';
import { Dimensions, Share, View } from 'react-native';

import { ButtonMedium } from '../../components/button/button-medium/button-medium';
import { ButtonsContainer } from '../../components/button/buttons-container/buttons-container';
import { CollectibleIcon } from '../../components/collectible-icon/collectible-icon';
import { CollectibleIconSize } from '../../components/collectible-icon/collectible-icon.props';
import { Divider } from '../../components/divider/divider';
import { HeaderTitle } from '../../components/header/header-title/header-title';
import { useNavigationSetOptions } from '../../components/header/use-navigation-set-options.hook';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { ModalStatusBar } from '../../components/modal-status-bar/modal-status-bar';
import { PublicKeyHashText } from '../../components/public-key-hash-text/public-key-hash-text';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { ModalsEnum, ModalsParamList } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { formatSize } from '../../styles/format-size';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { getTempleDynamicLink } from '../../utils/get-temple-dynamic-link.util';
import { formatImgUri } from '../../utils/image.utils';
import { CollectibleInfoItem } from './collectible-info-item/collectible-info-item';
import { CollectibleModalSelectors } from './collectible-modal.selectors';

const SHARE_NFT_CONTENT = 'View NFT with Temple Wallet mobile: ';

export const CollectibleModal = () => {
  const { collectible } = useRoute<RouteProp<ModalsParamList, ModalsEnum.CollectibleModal>>().params;
  const { width } = Dimensions.get('window');
  const itemWidth = width - 32;
  const { navigate } = useNavigation();

  usePageAnalytic(ModalsEnum.CollectibleModal);

  useNavigationSetOptions({ headerTitle: () => <HeaderTitle title={collectible.name} /> }, [collectible]);

  const handleShare = useCallback(async () => {
    await Share.share({
      message:
        SHARE_NFT_CONTENT +
        (await getTempleDynamicLink(`/nft?jsonData=${encodeURIComponent(JSON.stringify(collectible))}`, {
          title: collectible.name,
          descriptionText: 'NFT description',
          imageUrl: formatImgUri(collectible.thumbnailUri, 'medium')
        }))
    });
  }, []);

  return (
    <ScreenContainer isFullScreenMode={true}>
      <ModalStatusBar />
      <View>
        <CollectibleIcon collectible={collectible} size={itemWidth} iconSize={CollectibleIconSize.BIG} />
        <Divider size={formatSize(16)} />
        <CollectibleInfoItem name="Name">{collectible.name}</CollectibleInfoItem>
        <CollectibleInfoItem name="Amount">{collectible.balance}</CollectibleInfoItem>
        <CollectibleInfoItem name="Address">
          <PublicKeyHashText publicKeyHash={collectible.address} />
        </CollectibleInfoItem>
        <CollectibleInfoItem name="ID">{collectible.id}</CollectibleInfoItem>
      </View>
      <View>
        <ButtonsContainer>
          <ButtonMedium title="Share" iconName={IconNameEnum.Share} onPress={handleShare} />
          <Divider />
          <ButtonMedium
            title="Send"
            iconName={IconNameEnum.ArrowUp}
            onPress={() => navigate(ModalsEnum.Send, { token: collectible })}
            testID={CollectibleModalSelectors.sendButton}
          />
        </ButtonsContainer>

        <InsetSubstitute type="bottom" />
      </View>
    </ScreenContainer>
  );
};
