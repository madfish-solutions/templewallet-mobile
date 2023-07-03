import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { Farm } from 'src/apis/quipuswap-staking/types';
import { Divider } from 'src/components/divider/divider';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { ThemesEnum } from 'src/interfaces/theme.enum';
import { UserStakeValueInterface } from 'src/store/farms/state';
import { useThemeSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';

import { DetailsCard } from '../details-card';
import { useDetailsSectionStyles } from './styles';

interface Props {
  farm: Farm;
  stake?: UserStakeValueInterface;
  shouldShowClaimRewardsButton: boolean;
  loading: boolean;
}

export const DetailsSection: FC<Props> = ({ farm, stake, shouldShowClaimRewardsButton, loading }) => {
  const theme = useThemeSelector();
  const styles = useDetailsSectionStyles();

  return (
    <>
      <View style={styles.detailsTitle}>
        <View style={styles.farmTypeIconWrapper}>
          <Icon
            name={theme === ThemesEnum.dark ? IconNameEnum.QuipuSwapDark : IconNameEnum.QuipuSwap}
            size={formatSize(16)}
          />
        </View>
        <Divider size={formatSize(8)} />
        <Text style={styles.detailsTitleText}>Quipuswap Farming Details</Text>
      </View>

      <Divider size={formatSize(16)} />

      <DetailsCard
        farm={farm}
        stake={stake}
        shouldShowClaimRewardsButton={shouldShowClaimRewardsButton}
        loading={loading}
      />
    </>
  );
};
