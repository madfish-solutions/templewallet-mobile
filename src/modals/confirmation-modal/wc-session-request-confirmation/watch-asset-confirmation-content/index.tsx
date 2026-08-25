import { FC, useMemo } from 'react';
import { Text, View } from 'react-native';

import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { TokenIcon } from 'src/components/token-icon/token-icon';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { validateWatchAssetParams } from 'src/utils/evm/validation-schemas';

import { ConfirmationLayout } from '../../common/confirmation-layout/confirmation-layout';
import { WcSessionRequestConfirmationSelectors } from '../selectors';

import { useWatchAssetConfirmationContentStyles } from './styles';

interface WatchAssetConfirmationContentProps {
  params: unknown;
  chainId: number;
  isLoading: boolean;
  onCancel: EmptyFn;
  onConfirm: EmptyFn;
}

export const WatchAssetConfirmationContent: FC<WatchAssetConfirmationContentProps> = ({
  params,
  chainId,
  isLoading,
  onCancel,
  onConfirm
}) => {
  const styles = useWatchAssetConfirmationContentStyles();
  const parsedParams = useMemo(() => validateWatchAssetParams(params), [params]);
  const { image, address, symbol, decimals } = parsedParams.options;

  return (
    <ConfirmationLayout
      account={undefined}
      accountChainKind={TempleChainKind.EVM}
      preview={
        <View style={styles.preview}>
          <Text style={styles.previewTitle}>Add token</Text>
          <View style={styles.tokenMetadataRow}>
            <View style={styles.tokenMetadataLeftPart}>
              {!!image && (
                <TokenIcon iconURL={image} chainKind={TempleChainKind.EVM} address={address} chainId={chainId} />
              )}

              <View style={styles.tokenMetadataTexts}>
                <Text style={styles.tokenMetadataSymbol}>{symbol}</Text>
                <Text style={styles.tokenMetadataDecimals}>{decimals} decimals</Text>
              </View>
            </View>

            <PublicKeyHashText publicKeyHash={address} />
          </View>
        </View>
      }
      backAction={{
        disabled: isLoading,
        onPress: onCancel,
        testID: WcSessionRequestConfirmationSelectors.cancelButton
      }}
      confirmAction={{
        disabled: isLoading,
        onPress: onConfirm,
        testID: WcSessionRequestConfirmationSelectors.confirmButton
      }}
    />
  );
};
