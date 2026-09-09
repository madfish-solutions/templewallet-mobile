import { FC } from 'react';
import { StyleProp, Text, TextStyle, View } from 'react-native';
import useSWR from 'swr';

import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { NetworkIcon } from 'src/components/network-icon';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { TokenIcon } from 'src/components/token-icon/token-icon';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useEvmChain } from 'src/hooks/evm/use-evm-chains.hook';
import { formatSize } from 'src/styles/format-size';
import { WcWatchAssetRequestContent } from 'src/types/strict-wc-session-request';
import { getEvmTokenMetadata } from 'src/utils/evm/on-chain/metadata';

import { ConfirmationLayout } from '../../common/confirmation-layout/confirmation-layout';
import { WcSessionRequestConfirmationSelectors } from '../selectors';

import { useWatchAssetConfirmationContentStyles } from './styles';

interface WatchAssetConfirmationContentProps {
  requestContent: WcWatchAssetRequestContent;
  chainId: number;
  isLoading: boolean;
  onCancel: EmptyFn;
  onConfirm: EmptyFn;
}

const getEvmTokenMetadataForWatchAsset = async ([, chainId, rpcBaseURL, address]: [
  string,
  number,
  string,
  HexString
]) => getEvmTokenMetadata({ chainId, rpcBaseURL }, address);

export const WatchAssetConfirmationContent: FC<WatchAssetConfirmationContentProps> = ({
  requestContent,
  chainId,
  isLoading,
  onCancel,
  onConfirm
}) => {
  const styles = useWatchAssetConfirmationContentStyles();
  const chain = useEvmChain(chainId)!;
  const {
    image,
    address,
    name: nameFromRequest,
    symbol: symbolFromRequest,
    decimals: decimalsFromRequest
  } = requestContent.params.options;
  const { data: onchainMetadata, isLoading: isLoadingOnchainMetadata } = useSWR(
    ['evm-token-metadata', chainId, chain.activeRpc.rpcBaseURL, address],
    getEvmTokenMetadataForWatchAsset
  );
  const name = onchainMetadata?.name ?? nameFromRequest;
  const symbol = onchainMetadata?.symbol ?? symbolFromRequest;
  const decimals = onchainMetadata?.decimals ?? decimalsFromRequest;

  return (
    <ConfirmationLayout
      isContentLoading={isLoadingOnchainMetadata}
      account={undefined}
      accountChainKind={TempleChainKind.EVM}
      showPreviewTitle={false}
      preview={
        <View style={styles.preview}>
          <View style={styles.tokenPreview}>
            {!!image && (
              <TokenIcon
                size={formatSize(40)}
                style={styles.tokenIcon}
                iconURL={image}
                chainKind={TempleChainKind.EVM}
                address={address}
                chainId={chainId}
              />
            )}
            {symbol || name ? (
              <View style={styles.tokenLabels}>
                <TokenLabel value={symbol} style={styles.tokenSymbol} />
                <TokenLabel value={name} style={styles.tokenName} />
              </View>
            ) : null}
          </View>
          <View style={styles.tokenDetails}>
            <View style={styles.tokenDetailsRow}>
              <Text style={styles.tokenDetailsRowLabel}>Network</Text>
              <View style={styles.networkView}>
                <NetworkIcon variant="badge" name={CryptoLogoNameEnum.Etherlink} />
                <Text style={styles.networkName}>{chain.name}</Text>
              </View>
            </View>
            <View style={styles.tokenDetailsRow}>
              <Text style={styles.tokenDetailsRowLabel}>Address</Text>
              <PublicKeyHashText publicKeyHash={address} />
            </View>
            <View style={styles.tokenDetailsRow}>
              <Text style={styles.tokenDetailsRowLabel}>Decimals</Text>
              <Text style={styles.decimals}>{decimals ?? 0}</Text>
            </View>
          </View>
        </View>
      }
      backAction={{
        disabled: isLoading,
        onPress: onCancel,
        testID: WcSessionRequestConfirmationSelectors.cancelButton,
        title: 'Cancel'
      }}
      confirmAction={{
        disabled: isLoading,
        onPress: onConfirm,
        testID: WcSessionRequestConfirmationSelectors.confirmButton
      }}
    />
  );
};

interface TokenLabelProps {
  value?: string;
  style?: StyleProp<TextStyle>;
}

const TokenLabel: FC<TokenLabelProps> = ({ value, style }) =>
  value ? (
    <Text style={style} ellipsizeMode="tail" numberOfLines={1}>
      {value}
    </Text>
  ) : null;
