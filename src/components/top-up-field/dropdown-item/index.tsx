import React, { FC, memo, useMemo } from 'react';
import { ImageRequireSource, View } from 'react-native';
import FastImage from 'react-native-fast-image';

import { Divider } from 'src/components/divider/divider';
import { DropdownListItemComponent } from 'src/components/dropdown/dropdown';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { StaticTokenIcon } from 'src/components/static-token-icon/static-token-icon';
import { TruncatedText } from 'src/components/truncated-text';
import { TopUpInterfaceBase } from 'src/interfaces/topup.interface';
import { formatSize } from 'src/styles/format-size';
import { isDefined } from 'src/utils/is-defined';
import { isTruthy } from 'src/utils/is-truthy';
import { jsonEqualityFn } from 'src/utils/store.utils';
import { getProperNetworkFullName } from 'src/utils/topup';

import { useTopUpTokenDropdownItemStyles } from './styles';

const preloadedTokensIcons: Record<string, ImageRequireSource> = {
  CNY: require('../fiat-icons/cny.png'),
  EGP: require('../fiat-icons/egp.png'),
  INR: require('../fiat-icons/inr.png'),
  JOD: require('../fiat-icons/jod.png'),
  KES: require('../fiat-icons/kes.png'),
  KRW: require('../fiat-icons/krw.png'),
  KWD: require('../fiat-icons/kwd.png'),
  PHP: require('../fiat-icons/php.png'),
  ZAR: require('../fiat-icons/zar.png'),
  KZT: require('../fiat-icons/kzt.png')
};

interface Props {
  token?: TopUpInterfaceBase;
  actionIconName?: IconNameEnum;
  iconSize?: number;
  isFacadeItem?: boolean;
}

export const TopUpTokenDropdownItem: FC<Props> = memo(
  ({ token, actionIconName, iconSize = formatSize(40), isFacadeItem = false }) => {
    const styles = useTopUpTokenDropdownItemStyles();

    const tokenIcon = useMemo(() => {
      if (token?.code === 'UAH') {
        return <Icon name={IconNameEnum.Uah} size={iconSize} />;
      }

      if (token?.code === 'XTZ') {
        return <Icon name={IconNameEnum.TezToken} size={iconSize} />;
      }

      if (isDefined(token) && token.code in preloadedTokensIcons) {
        return (
          <FastImage
            source={preloadedTokensIcons[token.code]}
            style={{ width: iconSize, height: iconSize, borderRadius: iconSize / 2 }}
          />
        );
      }

      return <StaticTokenIcon uri={token?.icon} size={iconSize} />;
    }, [token]);

    const codeFromToken = token?.codeToDisplay ?? token?.code;
    const tokenCodeToDisplay = codeFromToken === 'XTZ' ? 'TEZ' : codeFromToken;

    const { bottomTitle, sideTitle } = useMemo(() => getItemTitles(token, isFacadeItem), [token, isFacadeItem]);

    return (
      <View style={[styles.row, styles.height40]}>
        {tokenIcon}

        <Divider size={formatSize(8)} />

        <View style={styles.infoContainer}>
          <View style={[styles.row, styles.justifySpaceBetween]}>
            <TruncatedText style={token?.name === '' ? styles.textRegular17 : styles.textRegular15}>
              {tokenCodeToDisplay}
            </TruncatedText>

            <Divider size={formatSize(8)} />

            {isTruthy(sideTitle) ? <TruncatedText style={styles.textRegular11}>{sideTitle}</TruncatedText> : null}

            {isDefined(actionIconName) && <Icon name={actionIconName} size={formatSize(24)} />}
          </View>

          <View style={styles.row}>
            <TruncatedText style={styles.textRegular13}>{bottomTitle}</TruncatedText>

            <Divider size={formatSize(4)} />
          </View>
        </View>
      </View>
    );
  },
  jsonEqualityFn
);

export const renderTopUpTokenListItem: DropdownListItemComponent<TopUpInterfaceBase> = ({ item, isSelected }) => (
  <TopUpTokenDropdownItem token={item} actionIconName={isSelected ? IconNameEnum.Check : undefined} />
);

const getItemTitles = (item: TopUpInterfaceBase | undefined, isFacadeItem: boolean) => {
  if (!isTruthy(item)) {
    return {};
  }

  const { network } = item;

  if (!isTruthy(network)) {
    return { bottomTitle: item.name };
  }

  if (isFacadeItem) {
    return { bottomTitle: network.shortName ?? network.fullName };
  }

  return { bottomTitle: getProperNetworkFullName(item), sideTitle: item.name };
};
