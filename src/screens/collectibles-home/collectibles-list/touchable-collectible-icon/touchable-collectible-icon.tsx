import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native';

import { CollectibleIcon } from '../../../../components/collectible-icon/collectible-icon';
import { CollectibleIconProps } from '../../../../components/collectible-icon/collectible-icon.props';
import { ModalsEnum } from '../../../../navigator/enums/modals.enum';
import { useNavigation } from '../../../../navigator/hooks/use-navigation.hook';
import { isDefined } from '../../../../utils/is-defined';

export const TouchableCollectibleIcon: FC<CollectibleIconProps> = ({ collectible, size }) => {
  const { navigate } = useNavigation();

  return isDefined(collectible) ? (
    <TouchableOpacity onPress={() => navigate(ModalsEnum.CollectibleModal, { collectible })}>
      <CollectibleIcon collectible={collectible} size={size} />
    </TouchableOpacity>
  ) : null;
};
