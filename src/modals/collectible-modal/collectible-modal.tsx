import { RouteProp, useRoute } from '@react-navigation/core';
import React from 'react';
import { View } from 'react-native';

import { ButtonMedium } from '../../components/button/button-medium/button-medium';
import { ButtonsContainer } from '../../components/button/buttons-container/buttons-container';
import { CollectibleIcon } from '../../components/collectible-icon/collectible-icon';
import { Divider } from '../../components/divider/divider';
import { HeaderTitle } from '../../components/header/header-title/header-title';
import { useNavigationSetOptions } from '../../components/header/use-navigation-set-options.hook';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { ModalStatusBar } from '../../components/modal-status-bar/modal-status-bar';
import { PublicKeyHashText } from '../../components/public-key-hash-text/public-key-hash-text';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { useLayoutSizes } from '../../hooks/use-layout-sizes.hook';
import { ModalsEnum, ModalsParamList } from '../../navigator/enums/modals.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { formatSize } from '../../styles/format-size';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';
import { CollectibleInfoItem } from './collectible-info-item/collectible-info-item';

export const CollectibleModal = () => {
  const { collectible } = useRoute<RouteProp<ModalsParamList, ModalsEnum.CollectibleModal>>().params;
  const { layoutWidth, handleLayout } = useLayoutSizes();
  const { navigate } = useNavigation();

  usePageAnalytic(ModalsEnum.CollectibleModal);

  useNavigationSetOptions({ headerTitle: () => <HeaderTitle title={collectible.name} /> }, [collectible]);

  return (
    <ScreenContainer isFullScreenMode={true}>
      <ModalStatusBar />
      <View onLayout={handleLayout}>
        <CollectibleIcon collectible={collectible} size={layoutWidth} />
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
          <ButtonMedium
            title="Send"
            iconName={IconNameEnum.ArrowUp}
            onPress={() => navigate(ModalsEnum.Send, { token: collectible })}
          />
        </ButtonsContainer>

        <InsetSubstitute type="bottom" />
      </View>
    </ScreenContainer>
  );
};
