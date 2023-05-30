import React, { FC } from 'react';
import { TouchableOpacity } from 'react-native';

import { CollectibleIcon } from 'src/components/collectible-icon/collectible-icon';
import { CollectibleIconProps, CollectibleIconSize } from 'src/components/collectible-icon/collectible-icon.props';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { isDefined } from 'src/utils/is-defined';

import { useCollectibleInfo } from '../../../../hooks/collectible-info/use-collectible-info.hook';

export const TouchableCollectibleIcon: FC<CollectibleIconProps> = ({ collectible, size }) => {
  const { navigate } = useNavigation();
  const { collectibleInfo } = useCollectibleInfo(collectible.address, collectible.id.toString());

  return isDefined(collectible) ? (
    <TouchableOpacity onPress={() => navigate(ModalsEnum.CollectibleModal, { collectible })}>
      <CollectibleIcon
        mime={collectibleInfo.mime}
        objktArtifact={collectibleInfo.artifact_uri}
        iconSize={CollectibleIconSize.SMALL}
        collectible={collectible}
        size={size}
      />
    </TouchableOpacity>
  ) : null;
};
