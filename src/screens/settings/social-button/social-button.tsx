import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';

import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { formatSize } from '../../../styles/format-size';
import { useSocialButtonStyles } from './social-button.styles';

interface Props {
  iconName: IconNameEnum;
  url: string;
}

export const SocialButton: FC<Props> = ({ iconName }) => {
  const styles = useSocialButtonStyles();

  return (
    <TouchableOpacity style={styles.container} onPress={() => null}>
      <Icon name={iconName} size={formatSize(24)} />
    </TouchableOpacity>
  );
};
