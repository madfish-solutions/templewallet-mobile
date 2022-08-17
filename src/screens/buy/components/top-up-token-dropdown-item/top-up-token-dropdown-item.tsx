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
import { getProperNetworkFullName } from '../../crypto/exolix/initial-step/initial-step.utils';
import { useTopUpTokenDropdownItemStyles } from './top-up-token-dropdown-item.styles';

interface Props {
  token: CurrenciesInterface;
  actionIconName?: IconNameEnum;
  iconSize?: number;
  isDropdownClosed?: boolean;
}

export const TopUpTokenDropdownItem: FC<Props> = ({
  token,
  actionIconName,
  iconSize = formatSize(40),
  isDropdownClosed = false
}) => {
  const styles = useTopUpTokenDropdownItemStyles();

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

  const tokenNetworkFullName = useMemo(() => getProperNetworkFullName(token), [token]);

  return (
    <View style={[styles.row, styles.height40]}>
      {tokenIcon}

      <Divider size={formatSize(8)} />

      <View style={styles.infoContainer}>
        <View style={[styles.row, styles.justifySpaceBetween]}>
          <View style={styles.row}>
            <Text {...getTruncatedProps(styles.textRegular15)}>{token.code}</Text>
            <Divider size={formatSize(8)} />
            {!isDropdownClosed && (
              <Text {...getTruncatedProps([styles.textRegular11, isDropdownClosed && styles.colorGray1])}>
                {token.name}
              </Text>
            )}
          </View>
          {isDefined(actionIconName) && <Icon name={actionIconName} size={formatSize(24)} />}
        </View>

        <View style={styles.row}>
          <Text {...getTruncatedProps(styles.textRegular13)}>
            {isDropdownClosed ? token.networkShortName ?? tokenNetworkFullName : tokenNetworkFullName}
          </Text>

          <Divider size={formatSize(4)} />
        </View>
      </View>
    </View>
  );
};

export const renderTopUpTokenListItem: DropdownListItemComponent<CurrenciesInterface> = ({ item, isSelected }) => (
  <TopUpTokenDropdownItem token={item} actionIconName={isSelected ? IconNameEnum.Check : undefined} />
);
