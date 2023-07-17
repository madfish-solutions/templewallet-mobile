import { isEmpty } from 'lodash-es';
import React, { FC, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { ExternalLinkButton } from 'src/components/icon/external-link-button/external-link-button';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { RobotIcon } from 'src/components/robot-icon/robot-icon';
import { WalletAddress } from 'src/components/wallet-address/wallet-address';
import { isAndroid } from 'src/config/system';
import { useNonZeroAmounts } from 'src/hooks/use-non-zero-amounts.hook';
import { ActivityGroup } from 'src/interfaces/activity.interface';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { tzktUrl } from 'src/utils/linking.util';

import { ActivityGroupAmountChange, TextSize } from './activity-group-amount-change/activity-group-amount-change';
import { ActivityGroupDollarAmountChange } from './activity-group-dollar-amount-change/activity-group-dollar-amount-change';
import { useActivityGroupItemStyles } from './activity-group-item.styles';
import { useActivityGroupInfo } from './activity-group-type/use-activity-group-info.hook';
import { ActivityStatusBadge } from './activity-status-badge/activity-status-badge';
import { ActivityTime } from './activity-time/activity-time';
import { ActivityGroupItemSelectors } from './selectors';

interface Props {
  group: ActivityGroup;
}

export const ActivityGroupItem: FC<Props> = ({ group }) => {
  const styles = useActivityGroupItemStyles();

  const {
    transactionType,
    transactionSubtype,
    transactionHash,
    destination: [label, value, address]
  } = useActivityGroupInfo(group);
  const nonZeroAmounts = useNonZeroAmounts(group);

  const selectedRpcUrl = useSelectedRpcUrlSelector();

  const [areDetailsVisible, setAreDetailsVisible] = useState(false);

  return (
    <View style={styles.root}>
      <View style={[styles.row, styles.justifyBetween]}>
        <View style={[styles.row, styles.itemsStart]}>
          <RobotIcon size={formatSize(36)} seed={transactionHash} />
          <Divider size={formatSize(10)} />
          <View>
            <Text style={styles.oprationTitle}>{transactionType}</Text>
            <Text style={styles.oprationSubtitle}>
              {label} {value}
            </Text>
          </View>
        </View>
        <View>
          <ActivityGroupAmountChange nonZeroAmounts={nonZeroAmounts} />
          <ActivityGroupDollarAmountChange nonZeroAmounts={nonZeroAmounts} />
        </View>
      </View>
      <Divider size={formatSize(12)} />
      <View style={[styles.row, styles.justifyBetween]}>
        <View style={styles.row}>
          <ActivityStatusBadge status={group[0].status} />
          <Divider size={formatSize(4)} />
          <ActivityTime timestamp={1689343447} />
        </View>
        <TouchableOpacity onPress={() => setAreDetailsVisible(prevState => !prevState)}>
          <Icon name={areDetailsVisible ? IconNameEnum.DetailsArrowUp : IconNameEnum.DetailsArrowDown} />
        </TouchableOpacity>
      </View>
      {areDetailsVisible && (
        <View style={styles.card}>
          {!isEmpty(nonZeroAmounts.amounts) && (
            <View style={[styles.detailItem, styles.detailItemBorder]}>
              <Text style={styles.detailText}>{transactionSubtype}</Text>
              <View>
                <ActivityGroupAmountChange textSize={TextSize.Small} nonZeroAmounts={nonZeroAmounts} />
                <ActivityGroupDollarAmountChange nonZeroAmounts={nonZeroAmounts} />
              </View>
            </View>
          )}
          <View style={[styles.detailItem, styles.detailItemBorder]}>
            <Text style={styles.detailText}>{label}</Text>
            <WalletAddress isLocalDomainNameShowing publicKeyHash={address} isPublicKeyHashTextDisabled={isAndroid} />
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailText}>TxHash:</Text>
            <View style={styles.row}>
              <PublicKeyHashText publicKeyHash={transactionHash} testID={ActivityGroupItemSelectors.operationHash} />
              <Divider size={formatSize(4)} />
              <ExternalLinkButton
                url={tzktUrl(selectedRpcUrl, transactionHash)}
                testID={ActivityGroupItemSelectors.externalLink}
              />
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
