import BigNumber from 'bignumber.js';
import React, { memo, useMemo } from 'react';
import { Text, View } from 'react-native';

import { AssetValueText } from 'src/components/asset-value-text/asset-value-text';
import { CryptoLogo } from 'src/components/crypto-logo';
import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { DropdownListItemComponent } from 'src/components/dropdown/dropdown';
import { HideBalance } from 'src/components/hide-balance/hide-balance';
import { Icon } from 'src/components/icon/icon';
import { RobotIcon } from 'src/components/robot-icon/robot-icon';
import { getSeedFromAccount } from 'src/components/robot-icon/robot-icon.utils.ts';
import { TruncatedText } from 'src/components/truncated-text';
import { Account } from 'src/interfaces/account.interfaces.ts';
import { useAllCollectiblesDetailsSelector } from 'src/store/collectibles/collectibles-selectors';
import { useContactsSelector } from 'src/store/contact-book/contact-book-selectors';
import { useSaplingAddressForAccount } from 'src/store/sapling/sapling-selectors.ts';
import { formatSize } from 'src/styles/format-size';
import { TEZ_TOKEN_DECIMALS, TEZ_TOKEN_SYMBOL } from 'src/token/data/tokens-metadata';
import { getAccountAddressForEvm, getAccountAddressForTezos } from 'src/utils/account.utils';
import { useCurrentAccountCollectiblesWithPositiveBalance } from 'src/utils/assets/hooks';
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

const COLLECTIBLES_ROBOT_ICON_SIZE = 76;

export const AccountDropdownItem = memo<AccountDropdownItemProps>(
  ({ account, showFullData = true, actionIconName, isCollectibleScreen = false }) => {
    const styles = useAccountDropdownItemStyles();

    const tezos = useTezosTokenOfKnownAccount(account.id);

    return (
      <View style={styles.root}>
        <RobotIcon
          seed={getSeedFromAccount(account)}
          size={isCollectibleScreen ? COLLECTIBLES_ROBOT_ICON_SIZE : undefined}
        />
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

export const AccountDropdownTriggerItem = memo<AccountDropdownItemProps>(props => <AccountDropdownItem {...props} />);

const AccountDropdownListItem = memo<Pick<AccountDropdownItemProps, 'account'>>(({ account }) => {
  const styles = useAccountDropdownItemStyles();
  const saplingAddress = useSaplingAddressForAccount(account);

  const tezosAddress = getAccountAddressForTezos(account);
  const evmAddress = getAccountAddressForEvm(account);

  const tezos = useTezosTokenOfKnownAccount(account.id);

  return (
    <>
      <View style={styles.listItemHeader}>
        <RobotIcon seed={getSeedFromAccount(account)} size={formatSize(24)} padding={formatSize(4)} />
        <View style={styles.listItemHeaderInfo}>
          <TruncatedText style={styles.listItemName}>{account.name}</TruncatedText>
          <HideBalance style={styles.listItemBalanceText}>
            <AssetValueText asset={tezos} amount={tezos.balance} convertToDollar />
          </HideBalance>
        </View>
      </View>

      <View style={styles.addressesContainer}>
        {isDefined(tezosAddress) && <AccountAddressChip address={tezosAddress} iconName={CryptoLogoNameEnum.Tezos} />}
        {isDefined(saplingAddress) && (
          <AccountAddressChip address={saplingAddress} iconName={CryptoLogoNameEnum.ShieldedTezos} />
        )}
        {isDefined(evmAddress) && <AccountAddressChip address={evmAddress} iconName={CryptoLogoNameEnum.Etherlink} />}
      </View>
    </>
  );
});

export const renderAccountListItem: DropdownListItemComponent<Account> = ({ item }) => (
  <AccountDropdownListItem account={item} />
);

interface AccountAddressChipProps {
  address: string;
  iconName: CryptoLogoNameEnum;
}

const AccountAddressChip = memo<AccountAddressChipProps>(({ address, iconName }) => {
  const styles = useAccountDropdownItemStyles();

  return (
    <View style={styles.addressChip}>
      <CryptoLogo name={iconName} size={formatSize(12)} />
      <Text style={styles.addressText}>{truncateAddress(address)}</Text>
    </View>
  );
});

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

const truncateAddress = (address: string) =>
  address.length > 10 ? `${address.slice(0, 3)}...${address.slice(-4)}` : address;
