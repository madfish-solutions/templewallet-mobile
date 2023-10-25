import React, { FC, memo } from 'react';
import { View, Text } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { ExternalLinkButton } from 'src/components/icon/external-link-button/external-link-button';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { RobotIcon } from 'src/components/robot-icon/robot-icon';
import { WalletAddress } from 'src/components/wallet-address/wallet-address';
import { useNonZeroAmounts } from 'src/hooks/use-non-zero-amounts.hook';
import { ActivityAmount } from 'src/interfaces/non-zero-amounts.interface';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { calculateDollarValue } from 'src/utils/activity.utils';
import { truncateLongAddress } from 'src/utils/address.utils';
import { tzktUrl } from 'src/utils/linking';

import { ActivityGroupAmountChange, TextSize } from '../activity-group-amount-change/activity-group-amount-change';
import { ActivityGroupDollarAmountChange } from '../activity-group-dollar-amount-change/activity-group-dollar-amount-change';
import {
  useActivityCommonStyles,
  useActivityDetailsStyles,
  useActivityGroupItemStyles
} from '../activity-group-item.styles';
import { ActivityGroupItemSelectors } from '../selectors';
import { AbstractItem } from './abstract-item';
import { ActivityItemProps } from './item.props';

export const Receive: FC<ActivityItemProps> = memo(({ activity }) => {
  const nonZeroAmounts = useNonZeroAmounts(activity.tokensDeltas);

  return (
    <AbstractItem
      face={<Face address={activity.from.address} nonZeroAmounts={nonZeroAmounts} />}
      details={<Details hash={activity.hash} address={activity.from.address} nonZeroAmounts={nonZeroAmounts} />}
      status={activity.status}
      timestamp={activity.timestamp}
    />
  );
});

const Face: FC<{ address: string; nonZeroAmounts: Array<ActivityAmount> }> = ({ address, nonZeroAmounts }) => {
  const styles = useActivityGroupItemStyles();
  const commonStyles = useActivityCommonStyles();

  return (
    <>
      <RobotIcon size={formatSize(36)} seed={address} style={styles.robotBackground} />
      <Divider size={formatSize(10)} />
      <View style={styles.flex}>
        <View style={[commonStyles.row, commonStyles.justifyBetween, commonStyles.itemsStart]}>
          <Text style={styles.operationTitle}>Receive</Text>
          <ActivityGroupAmountChange nonZeroAmounts={nonZeroAmounts} />
        </View>
        <View style={[commonStyles.row, commonStyles.justifyBetween, commonStyles.itemsStart]}>
          <Text style={styles.operationSubtitle}>From: {truncateLongAddress(address)}</Text>
          <ActivityGroupDollarAmountChange dollarValue={calculateDollarValue(nonZeroAmounts)} />
        </View>
      </View>
    </>
  );
};

const Details: FC<{ hash: string; address: string; nonZeroAmounts: Array<ActivityAmount> }> = ({
  hash,
  address,
  nonZeroAmounts
}) => {
  const styles = useActivityDetailsStyles();
  const commonStyles = useActivityCommonStyles();
  const selectedRpcUrl = useSelectedRpcUrlSelector();

  return (
    <>
      <View style={[styles.itemWrapper, styles.border]}>
        <Text style={styles.text}>Received:</Text>
        <View>
          <ActivityGroupAmountChange nonZeroAmounts={nonZeroAmounts} textSize={TextSize.Small} />
          <ActivityGroupDollarAmountChange dollarValue={calculateDollarValue(nonZeroAmounts)} />
        </View>
      </View>

      <View style={[styles.itemWrapper, styles.border]}>
        <Text style={styles.text}>From:</Text>

        <WalletAddress isLocalDomainNameShowing publicKeyHash={address} />
      </View>

      <View style={styles.itemWrapper}>
        <Text style={styles.text}>TxHash:</Text>
        <View style={commonStyles.row}>
          <PublicKeyHashText
            longPress
            style={styles.hashChip}
            publicKeyHash={hash}
            testID={ActivityGroupItemSelectors.operationHash}
          />
          <Divider size={formatSize(4)} />
          <ExternalLinkButton url={tzktUrl(selectedRpcUrl, hash)} testID={ActivityGroupItemSelectors.externalLink} />
        </View>
      </View>
    </>
  );
};
