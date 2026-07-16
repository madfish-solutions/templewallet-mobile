import { View } from 'react-native';

import { CryptoLogo } from 'src/components/crypto-logo';
import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { formatSize } from 'src/styles/format-size';

import { useNetworkIconStyles } from './styles';

interface NetworkIconProps {
  iconName: CryptoLogoNameEnum;
}

export const NetworkIcon = ({ iconName }: NetworkIconProps) => {
  const styles = useNetworkIconStyles();

  return (
    <View style={styles.root}>
      <CryptoLogo name={iconName} size={formatSize(28)} />
    </View>
  );
};
