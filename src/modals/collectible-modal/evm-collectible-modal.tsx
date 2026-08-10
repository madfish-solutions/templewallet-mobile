import FastImage from '@d11/react-native-fast-image';
import React, { memo, useMemo, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';

import { ActivityIndicator } from 'src/components/activity-indicator';
import { BrokenImage } from 'src/components/broken-image';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { CryptoLogo } from 'src/components/crypto-logo';
import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { DataUriImage } from 'src/components/data-uri-image';
import { Divider } from 'src/components/divider/divider';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { TextSegmentControl } from 'src/components/segmented-control/text-segment-control/text-segment-control';
import { TruncatedText } from 'src/components/truncated-text';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useImagesStack } from 'src/hooks/use-images-stack';
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useModalParams, useNavigateToModal } from 'src/navigator/hooks/use-navigation.hook';
import { useEvmAccountChainBalancesSelector } from 'src/store/evm/balances/evm-balances-selectors';
import { useEvmChainCollectiblesMetadataSelector } from 'src/store/evm/collectibles-metadata/evm-collectibles-metadata-selectors';
import { useAccountAddressForEvm } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { toChainAssetSlug } from 'src/utils/chain-asset-slug';
import { fromTokenSlug } from 'src/utils/from-token-slug.ts';
import { buildEvmCollectibleImagesStack, isImgUriDataUri, isSvgDataUriInBase64Encoding } from 'src/utils/image.utils';

import { useCollectibleModalStyles } from './collectible-modal.styles';

enum Segment {
  Attributes = 'Attributes',
  Properties = 'Properties'
}

export const EvmCollectibleModal = memo(() => {
  const { chainId, slug } = useModalParams<ModalsEnum.EvmCollectibleModal>();
  const navigateToModal = useNavigateToModal();
  const evmAddress = useAccountAddressForEvm();
  const metadata = useEvmChainCollectiblesMetadataSelector(chainId)[slug];
  const balance = useEvmAccountChainBalancesSelector(evmAddress, chainId)[slug] ?? '0';
  const styles = useCollectibleModalStyles();
  const { width } = Dimensions.get('window');
  const imageSize = width - formatSize(32);
  const attributes = metadata?.attributes ?? [];
  const [selectedSegment, setSelectedSegment] = useState(0);
  const [contractAddress, tokenId] = fromTokenSlug(slug);

  usePageAnalytic(ModalsEnum.EvmCollectibleModal);

  const assetKey = useMemo(() => toChainAssetSlug(TempleChainKind.EVM, chainId, slug), [chainId, slug]);
  const name = metadata?.collectibleName ?? metadata?.name ?? tokenId;
  const collectionName = metadata?.name ?? 'Unknown collection';

  return (
    <>
      <ScreenContainer isFullScreenMode>
        <ModalStatusBar />

        <View>
          <View style={[styles.mediaContainer, { width: imageSize, height: imageSize }]}>
            <EvmCollectibleMedia uri={metadata?.image ?? metadata?.iconURL} size={imageSize} />
          </View>

          <Divider size={formatSize(12)} />

          <View style={styles.collectionContainer}>
            <View style={styles.collection}>
              <CryptoLogo name={CryptoLogoNameEnum.Etherlink} size={formatSize(36)} internalSize={formatSize(36)} />
              <TruncatedText style={styles.collectionName}>{collectionName}</TruncatedText>
            </View>
          </View>

          <View style={styles.nameContainer}>
            <Text style={styles.name}>{name}</Text>
          </View>

          {metadata?.description ? (
            <View style={styles.descriptionContainer}>
              <Text style={styles.description}>{metadata.description}</Text>
            </View>
          ) : null}

          <TextSegmentControl
            values={attributes.length ? [Segment.Properties, Segment.Attributes] : [Segment.Properties]}
            selectedIndex={selectedSegment}
            onChange={setSelectedSegment}
            style={styles.segmentControl}
          />

          {selectedSegment === 0 ? (
            <EvmProperties contractAddress={contractAddress} tokenId={tokenId} owned={balance} />
          ) : null}

          {selectedSegment === 1 ? (
            <View>
              {attributes.map(({ trait_type, value }, index) => (
                <View key={`${trait_type ?? 'attribute'}-${index}`} style={styles.creatorsContainer}>
                  <Text style={styles.creatorsText}>{trait_type ?? 'Attribute'}:</Text>
                  <Text style={styles.description}>{String(value ?? '')}</Text>
                </View>
              ))}
            </View>
          ) : null}
        </View>
      </ScreenContainer>

      <ModalButtonsFloatingContainer variant="bordered">
        <ButtonLargePrimary title="Send" onPress={() => navigateToModal(ModalsEnum.Send, { assetKey })} />
      </ModalButtonsFloatingContainer>
    </>
  );
});

const EvmProperties = memo(
  ({ contractAddress, tokenId, owned }: { contractAddress: string; tokenId: string; owned: string }) => {
    const styles = useCollectibleModalStyles();

    return (
      <View>
        {[
          ['Owned', owned],
          ['Contract', contractAddress],
          ['Token ID', tokenId]
        ].map(([label, value]) => (
          <View key={label} style={styles.creatorsContainer}>
            <Text style={styles.creatorsText}>{label}</Text>
            <TruncatedText style={styles.description}>{value}</TruncatedText>
          </View>
        ))}
      </View>
    );
  }
);

const EvmCollectibleMedia = memo(({ uri, size }: { uri?: string; size: number }) => {
  const sources = useMemo(() => buildEvmCollectibleImagesStack(uri), [uri]);
  const { src, isLoading, isStackFailed, onSuccess, onFail } = useImagesStack(sources);

  if (isStackFailed) {
    return <BrokenImage isBigIcon style={{ width: size, height: size }} />;
  }

  if (src && (isImgUriDataUri(src) || isSvgDataUriInBase64Encoding(src))) {
    return <DataUriImage dataUri={src} width={size} height={size} onLoad={onSuccess} onError={onFail} />;
  }

  return (
    <>
      <FastImage
        source={{ uri: src }}
        style={{ width: size, height: size }}
        resizeMode="contain"
        onLoad={onSuccess}
        onError={onFail}
      />
      {isLoading ? <ActivityIndicator size="large" /> : null}
    </>
  );
});
