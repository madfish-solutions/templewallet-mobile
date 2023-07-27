import { isEmpty } from 'lodash-es';
import React, { FC, useState, useCallback, useMemo } from 'react';
import { View, Text } from 'react-native';

import { CollectibleIcon } from 'src/components/collectible-icon/collectible-icon';
import { Divider } from 'src/components/divider/divider';
import { ExternalLinkButton } from 'src/components/icon/external-link-button/external-link-button';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { WalletAddress } from 'src/components/wallet-address/wallet-address';
import { ActivityNonZeroAmounts } from 'src/hooks/use-non-zero-amounts.hook';
import { ActivityInterface } from 'src/interfaces/activity.interface';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { useCollectibleBySlugSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { isDefined } from 'src/utils/is-defined';
import { tzktUrl } from 'src/utils/linking.util';

import { ActivityGroupAmountChange, TextSize } from './activity-group-amount-change/activity-group-amount-change';
import { ActivityGroupDollarAmountChange } from './activity-group-dollar-amount-change/activity-group-dollar-amount-change';
import { useActivityGroupItemStyles } from './activity-group-item.styles';
import { BAKING_REWARDS_TEXT } from './activity-group-type/use-activity-group-info.hook';
import { ActivityStatusBadge } from './activity-status-badge/activity-status-badge';
import { ActivityTime } from './activity-time/activity-time';
import { ActivityGroupItemSelectors } from './selectors';

interface ActivityDetailsProps {
  activity: ActivityInterface;
  nonZeroAmounts: ActivityNonZeroAmounts;
  label: string;
  address: string | undefined;
  transactionHash: string;
  transactionType: string;
  transactionSubtype: string;
}

export const ActivityDetails: FC<ActivityDetailsProps> = ({
  activity,
  nonZeroAmounts,
  label,
  address,
  transactionHash,
  transactionType,
  transactionSubtype
}) => {
  const styles = useActivityGroupItemStyles();
  const selectedRpcUrl = useSelectedRpcUrlSelector();

  const [areDetailsVisible, setAreDetailsVisible] = useState(false);
  const handleOpenActivityDetailsPress = useCallback(() => setAreDetailsVisible(prevState => !prevState), []);

  const collectible = useCollectibleBySlugSelector(`${activity.address}_${activity.tokenId ?? 0}`);
  const isCollectible = useMemo(() => isDefined(collectible), [collectible]);

  return (
    <View>
      <View style={[styles.row, styles.justifyBetween]}>
        <View style={[styles.row, styles.itemsCenter]}>
          <ActivityStatusBadge status={activity.status} />
          <Divider size={formatSize(4)} />
          <ActivityTime timestamp={activity.timestamp} />
        </View>
        <TouchableWithAnalytics testID={ActivityGroupItemSelectors.details} onPress={handleOpenActivityDetailsPress}>
          <Icon name={areDetailsVisible ? IconNameEnum.DetailsArrowUp : IconNameEnum.DetailsArrowDown} />
        </TouchableWithAnalytics>
      </View>
      {areDetailsVisible && (
        <View style={styles.card}>
          {!isEmpty(nonZeroAmounts.amounts) && (
            <View style={[styles.detailItem, styles.detailItemBorder, styles.itemsStart]}>
              <Text style={styles.detailText}>{transactionSubtype}</Text>
              <View style={styles.row}>
                <View style={styles.itemsEnd}>
                  <ActivityGroupAmountChange nonZeroAmounts={nonZeroAmounts} textSize={TextSize.Small} />
                  {isCollectible ? (
                    <Text style={styles.ntfPrice}>0.00$</Text>
                  ) : (
                    <ActivityGroupDollarAmountChange nonZeroAmounts={nonZeroAmounts} />
                  )}
                </View>

                {isDefined(collectible) && (
                  <>
                    <Divider size={formatSize(8)} />
                    <CollectibleIcon collectible={collectible} size={36} />
                  </>
                )}
              </View>
            </View>
          )}
          {isDefined(address) && (
            <View style={[styles.detailItem, styles.detailItemBorder, styles.itemsCenter]}>
              <Text style={styles.detailText}>{label}</Text>
              <View style={styles.row}>
                <WalletAddress isLocalDomainNameShowing publicKeyHash={address} />
                {transactionType === BAKING_REWARDS_TEXT && (
                  <>
                    <Divider size={formatSize(4)} />
                    <ExternalLinkButton
                      url={tzktUrl(selectedRpcUrl, activity.source.address)}
                      testID={ActivityGroupItemSelectors.externalLink}
                    />
                  </>
                )}
              </View>
            </View>
          )}
          <View style={[styles.detailItem, styles.itemsCenter]}>
            <Text style={styles.detailText}>TxHash:</Text>
            <View style={styles.row}>
              <PublicKeyHashText
                longPress
                publicKeyHash={transactionHash}
                testID={ActivityGroupItemSelectors.operationHash}
              />
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
