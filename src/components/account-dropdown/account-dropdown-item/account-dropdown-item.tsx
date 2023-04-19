import React, { FC } from 'react';
import { Text, View } from 'react-native';

<<<<<<< HEAD
import { useContactsSelector } from 'src/store/contact-book/contact-book-selectors';
=======
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
>>>>>>> origin/development

import { AccountBaseInterface, emptyAccountBase } from '../../../interfaces/account.interface';
import { useCollectiblesListSelector, useTezosTokenSelector } from '../../../store/wallet/wallet-selectors';
import { formatSize } from '../../../styles/format-size';
import { conditionalStyle } from '../../../utils/conditional-style';
import { isDefined } from '../../../utils/is-defined';
import { getTruncatedProps } from '../../../utils/style.util';
import { AssetValueText } from '../../asset-value-text/asset-value-text';
import { DropdownListItemComponent } from '../../dropdown/dropdown';
import { HideBalance } from '../../hide-balance/hide-balance';
import { Icon } from '../../icon/icon';
import { IconNameEnum } from '../../icon/icon-name.enum';
import { RobotIcon } from '../../robot-icon/robot-icon';
import { WalletAddress } from '../../wallet-address/wallet-address';
import { AccountDropdownItemProps } from './account-dropdown-item.interface';
import { useAccountDropdownItemStyles } from './account-dropdown-item.styles';

const COLLECTIBLES_ROBOT_ICON_SIZE = 76;

export const AccountDropdownItem: FC<AccountDropdownItemProps> = ({
  account = emptyAccountBase,
  showFullData = true,
  actionIconName,
  isPublicKeyHashTextDisabled,
  isCollectibleScreen = false
}) => {
  const styles = useAccountDropdownItemStyles();
  const tezos = useTezosTokenSelector(account.publicKeyHash);
<<<<<<< HEAD
  const collectibles = useCollectiblesListSelector();
  const contacts = useContactsSelector();
=======
  const { metadata } = useNetworkInfo();
>>>>>>> origin/development

  return (
    <View style={styles.root}>
      <RobotIcon seed={account.publicKeyHash} size={isCollectibleScreen ? COLLECTIBLES_ROBOT_ICON_SIZE : undefined} />
      <View style={styles.infoContainer}>
        <View
          style={[
            styles.upperContainer,
            conditionalStyle(showFullData, styles.upperContainerFullData),
            conditionalStyle(isCollectibleScreen, styles.accountNameMargin)
          ]}
        >
          <Text {...getTruncatedProps(styles.name)}>{account.name}</Text>
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
};

export const renderAccountListItem: DropdownListItemComponent<AccountBaseInterface> = ({ item, isSelected }) => (
  <AccountDropdownItem account={item} {...(isSelected && { actionIconName: IconNameEnum.Check })} />
);
