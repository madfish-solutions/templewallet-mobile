import { AllowanceInteractionActivity } from '@temple-wallet/transactions-parser';
import React, { FC, memo } from 'react';
import { View, Text } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { ExternalLinkButton } from 'src/components/icon/external-link-button/external-link-button';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { WalletAddress } from 'src/components/wallet-address/wallet-address';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { useTokenMetadataSelector } from 'src/store/tokens-metadata/tokens-metadata-selectors';
import { formatSize } from 'src/styles/format-size';
import { truncateLongAddress } from 'src/utils/address.utils';
import { tzktUrl } from 'src/utils/linking';

import {
  useActivityCommonStyles,
  useActivityDetailsStyles,
  useActivityGroupItemStyles
} from '../activity-group-item.styles';
import { ActivityGroupItemSelectors } from '../selectors';
import { AbstractItem } from './abstract-item';

const AMOUNT_INDEX = 0;

export const ChangeAllowance: FC<{ activity: AllowanceInteractionActivity }> = memo(({ activity }) => {
  const firstChange = activity.allowanceChanges[AMOUNT_INDEX];

  const metadata = useTokenMetadataSelector(firstChange.tokenSlug);
  const isRevoke = firstChange.atomicAmount.isZero();

  if (isRevoke) {
    return (
      <AbstractItem
        status={activity.status}
        timestamp={activity.timestamp}
        face={<RevokeFace symbol={metadata.symbol} address={activity.from.address} />}
        details={<RevokeDetails address={activity.from.address} symbol={metadata.symbol} hash={activity.hash} />}
      />
    );
  }

  return (
    <AbstractItem
      status={activity.status}
      timestamp={activity.timestamp}
      face={<ApproveFace address={activity.to.address} symbol={metadata.symbol} />}
      details={<ApproveDetails address={activity.to.address} symbol={metadata.symbol} hash={activity.hash} />}
    />
  );
});

const ApproveFace: FC<{ address: string; symbol: string }> = memo(({ address, symbol }) => {
  const styles = useActivityGroupItemStyles();
  const commonStyles = useActivityCommonStyles();

  return (
    <View style={[commonStyles.row, commonStyles.itemsCenter]}>
      <View style={styles.flex}>
        <View style={[commonStyles.row, commonStyles.justifyBetween, commonStyles.itemsStart]}>
          <Text style={styles.oprationTitle}>Approve</Text>
          <Text style={styles.oprationTitle}>{symbol}</Text>
        </View>
        <View style={[commonStyles.row, commonStyles.justifyBetween, commonStyles.itemsStart]}>
          <Text style={styles.oprationSubtitle}>To: {truncateLongAddress(address)}</Text>
        </View>
      </View>
    </View>
  );
});
const RevokeFace: FC<{ address: string; symbol: string }> = memo(({ address, symbol }) => {
  const styles = useActivityGroupItemStyles();
  const commonStyles = useActivityCommonStyles();

  return (
    <View style={[commonStyles.row, commonStyles.itemsCenter]}>
      <View style={styles.flex}>
        <View style={[commonStyles.row, commonStyles.justifyBetween, commonStyles.itemsStart]}>
          <Text style={styles.oprationTitle}>Revoke</Text>
          <Text style={styles.oprationTitle}>{symbol}</Text>
        </View>
        <View style={[commonStyles.row, commonStyles.justifyBetween, commonStyles.itemsStart]}>
          <Text style={styles.oprationSubtitle}>From: {truncateLongAddress(address)}</Text>
        </View>
      </View>
    </View>
  );
});

const ApproveDetails: FC<{ address: string; symbol: string; hash: string }> = memo(({ address, symbol, hash }) => {
  const styles = useActivityDetailsStyles();
  const commonStyles = useActivityCommonStyles();
  const selectedRpcUrl = useSelectedRpcUrlSelector();

  return (
    <>
      <View style={[styles.itemWrapper, styles.border]}>
        <Text style={styles.text}>Approved:</Text>
        <View>
          <Text style={styles.symbolText}>{symbol}</Text>
        </View>
      </View>

      <View style={[styles.itemWrapper, styles.border]}>
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
});
const RevokeDetails: FC<{ address: string; symbol: string; hash: string }> = memo(({ address, symbol, hash }) => {
  const styles = useActivityDetailsStyles();
  const commonStyles = useActivityCommonStyles();
  const selectedRpcUrl = useSelectedRpcUrlSelector();

  return (
    <>
      <View style={[styles.itemWrapper, styles.border]}>
        <Text style={styles.text}>Revoked:</Text>
        <View>
          <Text style={styles.symbolText}>{symbol}</Text>
        </View>
      </View>

      <View style={[styles.itemWrapper, styles.border]}>
        <Text style={styles.text}>From:</Text>
        <View style={commonStyles.row}>
          <WalletAddress isLocalDomainNameShowing publicKeyHash={address} />
          <Divider size={formatSize(4)} />
          <ExternalLinkButton url={tzktUrl(selectedRpcUrl, address)} testID={ActivityGroupItemSelectors.externalLink} />
        </View>
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
});
