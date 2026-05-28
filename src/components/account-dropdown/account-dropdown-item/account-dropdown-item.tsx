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
import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { AddressBookItem, emptyAddressBookItem } from 'src/interfaces/account.interfaces';
import { Contact } from 'src/interfaces/contact.interface';
import { useAllCollectiblesDetailsSelector } from 'src/store/collectibles/collectibles-selectors';
import { useContactsSelector } from 'src/store/contact-book/contact-book-selectors';
import { useSelector } from 'src/store/selector';
import { formatSize } from 'src/styles/format-size';
import {
  getAccountAddressForEvm,
  getAccountAddressForTezos,
  getAccountBaseDisplayAddress,
  isAccount
} from 'src/utils/account.utils';
import { useCurrentAccountCollectiblesWithPositiveBalance } from 'src/utils/assets/hooks';
import { conditionalStyle } from 'src/utils/conditional-style';
import { formatNumber } from 'src/utils/format-price';
import { isDefined } from 'src/utils/is-defined';
import { mutezToTz } from 'src/utils/tezos.util';
import { useTezosTokenOfKnownAccount } from 'src/utils/wallet.utils';

import {
  AccountDropdownItemProps,
  AccountDropdownListItemProps,
  AccountDropdownTriggerItemProps
} from './account-dropdown-item.interface';
import {
  useAccountDropdownItemStyles,
  useAccountDropdownItemCollectiblesInfoStyles
} from './account-dropdown-item.styles';

const COLLECTIBLES_ROBOT_ICON_SIZE = 76;

const truncateAddress = (address: string) =>
  address.length > 10 ? `${address.slice(0, 3)}...${address.slice(-4)}` : address;

export const AccountDropdownItem = memo<AccountDropdownItemProps>(
  ({ account, showFullData = true, actionIconName, isCollectibleScreen = false }) => {
    const styles = useAccountDropdownItemStyles();
    const accountInterface = isAccount(account) ? account : undefined;
    const tezosAddress = accountInterface ? getAccountAddressForTezos(accountInterface) : (account as Contact).address;
    const tezos = useTezosTokenOfKnownAccount(tezosAddress ?? '');
    const displayAddress = getAccountBaseDisplayAddress(account);

    return (
      <View style={styles.root}>
        <RobotIcon seed={displayAddress} size={isCollectibleScreen ? COLLECTIBLES_ROBOT_ICON_SIZE : undefined} />
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
          </View>
          <View style={styles.lowerContainer}>
            {isCollectibleScreen && <CollectiblesInfo />}
            {showFullData && !isCollectibleScreen && (
              <HideBalance style={styles.balanceText}>
                <AssetValueText asset={tezos} amount={tezos.balance} />
              </HideBalance>
            )}
          </View>
        </View>
      </View>
    );
  }
);

export const AccountDropdownTriggerItem = memo<AccountDropdownTriggerItemProps>(props => (
  <AccountDropdownItem {...props} />
));

export const AccountDropdownListItem = memo<AccountDropdownListItemProps>(({ account = emptyAddressBookItem }) => {
  const styles = useAccountDropdownItemStyles();
  const accountInterface = isAccount(account) ? account : undefined;
  const tezosAddress = accountInterface ? getAccountAddressForTezos(accountInterface) : (account as Contact).address;
  const evmAddress = accountInterface ? getAccountAddressForEvm(accountInterface) : undefined;
  const tezos = useTezosTokenOfKnownAccount(tezosAddress ?? '');
  const saplingAddress = useSelector(({ sapling }) =>
    tezosAddress ? sapling.accountsRecord[tezosAddress]?.saplingAddress : undefined
  );
  const displayAddress = getAccountBaseDisplayAddress(account);
  const shouldRenderSaplingAddress = accountInterface?.type === AccountTypeEnum.HD_ACCOUNT && isDefined(saplingAddress);

  return (
    <>
      <View style={styles.listItemHeader}>
        <RobotIcon seed={displayAddress} size={formatSize(24)} scaleFactor={4} />
        <View style={styles.listItemHeaderInfo}>
          <TruncatedText style={styles.listItemName}>{account.name}</TruncatedText>
          <HideBalance style={styles.listItemBalanceText}>
            <AssetValueText asset={tezos} amount={tezos.balance} convertToDollar />
          </HideBalance>
        </View>
      </View>

      <View style={styles.addressesContainer}>
        {isDefined(tezosAddress) && <AccountAddressChip address={tezosAddress} iconName={IconNameEnum.TezToken} />}
        {shouldRenderSaplingAddress && (
          <AccountAddressChip address={saplingAddress} iconName={IconNameEnum.TezShieldedToken} />
        )}
        {isDefined(evmAddress) && <AccountAddressChip address={evmAddress} iconName={IconNameEnum.EtherlinkToken} />}
      </View>
    </>
  );
});

export const renderAccountListItem: DropdownListItemComponent<AddressBookItem> = ({ item }) => (
  <AccountDropdownListItem account={item} />
);

interface AccountAddressChipProps {
  address: string;
  iconName: IconNameEnum;
}

const AccountAddressChip = memo<AccountAddressChipProps>(({ address, iconName }) => {
  const styles = useAccountDropdownItemStyles();

  return (
    <View style={styles.addressChip}>
      <Icon name={iconName} size={formatSize(16)} />
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
