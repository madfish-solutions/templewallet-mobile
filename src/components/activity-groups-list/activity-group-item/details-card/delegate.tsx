import React, { FC } from 'react';
import { View, Text } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { ExternalLinkButton } from 'src/components/icon/external-link-button/external-link-button';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { WalletAddress } from 'src/components/wallet-address/wallet-address';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { formatSize } from 'src/styles/format-size';
import { tzktUrl } from 'src/utils/linking.util';

import { useActivityCommonStyles, useActivityDetailsStyles } from '../activity-group-item.styles';
import { ActivityGroupItemSelectors } from '../selectors';

export const DelegateDetails: FC<{ address: string | undefined; hash: string }> = ({ hash, address = '' }) => {
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
