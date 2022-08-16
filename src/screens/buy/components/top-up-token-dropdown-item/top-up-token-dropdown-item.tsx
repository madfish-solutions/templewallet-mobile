import React, { FC, useMemo } from 'react';
import { Text, View } from 'react-native';

import { Divider } from '../../../../components/divider/divider';
import { DropdownListItemComponent } from '../../../../components/dropdown/dropdown';
import { Icon } from '../../../../components/icon/icon';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { StaticTokenIcon } from '../../../../components/static-token-icon/static-token-icon';
import { CurrenciesInterface } from '../../../../interfaces/exolix.interface';
import { formatSize } from '../../../../styles/format-size';
import { isDefined } from '../../../../utils/is-defined';
import { getTruncatedProps } from '../../../../utils/style.util';
import { useTopUpTokenDropdownItemStyles } from './top-up-token-dropdown-item.styles';

interface Props {
  token: CurrenciesInterface;
  actionIconName?: IconNameEnum;
  iconSize?: number;
}

export const TopUpTokenDropdownItem: FC<Props> = ({ token, actionIconName, iconSize = formatSize(40) }) => {
  const styles = useTopUpTokenDropdownItemStyles();

  const isDropdownClosed = isDefined(actionIconName);

  const tokenIcon = useMemo(() => {
    switch (token.code) {
      case 'UAH':
        return <Icon name={IconNameEnum.Uah} size={iconSize} />;
      case 'XTZ':
        return <Icon name={IconNameEnum.TezToken} size={iconSize} />;
      default:
        return <StaticTokenIcon uri={token.icon} size={iconSize} />;
    }
  }, [token]);

  return (
    <View style={styles.container}>
      {tokenIcon}

      <Divider size={formatSize(8)} />

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text {...getTruncatedProps(styles.symbol)}>{token.code}</Text>
          <View style={styles.rightContainer}>
            <Divider size={formatSize(4)} />
            {isDropdownClosed ? (
              <Icon name={actionIconName} size={formatSize(24)} />
            ) : (
              <Text {...getTruncatedProps(styles.name)}>{token.name}</Text>
            )}
          </View>
        </View>

        <View style={styles.infoRow}>
          {isDropdownClosed ? (
            <Text {...getTruncatedProps(styles.name)}>{token.networkShortName ?? token.network}</Text>
          ) : (
            <Text {...getTruncatedProps(styles.name)}>{token.networkFullName}</Text>
          )}

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
