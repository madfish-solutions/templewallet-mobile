import BigNumber from 'bignumber.js';
import React, { memo, useCallback, useMemo } from 'react';
import { GestureResponderEvent, Text, View } from 'react-native';

import { AccountSummary } from 'src/components/account-card';
import { AssetValueText } from 'src/components/asset-value-text/asset-value-text';
import { DropdownListItemComponent } from 'src/components/dropdown/dropdown';
import { HideBalance } from 'src/components/hide-balance/hide-balance';
import { IconV2 } from 'src/components/icon-v2';
import { RobotIcon } from 'src/components/robot-icon/robot-icon';
import { getSeedFromAccount } from 'src/components/robot-icon/robot-icon.utils.ts';
import { TruncatedText } from 'src/components/truncated-text';
import { Account } from 'src/interfaces/account.interfaces.ts';
import { useAllCollectiblesDetailsSelector } from 'src/store/collectibles/collectibles-selectors';
import { useContactsSelector } from 'src/store/contact-book/contact-book-selectors';
import { formatSize } from 'src/styles/format-size';
import { TEZ_TOKEN_DECIMALS, TEZ_TOKEN_SYMBOL } from 'src/token/data/tokens-metadata';
import { useCurrentAccountCollectiblesWithPositiveBalance } from 'src/utils/assets/hooks';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';
import { conditionalStyle } from 'src/utils/conditional-style';
import { formatNumber } from 'src/utils/format-price';
import { isDefined } from 'src/utils/is-defined';
import { mutezToTz } from 'src/utils/tezos.util';
import { useTezosTokenOfKnownAccount } from 'src/utils/wallet.utils';

import { AccountDropdownItemProps } from './account-dropdown-item.interface';
import {
  useAccountDropdownItemCollectiblesInfoStyles,
  useAccountDropdownItemStyles
} from './account-dropdown-item.styles';

export const AccountDropdownItem = memo<AccountDropdownItemProps>(
  ({ account, showFullData = true, actionIconName, actionIconColor, isCollectibleScreen = false }) => {
    const styles = useAccountDropdownItemStyles();

    const tezos = useTezosTokenOfKnownAccount(account.id);

    return (
      <View style={styles.root}>
        <RobotIcon
          seed={getSeedFromAccount(account)}
          size={isCollectibleScreen ? formatSize(76) : undefined}
          color="blue"
        />
        <View style={[styles.infoContainer, isCollectibleScreen && styles.infoContainerCollectibles]}>
          <View
            style={[
              styles.upperContainer,
              conditionalStyle(showFullData, styles.upperContainerFullData),
              conditionalStyle(isCollectibleScreen, styles.accountNameMargin)
            ]}
          >
            <TruncatedText style={[styles.name, conditionalStyle(isCollectibleScreen, styles.nameCollectibles)]}>
              {account.name}
            </TruncatedText>
            {isDefined(actionIconName) && <IconV2 name={actionIconName} size={24} color={actionIconColor} />}
          </View>
          <View style={styles.lowerContainer}>
            {isCollectibleScreen && <CollectiblesInfo />}
            {showFullData && !isCollectibleScreen && (
              <HideBalance textStyle={styles.balanceText}>
                <AssetValueText asset={tezos} amount={tezos.balance} />
              </HideBalance>
            )}
          </View>
        </View>
      </View>
    );
  }
);

export const AccountDropdownTriggerItem = memo<AccountDropdownItemProps>(props => <AccountDropdownItem {...props} />);

const AccountDropdownListItem = memo<Pick<AccountDropdownItemProps, 'account'>>(({ account }) => {
  const copyAddress = useCallback((address: string, event?: GestureResponderEvent) => {
    event?.stopPropagation();
    copyStringToClipboard(address);
  }, []);

  return <AccountSummary account={account} showAllAddresses fixedBalanceWidth={false} onAddressPress={copyAddress} />;
});

export const renderAccountListItem: DropdownListItemComponent<Account> = ({ item }) => (
  <AccountDropdownListItem account={item} />
);

const CollectiblesInfo = memo(() => {
  const styles = useAccountDropdownItemCollectiblesInfoStyles();

  const contacts = useContactsSelector();

  const collectibles = useCurrentAccountCollectiblesWithPositiveBalance();

  const allDetails = useAllCollectiblesDetailsSelector();

  const totalFloorPriceStr = useMemo(() => {
    let totalFloorPrice = 0;
    for (const { slug } of collectibles) {
      const cheapestListing = allDetails[slug]?.listingsActive[0];

      if (cheapestListing) {
        totalFloorPrice += cheapestListing.price_xtz;
      }
    }

    if (totalFloorPrice === 0) {
      return '-';
    }

    const floorPrice = mutezToTz(new BigNumber(totalFloorPrice), TEZ_TOKEN_DECIMALS).toNumber();
    const floorPriceDisplayed = formatNumber(floorPrice);

    return `${floorPriceDisplayed} ${TEZ_TOKEN_SYMBOL}`;
  }, [collectibles, allDetails]);

  return (
    <>
      <View style={styles.collectiblesData}>
        <View style={styles.headerInfoColumn}>
          <Text style={styles.headerText}>Items</Text>
          <Text style={styles.headerBoldText}>{collectibles.length}</Text>
        </View>
        <View style={styles.headerInfoColumn}>
          <Text style={styles.headerText}>Total Floor Price</Text>
          <Text style={styles.headerBoldText}>{totalFloorPriceStr}</Text>
        </View>
        <View style={styles.headerInfoColumn}>
          <Text style={styles.headerText}>Contacts</Text>
          <Text style={styles.headerBoldText}>{contacts.length}</Text>
        </View>
      </View>
    </>
  );
});
