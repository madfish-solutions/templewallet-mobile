import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { Divider } from '../../../../components/divider/divider';
import { DropdownListItemComponent } from '../../../../components/dropdown/dropdown';
import { Icon } from '../../../../components/icon/icon';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { StaticTokenIcon } from '../../../../components/static-token-icon/static-token-icon';
import { CurrenciesInterface } from '../../../../interfaces/exolix.interface';
import { formatSize } from '../../../../styles/format-size';
import { TOPUP_TOKENS } from '../../../../utils/exolix.util';
import { isDefined } from '../../../../utils/is-defined';
import { getTruncatedProps } from '../../../../utils/style.util';
import { initialData } from '../../crypto/exolix/initial-step/initial-step.data';
import { useTopUpTokenDropdownItemStyles } from './top-up-token-dropdown-item.styles';

interface Props {
  token?: CurrenciesInterface;
  actionIconName?: IconNameEnum;
  iconSize?: number;
}

export const TopUpTokenDropdownItem: FC<Props> = ({ token, actionIconName, iconSize = formatSize(40) }) => {
  const styles = useTopUpTokenDropdownItemStyles();

  const topupIcon = TOPUP_TOKENS.find(
    x => x.code === (isDefined(token) ? token.code : initialData.coinFrom.asset.code)
  );

  if (!isDefined(token)) {
    return (
      <View style={styles.container}>
        <Icon name={IconNameEnum.TezToken} size={iconSize} />
        <Divider size={formatSize(8)} />

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.name}>Select</Text>
            <View style={styles.rightContainer}>
              <Divider size={formatSize(4)} />
              {isDefined(actionIconName) && <Icon name={actionIconName} size={formatSize(24)} />}
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.name}>Token</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!isDefined(topupIcon) ? (
        token.code === 'UAH' ? (
          <Icon name={IconNameEnum.Uah} size={iconSize} />
        ) : (
          <Icon name={IconNameEnum.TezToken} size={iconSize} />
        )
      ) : (
        <StaticTokenIcon source={topupIcon.icon} size={iconSize} />
      )}
      <Divider size={formatSize(8)} />

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text {...getTruncatedProps(styles.symbol)}>{token.code}</Text>
          <View style={styles.rightContainer}>
            <Divider size={formatSize(4)} />
            {isDefined(actionIconName) && <Icon name={actionIconName} size={formatSize(24)} />}
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text {...getTruncatedProps(styles.name)}>{token.name}</Text>

          <View style={styles.rightContainer}>
            <Divider size={formatSize(4)} />
          </View>
        </View>
      </View>
    </View>
  );
};

export const renderTopUpTokenListItem: DropdownListItemComponent<CurrenciesInterface> = ({ item, isSelected }) => (
  <TopUpTokenDropdownItem token={item} {...(isSelected && { actionIconName: IconNameEnum.Check })} />
);
