import React, { FC } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { AssetValueText } from '../../../components/asset-value-text/asset-value-text';
import { Divider } from '../../../components/divider/divider';
import { Icon } from '../../../components/icon/icon';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { useSirsToken } from '../../../hooks/use-sirs-token.hook';
import { ScreensEnum } from '../../../navigator/enums/screens.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { formatSize } from '../../../styles/format-size';
import { isDefined } from '../../../utils/is-defined';
import { useIntegratedDAppStyles } from './integrated.styles';

interface Props {
  screenName: ScreensEnum.LiquidityBakingDapp;
  iconName: IconNameEnum;
  title: string;
  description?: string;
}

export const IntegratedDApp: FC<Props> = ({ screenName, iconName, title, description }) => {
  const { navigate } = useNavigation();
  const { sirsToken, isSirsBalance } = useSirsToken();

  const styles = useIntegratedDAppStyles();

  return (
    <TouchableOpacity style={styles.container} onPress={() => navigate(screenName)}>
      <Icon name={iconName} width={formatSize(46)} height={formatSize(46)} />
      <Divider size={formatSize(16)} />
      <View>
        <Text style={styles.title}>{title}</Text>
        {isDefined(sirsToken) && isSirsBalance ? (
          <View style={styles.balanceWrapper}>
            <Text style={[styles.balance, styles.descriptionOrange]}>Balance:</Text>
            <AssetValueText asset={sirsToken} amount={sirsToken.balance} style={styles.descriptionOrange} />
          </View>
        ) : (
          <Text style={styles.descriptionGrey}>{description}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
