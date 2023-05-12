import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { isDefined } from '../../utils/is-defined';
import { Divider } from '../divider/divider';
import { Icon } from '../icon/icon';
import { IconNameEnum } from '../icon/icon-name.enum';
import { useDelegateDisclaimerStyles } from './delegate-disclaimer.styles';

interface Props {
  title: string;
  text: string;
}

export const DelegateDisclaimer: FC<Props> = ({ title, text }) => {
  const colors = useColors();
  const styles = useDelegateDisclaimerStyles();

  return (
    <View style={styles.container}>
      <Icon name={IconNameEnum.AlertCircle} style={styles.icon} color={colors.blue} />
      <Divider size={formatSize(8)} />
      <View style={styles.content}>
        {isDefined(title) && <Text style={styles.title}>{title}</Text>}
        <Text style={styles.text}>{text}</Text>
      </View>
    </View>
  );
};
