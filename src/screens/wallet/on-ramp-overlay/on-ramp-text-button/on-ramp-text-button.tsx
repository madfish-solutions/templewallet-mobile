import { TouchableOpacity } from '@gorhom/bottom-sheet';
import React, { FC } from 'react';
import { Text, TouchableWithoutFeedbackProps } from 'react-native';

import { TestIdProps } from 'src/interfaces/test-id.props';
import { setTestID } from 'src/utils/test-id.utils';

import { Divider } from '../../../../components/divider/divider';
import { Icon } from '../../../../components/icon/icon';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { formatSize } from '../../../../styles/format-size';
import { isDefined } from '../../../../utils/is-defined';

import { useOnRampTextButtonStyles } from './on-ramp-text-button.styles';

interface Props extends Pick<TouchableWithoutFeedbackProps, 'onPress'>, TestIdProps {
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
