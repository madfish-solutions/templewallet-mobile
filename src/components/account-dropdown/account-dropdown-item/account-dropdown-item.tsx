import BigNumber from 'bignumber.js';
import React, { memo, useMemo } from 'react';
import { Text, View } from 'react-native';

import { AssetValueText } from 'src/components/asset-value-text/asset-value-text';
import { DropdownListItemComponent } from 'src/components/dropdown/dropdown';
import { HideBalance } from 'src/components/hide-balance/hide-balance';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { RobotIcon } from 'src/components/robot-icon/robot-icon';
import { TruncatedText } from 'src/components/truncated-text';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { AccountBaseInterface, AccountInterface, emptyAccountBase } from 'src/interfaces/account.interface';
import { useAllCollectiblesDetailsSelector } from 'src/store/collectibles/collectibles-selectors';
import { useContactsSelector } from 'src/store/contact-book/contact-book-selectors';
import { formatSize } from 'src/styles/format-size';
import {
  getAccountAddressForEvm,
  getAccountAddressForTezos,
  getAccountBaseDisplayAddress
} from 'src/utils/account.utils';
import { useCurrentAccountCollectiblesWithPositiveBalance } from 'src/utils/assets/hooks';
import { conditionalStyle } from 'src/utils/conditional-style';
import { formatNumber } from 'src/utils/format-price';
import { isDefined } from 'src/utils/is-defined';
import { mutezToTz } from 'src/utils/tezos.util';
import { useTezosTokenOfKnownAccount } from 'src/utils/wallet.utils';

import { AccountDropdownItemProps } from './account-dropdown-item.interface';
import {
  useAccountDropdownItemStyles,
  useAccountDropdownItemCollectiblesInfoStyles
} from './account-dropdown-item.styles';

const COLLECTIBLES_ROBOT_ICON_SIZE = 76;

const truncateAddress = (address: string) =>
  address.length > 10 ? `${address.slice(0, 3)}...${address.slice(-4)}` : address;

export const AccountDropdownItem = memo<AccountDropdownItemProps>(
  ({ account = emptyAccountBase, showFullData = true, actionIconName, isCollectibleScreen = false }) => {
    const styles = useAccountDropdownItemStyles();
    const isFullAccount = 'type' in account;
    const tezosAddress = isFullAccount ? getAccountAddressForTezos(account as AccountInterface) : account.publicKeyHash;
    const evmAddress = isFullAccount ? getAccountAddressForEvm(account as AccountInterface) : undefined;
    const tezos = useTezosTokenOfKnownAccount(tezosAddress ?? '');
    const displayAddress = getAccountBaseDisplayAddress(account);
    const shouldRenderAddressChips = showFullData && !isCollectibleScreen;

    return (
      <View style={[styles.root, shouldRenderAddressChips && styles.rootFullData]}>
        <View style={shouldRenderAddressChips && styles.avatarContainer}>
          <RobotIcon seed={displayAddress} size={isCollectibleScreen ? COLLECTIBLES_ROBOT_ICON_SIZE : undefined} />
        </View>
        <View style={styles.infoContainer}>
          <View
            style={[
              styles.upperContainer,
              conditionalStyle(showFullData, styles.upperContainerFullData),
              conditionalStyle(isCollectibleScreen, styles.accountNameMargin)
            ]}
          >
            <TruncatedText style={styles.name}>{account.name}</TruncatedText>
            {isDefined(actionIconName) && <Icon name={actionIconName} size={formatSize(22)} />}
            {shouldRenderAddressChips && (
              <HideBalance style={styles.balanceText}>
                <AssetValueText asset={tezos} amount={tezos.balance} convertToDollar />
              </HideBalance>
            )}
          </View>
          <View style={styles.lowerContainer}>
            {isCollectibleScreen && <CollectiblesInfo />}
            {showFullData && !isCollectibleScreen && (
              <View style={styles.addressesContainer}>
                {isDefined(tezosAddress) && (
                  <AccountAddressChip address={tezosAddress} iconName={IconNameEnum.TezToken} />
                )}
                {isDefined(evmAddress) && (
                  <AccountAddressChip address={evmAddress} iconName={IconNameEnum.EtherlinkToken} />
                )}
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
);

export const renderAccountListItem: DropdownListItemComponent<AccountBaseInterface> = ({ item }) => (
  <AccountDropdownItem account={item} />
);

interface AccountAddressChipProps {
  address: string;
  iconName: IconNameEnum;
}

const AccountAddressChip = memo<AccountAddressChipProps>(({ address, iconName }) => {
  const styles = useAccountDropdownItemStyles();

  return (
    <View style={styles.addressChip}>
      <Icon name={iconName} size={formatSize(18)} />
      <Text style={styles.addressText}>{truncateAddress(address)}</Text>
    </View>
  );
});

const CollectiblesInfo = memo(() => {
  const styles = useAccountDropdownItemCollectiblesInfoStyles();

  const contacts = useContactsSelector();

  const collectibles = useCurrentAccountCollectiblesWithPositiveBalance();

  const allDetails = useAllCollectiblesDetailsSelector();
  const { metadata: gasMetadata } = useNetworkInfo();

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

    const floorPrice = mutezToTz(new BigNumber(totalFloorPrice), gasMetadata.decimals).toNumber();
    const floorPriceDisplayed = formatNumber(floorPrice);

    return `${floorPriceDisplayed} ${gasMetadata.symbol}`;
  }, [collectibles, allDetails, gasMetadata]);

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
