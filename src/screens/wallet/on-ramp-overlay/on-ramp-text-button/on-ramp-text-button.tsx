import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { Text, TouchableOpacityProps } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { formatSize } from 'src/styles/format-size';
import { isDefined } from 'src/utils/is-defined';
import { setTestID } from 'src/utils/test-id.utils';

import { useOnRampTextButtonStyles } from './on-ramp-text-button.styles';

interface Props extends Pick<TouchableOpacityProps, 'onPress'>, TestIdProps {
  title: string;
  iconName?: IconNameEnum;
}

export const OnRampTextButton: FC<Props> = ({ title, iconName, onPress, testID }) => {
  const styles = useOnRampTextButtonStyles();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} {...setTestID(testID)}>
      <Text style={styles.title}>{title}</Text>
      <Divider size={formatSize(4)} />
      {isDefined(iconName) && <Icon name={IconNameEnum.DetailsArrowRight} size={formatSize(10)} />}
    </TouchableOpacity>
  );
};
