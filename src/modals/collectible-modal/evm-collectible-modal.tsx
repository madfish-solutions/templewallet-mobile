import React, { memo, useMemo, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { CryptoLogo } from 'src/components/crypto-logo';
import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum.ts';
import { Divider } from 'src/components/divider/divider';
import { EvmCollectibleImage } from 'src/components/evm-collectible-image';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { TextSegmentControl } from 'src/components/segmented-control/text-segment-control/text-segment-control';
import { TruncatedText } from 'src/components/truncated-text';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useEvmChain } from 'src/hooks/evm/use-evm-chains.hook';
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useModalParams, useNavigateToModal } from 'src/navigator/hooks/use-navigation.hook';
import { useEvmAccountChainBalancesSelector } from 'src/store/evm/balances/evm-balances-selectors';
import { useEvmChainCollectiblesMetadataSelector } from 'src/store/evm/collectibles-metadata/evm-collectibles-metadata-selectors';
import { useAccountAddressForEvm } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { toChainAssetSlug } from 'src/utils/chain-asset-slug';
import { toHttpMetadataUri } from 'src/utils/evm/metadata-uri';
import { fromTokenSlug } from 'src/utils/from-token-slug.ts';

import { useCollectibleModalStyles } from './collectible-modal.styles';
import { CollectibleAttributeGrid } from './components/collectible-attributes';
import { EvmCollectibleDetails } from './components/collectible-details';

enum Segment {
  Details = 'Details',
  Attributes = 'Attributes'
}

export const EvmCollectibleModal = memo(() => {
  const { chainId, slug } = useModalParams<ModalsEnum.EvmCollectibleModal>();
  const navigateToModal = useNavigateToModal();
  const evmAddress = useAccountAddressForEvm();
  const chain = useEvmChain(chainId);
  const metadata = useEvmChainCollectiblesMetadataSelector(chainId)[slug];
  const balance = useEvmAccountChainBalancesSelector(evmAddress, chainId)[slug] ?? '0';
  const styles = useCollectibleModalStyles();
  const { width } = Dimensions.get('window');
  const imageSize = width - formatSize(32);
  const attributes = metadata?.attributes ?? [];
  const [selectedSegment, setSelectedSegment] = useState(0);
  const [contractAddress, tokenId] = fromTokenSlug<HexString>(slug);

  usePageAnalytic(ModalsEnum.EvmCollectibleModal);

  const assetKey = useMemo(() => toChainAssetSlug(TempleChainKind.EVM, chainId, slug), [chainId, slug]);
  const name = metadata?.collectibleName ?? metadata?.name;
  const collectionName = metadata?.name ?? 'Unknown collection';
  const tokenStandard = metadata?.standard ? metadata.standard.replace('erc', 'ERC ') : '---';

  const metadataLink = toHttpMetadataUri(metadata?.metadataUri);
  const contractLink = chain ? `${chain.activeBlockExplorer.url}/address/${contractAddress}` : undefined;
  const segments = attributes.length ? [Segment.Details, Segment.Attributes] : [];

  return (
    <>
      <ScreenContainer isFullScreenMode>
        <ModalStatusBar />

        <View>
          <View style={[styles.mediaContainer, { width: imageSize, height: imageSize }]}>
            <EvmCollectibleImage
              assetSlug={slug}
              chainId={chainId}
              uri={metadata?.image ?? metadata?.iconURL}
              size={imageSize}
              isFullView
            />
          </View>

          <Divider size={formatSize(12)} />

          <View style={styles.evmCollection}>
            <CryptoLogo
              name={CryptoLogoNameEnum.CollectiblePlaceholder}
              size={formatSize(36)}
              style={styles.evmCollectionLogo}
            />
            <TruncatedText style={styles.collectionName}>{collectionName}</TruncatedText>
          </View>

          <View style={styles.nameContainer}>
            <Text style={styles.name}>{name}</Text>
          </View>

          {metadata?.description ? (
            <View style={styles.descriptionContainer}>
              <Text style={styles.description}>{metadata.description}</Text>
            </View>
          ) : null}

          {segments.length ? (
            <TextSegmentControl
              values={segments}
              selectedIndex={selectedSegment}
              onChange={setSelectedSegment}
              style={styles.segmentControl}
            />
          ) : null}

          {selectedSegment === 0 && tokenId ? (
            <EvmCollectibleDetails
              chainName={chain?.name ?? 'Etherlink'}
              tokenStandard={tokenStandard}
              contract={contractAddress}
              contractLink={contractLink}
              tokenId={tokenId}
              metadataLink={metadataLink}
              amount={balance}
            />
          ) : null}

          {selectedSegment === 1 ? (
            <CollectibleAttributeGrid
              attributes={attributes.map(({ trait_type, value }) => ({
                name: trait_type ?? 'Attribute',
                value: String(value ?? '')
              }))}
            />
          ) : null}
        </View>
      </ScreenContainer>

      <ModalButtonsFloatingContainer variant="bordered">
        <ButtonLargePrimary title="Send" onPress={() => navigateToModal(ModalsEnum.Send, { assetKey })} />
      </ModalButtonsFloatingContainer>
    </>
  );
});
