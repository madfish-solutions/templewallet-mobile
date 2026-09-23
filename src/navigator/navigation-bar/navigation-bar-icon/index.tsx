import { FC } from 'react';
import { ColorValue, StyleSheet } from 'react-native';

import { formatSize } from 'src/styles/format-size';

import { NavigationBarIconNameEnum } from './icon-name.enum';
import { NavigationBarIconNameMap } from './icon-name.map';

interface Props {
  name: NavigationBarIconNameEnum;
  color?: ColorValue;
}

export const NavigationBarIcon: FC<Props> = ({ name, color }) => {
  const Icon = NavigationBarIconNameMap[name];

  return <Icon color={color} width={formatSize(24)} height={formatSize(24)} style={styles.icon} />;
};

const styles = StyleSheet.create({
  icon: {
    margin: formatSize(2)
  }
});
