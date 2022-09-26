import React, { FC, useMemo } from 'react';
import { Text, View } from 'react-native';

import { Divider } from '../../../../components/divider/divider';
import { DropdownListItemComponent } from '../../../../components/dropdown/dropdown';
import { Icon } from '../../../../components/icon/icon';
import { IconNameEnum } from '../../../../components/icon/icon-name.enum';
import { StaticTokenIcon } from '../../../../components/static-token-icon/static-token-icon';
import { TopUpInputInterface } from '../../../../interfaces/topup.interface';
import { formatSize } from '../../../../styles/format-size';
import { isDefined } from '../../../../utils/is-defined';
import { getTruncatedProps } from '../../../../utils/style.util';
import { getProperNetworkFullName } from '../../crypto/exolix/steps/initial-step/initial-step.utils';
import { useTopUpTokenDropdownItemStyles } from './top-up-token-dropdown-item.styles';

interface Props {
  token?: TopUpInputInterface;
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
    if (token?.code === 'UAH' && token?.name === 'Hryvnia') {
      return <Icon name={IconNameEnum.Uah} size={iconSize} />;
    } else if (token?.code === 'XTZ') {
      return <Icon name={IconNameEnum.TezToken} size={iconSize} />;
    } else {
      return <StaticTokenIcon uri={token?.icon} size={iconSize} />;
    }
  }, [token]);

  return (
    <View style={[styles.row, styles.height40]}>
      {tokenIcon}

      <Divider size={formatSize(8)} />

      <View style={styles.infoContainer}>
        <View style={[styles.row, styles.justifySpaceBetween]}>
          <View style={styles.row}>
            <Text {...getTruncatedProps(token?.name === '' ? styles.textRegular17 : styles.textRegular15)}>
              {token?.code}
            </Text>
            <Divider size={formatSize(8)} />
            {!isDropdownClosed && (
              <Text {...getTruncatedProps([styles.textRegular11, isDropdownClosed && styles.colorGray1])}>
                {token?.name}
              </Text>
            )}
          </View>
          {isDefined(actionIconName) && <Icon name={actionIconName} size={formatSize(24)} />}
        </View>

        {token?.name !== '' && (
          <View style={styles.row}>
            <Text {...getTruncatedProps(styles.textRegular13)}>
              {isDropdownClosed ? token?.networkShortName ?? token?.networkFullName : getProperNetworkFullName(token)}
            </Text>

            <Divider size={formatSize(4)} />
          </View>
        )}
      </View>
    </View>
  );
};

export const renderTopUpTokenListItem: DropdownListItemComponent<TopUpInputInterface> = ({ item, isSelected }) => (
  <TopUpTokenDropdownItem token={item} actionIconName={isSelected ? IconNameEnum.Check : undefined} />
);
