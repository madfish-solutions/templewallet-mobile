import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';

import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { formatSize } from '../../../styles/format-size';
import { openUrl } from '../../../utils/linking.util';
import { useSocialButtonStyles } from './social-button.styles';

interface Props {
  iconName: IconNameEnum;
  url: string;
}

export const SocialButton: FC<Props> = ({ iconName, url }) => {
  const styles = useSocialButtonStyles();

  return (
    <TouchableOpacity style={styles.container} onPress={() => openUrl(url)}>
      <Icon name={iconName} size={formatSize(24)} />
    </TouchableOpacity>
  );
};
