import BigNumber from 'bignumber.js';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';

import { AssetValueText } from 'src/components/asset-value-text/asset-value-text';
import { DropdownListItemComponent } from 'src/components/dropdown/dropdown';
import { HideBalance } from 'src/components/hide-balance/hide-balance';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { RobotIcon } from 'src/components/robot-icon/robot-icon';
import { TruncatedText } from 'src/components/truncated-text';
import { WalletAddress } from 'src/components/wallet-address/wallet-address';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { AccountBaseInterface, emptyAccountBase } from 'src/interfaces/account.interface';
import {
  useAllCollectiblesDetailsSelector,
  useCollectibleDetailsLoadingSelector
} from 'src/store/collectibles/collectibles-selectors';
import { useContactsSelector } from 'src/store/contact-book/contact-book-selectors';
import { useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { useCurrentAccountCollectiblesWithPositiveBalance } from 'src/utils/assets/hooks';
import { conditionalStyle } from 'src/utils/conditional-style';
import { formatNumber } from 'src/utils/format-price';
import { formatImgUri } from 'src/utils/image.utils';
import { isDefined } from 'src/utils/is-defined';
import { mutezToTz } from 'src/utils/tezos.util';
import { useTzProfile } from 'src/utils/tz-profiles';
import { useTezosTokenOfKnownAccount } from 'src/utils/wallet.utils';

import { AccountDropdownItemProps } from './account-dropdown-item.interface';
import {
  useAccountDropdownItemStyles,
  useAccountDropdownItemCollectiblesInfoStyles
} from './account-dropdown-item.styles';

const COLLECTIBLES_ROBOT_ICON_SIZE = 76;

export const AccountDropdownItem = memo<AccountDropdownItemProps>(
  ({
    account = emptyAccountBase,
    showFullData = true,
    actionIconName,
    isPublicKeyHashTextDisabled,
    isCollectibleScreen = false
  }) => {
    const styles = useAccountDropdownItemStyles();
    const tezos = useTezosTokenOfKnownAccount(account.publicKeyHash);
    const selectedAccountPkh = useCurrentAccountPkhSelector();
    const tzProfile = useTzProfile(selectedAccountPkh);
    const [userLogo, setUserLogo] = useState(tzProfile?.logo);

    useEffect(() => setUserLogo(tzProfile?.logo), [tzProfile]);

    return (
      <View style={styles.root}>
        {isDefined(userLogo) && isCollectibleScreen ? (
          <FastImage
            style={styles.image}
            source={{ uri: formatImgUri(userLogo) }}
            onError={() => setUserLogo(undefined)}
          />
        ) : (
          <RobotIcon
            seed={account.publicKeyHash}
            size={isCollectibleScreen ? COLLECTIBLES_ROBOT_ICON_SIZE : undefined}
          />
        )}
        <View style={styles.infoContainer}>
          <View
            style={[
              styles.upperContainer,
              conditionalStyle(showFullData, styles.upperContainerFullData),
              conditionalStyle(isCollectibleScreen, styles.accountNameMargin)
            ]}
          >
            <TruncatedText style={styles.name}>
              {isCollectibleScreen && tzProfile?.alias ? tzProfile.alias : account.name}
            </TruncatedText>
            {isDefined(actionIconName) && <Icon name={actionIconName} size={formatSize(24)} />}
          </View>
          <View style={styles.lowerContainer}>
            {isCollectibleScreen ? (
              <CollectiblesInfo key={account.publicKeyHash} />
            ) : (
              <WalletAddress
                isLocalDomainNameShowing
                publicKeyHash={account.publicKeyHash}
                isPublicKeyHashTextDisabled={isPublicKeyHashTextDisabled}
              />
            )}
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

export const renderAccountListItem: DropdownListItemComponent<AccountBaseInterface> = ({ item, isSelected }) => (
  <AccountDropdownItem account={item} {...(isSelected && { actionIconName: IconNameEnum.Check })} />
);

const CollectiblesInfo = memo(() => {
  const styles = useAccountDropdownItemCollectiblesInfoStyles();

  const contacts = useContactsSelector();

  const collectibles = useCurrentAccountCollectiblesWithPositiveBalance();
  const detailsAreLoading = useCollectibleDetailsLoadingSelector();
  const prevDetailsAreLoadingRef = useRef(detailsAreLoading);

  const allDetails = useAllCollectiblesDetailsSelector();
  const { metadata: gasMetadata } = useNetworkInfo();
  const [wasLoading, setWasLoading] = useState(false);

  useEffect(() => {
    if (prevDetailsAreLoadingRef.current && !detailsAreLoading) {
      setWasLoading(true);
    }
    prevDetailsAreLoadingRef.current = detailsAreLoading;
  }, [detailsAreLoading]);

  const totalFloorPriceStr = useMemo(() => {
    if (!wasLoading) {
      return '-';
    }

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
  }, [wasLoading, gasMetadata, collectibles, allDetails]);

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
