import { Activity, ActivityType } from '@temple-wallet/transactions-parser';
import { BigNumber } from 'bignumber.js';
import React, { FC, useState, useCallback } from 'react';
import { View, Text } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { ExternalLinkButton } from 'src/components/icon/external-link-button/external-link-button';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { WalletAddress } from 'src/components/wallet-address/wallet-address';
import { NonZeroAmounts } from 'src/interfaces/non-zero-amounts.interface';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { tzktUrl } from 'src/utils/linking.util';

import { ActivityGroupAmountChange, TextSize } from './activity-group-amount-change/activity-group-amount-change';
import { ActivityGroupDollarAmountChange } from './activity-group-dollar-amount-change/activity-group-dollar-amount-change';
import { useActivityCommonStyles, useActivityDetailsStyles } from './activity-group-item.styles';
import { ActivityStatusBadge } from './activity-status-badge/activity-status-badge';
import { ActivityTime } from './activity-time/activity-time';
import { ActivityGroupItemSelectors } from './selectors';

const SendTokensDetails: FC<{ nonZeroAmounts: NonZeroAmounts; address: string; hash: string }> = ({
  nonZeroAmounts,
  address,
  hash
}) => {
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const styles = useActivityDetailsStyles();

  const commonStyles = useActivityCommonStyles();

  return (
    <>
      <View style={[styles.itemWrapper, styles.border]}>
        <Text style={styles.text}>Sent:</Text>
        <View>
          <ActivityGroupAmountChange nonZeroAmounts={nonZeroAmounts} textSize={TextSize.Small} />
          <ActivityGroupDollarAmountChange nonZeroAmounts={nonZeroAmounts} />
        </View>
      </View>
      <View style={[styles.itemWrapper, styles.border]}>
        <Text style={styles.text}>To:</Text>
        <WalletAddress isLocalDomainNameShowing publicKeyHash={address} />
      </View>
      <View style={styles.itemWrapper}>
        <Text style={styles.text}>TxHash:</Text>
        <View style={commonStyles.row}>
          <PublicKeyHashText longPress publicKeyHash={hash} testID={ActivityGroupItemSelectors.operationHash} />
          <Divider size={formatSize(4)} />
          <ExternalLinkButton url={tzktUrl(selectedRpcUrl, hash)} testID={ActivityGroupItemSelectors.externalLink} />
        </View>
      </View>
    </>
  );
};
const ReceiveTokensDetails: FC<{ nonZeroAmounts: NonZeroAmounts; address: string; hash: string }> = ({
  nonZeroAmounts,
  address,
  hash
}) => {
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const styles = useActivityDetailsStyles();
  const commonStyles = useActivityCommonStyles();

  return (
    <>
      <View style={[styles.itemWrapper, styles.border]}>
        <Text style={styles.text}>Received:</Text>
        <View>
          <ActivityGroupAmountChange nonZeroAmounts={nonZeroAmounts} textSize={TextSize.Small} />
          <ActivityGroupDollarAmountChange nonZeroAmounts={nonZeroAmounts} />
        </View>
      </View>
      <View style={[styles.itemWrapper, styles.border]}>
        <Text style={styles.text}>From:</Text>
        <WalletAddress isLocalDomainNameShowing publicKeyHash={address} />
      </View>
      <View style={styles.itemWrapper}>
        <Text style={styles.text}>TxHash:</Text>
        <View style={commonStyles.row}>
          <PublicKeyHashText longPress publicKeyHash={hash} testID={ActivityGroupItemSelectors.operationHash} />
          <Divider size={formatSize(4)} />
          <ExternalLinkButton url={tzktUrl(selectedRpcUrl, hash)} testID={ActivityGroupItemSelectors.externalLink} />
        </View>
      </View>
    </>
  );
};
const DelegateDetails: FC<{ address: string; hash: string }> = ({ address, hash }) => {
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const styles = useActivityDetailsStyles();
  const commonStyles = useActivityCommonStyles();

  return (
    <>
      <View style={[styles.itemWrapper, styles.border, commonStyles.itemsCenter]}>
        <Text style={styles.text}>To:</Text>
        <View style={commonStyles.row}>
          <WalletAddress isLocalDomainNameShowing publicKeyHash={address} />
          <Divider size={formatSize(4)} />
          <ExternalLinkButton url={tzktUrl(selectedRpcUrl, address)} testID={ActivityGroupItemSelectors.externalLink} />
        </View>
      </View>
      <View style={styles.itemWrapper}>
        <Text style={styles.text}>TxHash:</Text>
        <View style={commonStyles.row}>
          <PublicKeyHashText longPress publicKeyHash={hash} testID={ActivityGroupItemSelectors.operationHash} />
          <Divider size={formatSize(4)} />
          <ExternalLinkButton url={tzktUrl(selectedRpcUrl, hash)} testID={ActivityGroupItemSelectors.externalLink} />
        </View>
      </View>
    </>
  );
};

interface ActivityDetailsProps {
  activity: Activity;
}

const nonZeroAmounts = {
  amounts: [{ parsedAmount: new BigNumber(888), isPositive: true, exchangeRate: 1.2, symbol: 'XTZ' }],
  dollarSums: [new BigNumber(888)]
};

export const ActivityDetails: FC<ActivityDetailsProps> = ({ activity }) => {
  const detailsStyles = useActivityDetailsStyles();
  const commonStyles = useActivityCommonStyles();

  const [areDetailsVisible, setAreDetailsVisible] = useState(false);
  const handleOpenActivityDetailsPress = useCallback(() => setAreDetailsVisible(prevState => !prevState), []);

  return (
    <View>
      <View style={[commonStyles.row, commonStyles.justifyBetween]}>
        <View style={[commonStyles.row, commonStyles.itemsCenter]}>
          <ActivityStatusBadge status={activity.status} />
          <Divider size={formatSize(4)} />
          <ActivityTime timestamp={activity.timestamp} />
        </View>
        <TouchableWithAnalytics
          style={detailsStyles.chevron}
          testID={ActivityGroupItemSelectors.details}
          onPress={handleOpenActivityDetailsPress}
        >
          <Icon name={areDetailsVisible ? IconNameEnum.DetailsArrowUp : IconNameEnum.DetailsArrowDown} />
        </TouchableWithAnalytics>
      </View>
      {areDetailsVisible && (
        <View style={detailsStyles.card}>
          {(() => {
            switch (activity.type) {
              case ActivityType.Send:
                return (
                  <SendTokensDetails
                    nonZeroAmounts={nonZeroAmounts}
                    address={activity.to.address}
                    hash={activity.hash}
                  />
                );

              case ActivityType.Recieve:
              case ActivityType.BakingRewards:
                return (
                  <ReceiveTokensDetails
                    nonZeroAmounts={nonZeroAmounts}
                    address={activity.from.address}
                    hash={activity.hash}
                  />
                );

              case ActivityType.Delegation:
                return <DelegateDetails address={activity.to?.address ?? ''} hash={activity.hash} />;

              default:
                return null;
            }
          })()}
        </View>
      )}
    </View>
  );
};
