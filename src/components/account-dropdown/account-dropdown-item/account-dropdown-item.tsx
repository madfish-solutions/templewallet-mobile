import React, { memo, useEffect, useState } from 'react';
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
import { useContactsSelector } from 'src/store/contact-book/contact-book-selectors';
import { useCollectiblesListSelector, useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { conditionalStyle } from 'src/utils/conditional-style';
import { formatImgUri } from 'src/utils/image.utils';
import { isDefined } from 'src/utils/is-defined';
import { useTezosTokenOfKnownAccount } from 'src/utils/wallet.utils';

import { AccountDropdownItemProps } from './account-dropdown-item.interface';
import { useAccountDropdownItemStyles } from './account-dropdown-item.styles';

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
    const collectibles = useCollectiblesListSelector();
    const contacts = useContactsSelector();
    const { metadata } = useNetworkInfo();
    const selectedAccount = useSelectedAccountSelector();
    const { alias } = selectedAccount.tzProfile ?? {};
    const [userLogo, setUserLogo] = useState(selectedAccount.tzProfile?.logo);

    useEffect(() => setUserLogo(selectedAccount.tzProfile?.logo), [selectedAccount.tzProfile]);

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
              {isDefined(alias) && isCollectibleScreen ? alias : account.name}
            </TruncatedText>
            {isDefined(actionIconName) && <Icon name={actionIconName} size={formatSize(24)} />}
          </View>
          <View style={styles.lowerContainer}>
            {isCollectibleScreen ? (
              <>
                <View style={styles.collectiblesData}>
                  <View style={styles.headerInfoColumn}>
                    <Text style={styles.headerText}>Items</Text>
                    <Text style={styles.headerBoldText}>{collectibles.length}</Text>
                  </View>
                  <View style={styles.headerInfoColumn}>
                    <Text style={styles.headerText}>Total Floor Price</Text>
                    <Text style={styles.headerBoldText}>-</Text>
                  </View>
                  <View style={styles.headerInfoColumn}>
                    <Text style={styles.headerText}>Contacts</Text>
                    <Text style={styles.headerBoldText}>{contacts.length}</Text>
                  </View>
                </View>
              </>
            ) : (
              <WalletAddress
                isLocalDomainNameShowing
                publicKeyHash={account.publicKeyHash}
                isPublicKeyHashTextDisabled={isPublicKeyHashTextDisabled}
              />
            )}
            {showFullData && !isCollectibleScreen && (
              <HideBalance style={styles.balanceText}>
                <AssetValueText asset={metadata} amount={tezos.balance} />
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
