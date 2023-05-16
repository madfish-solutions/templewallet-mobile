import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { isDefined } from 'src/utils/is-defined';

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
