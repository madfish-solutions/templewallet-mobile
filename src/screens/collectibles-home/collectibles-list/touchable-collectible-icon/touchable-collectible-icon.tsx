import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native';

import { CollectibleIcon } from 'src/components/collectible-icon/collectible-icon';
import { CollectibleIconProps, CollectibleIconSize } from 'src/components/collectible-icon/collectible-icon.props';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { isDefined } from 'src/utils/is-defined';

export const TouchableCollectibleIcon: FC<CollectibleIconProps> = ({ collectible, size }) => {
  const { navigate } = useNavigation();

  const handleNavigate = () => navigate(ModalsEnum.CollectibleModal, { collectible });

  return isDefined(collectible) ? (
    <TouchableOpacity onPress={handleNavigate}>
      <CollectibleIcon
        iconSize={CollectibleIconSize.SMALL}
        collectible={collectible}
        size={size}
        isTouchableOverlay={false}
      />
    </TouchableOpacity>
  ) : null;
};
