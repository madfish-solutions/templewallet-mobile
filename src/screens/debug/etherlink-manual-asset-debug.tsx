import { useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { isAddress } from 'viem';

import { fetchGetTokenInfo } from 'src/apis/etherlink';
import { ButtonMedium } from 'src/components/button/button-medium/button-medium';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { StyledTextInput } from 'src/components/styled-text-input/styled-text-input';
import { Switch } from 'src/components/switch/switch';
import { useEvmChain } from 'src/hooks/evm/use-evm-chains.hook';
import { setEvmAssetManualAction } from 'src/store/evm/assets/evm-assets-actions';
import { useEvmAccountChainAssetsSelector } from 'src/store/evm/assets/evm-assets-selectors';
import { useEvmAccountChainBalancesTimestampSelector } from 'src/store/evm/balances/evm-balances-selectors';
import { processLoadedEvmCollectiblesMetadataAction } from 'src/store/evm/collectibles-metadata/evm-collectibles-metadata-actions';
import { processLoadedEvmExchangeRatesAction } from 'src/store/evm/exchange-rates/evm-exchange-rates-actions';
import { processLoadedEvmTokensMetadataAction } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-actions';
import { useAccountAddressForEvm } from 'src/store/wallet/wallet-selectors';
import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { EvmAssetStandardEnum } from 'src/token/interfaces/token-metadata.interface';
import { EvmNetworkEssentials } from 'src/types/networks';
import {
  dispatchEtherlinkAccountData,
  etherlinkTokenTypeToStandard,
  getEtherlinkAccountData
} from 'src/utils/evm/etherlink-balances.utils';
import { getEvmAssetMetadata } from 'src/utils/evm/on-chain/metadata';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

export const EtherlinkManualAssetDebug = () => {
  const styles = useStyles();
  const dispatch = useDispatch();
  const account = useAccountAddressForEvm();

  const [slug, setSlug] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [addError, setAddError] = useState<string>();
  const [refreshError, setRefreshError] = useState<string>();

  const knownAssets = useEvmAccountChainAssetsSelector(account ?? '0x0', ETHERLINK_MAINNET_CHAIN_ID);
  const balancesTimestamp = useEvmAccountChainBalancesTimestampSelector(account ?? '0x0', ETHERLINK_MAINNET_CHAIN_ID);
  const etherlinkChain = useEvmChain(ETHERLINK_MAINNET_CHAIN_ID);

  const network = useMemo<EvmNetworkEssentials | undefined>(
    () =>
      etherlinkChain ? { rpcBaseURL: etherlinkChain.activeRpc.rpcBaseURL, chainId: etherlinkChain.chainId } : undefined,
    [etherlinkChain]
  );

  const knownSlugs = useMemo(() => Object.keys(knownAssets), [knownAssets]);

  const trimmedSlug = slug.trim().toLowerCase();
  const selectedAsset = knownAssets[trimmedSlug];

  const handleSlugPick = (pickedSlug: string) => setSlug(pickedSlug);

  const handleManualToggle = async (manual: boolean) => {
    if (!account || trimmedSlug === '') {
      return;
    }

    const chainId = ETHERLINK_MAINNET_CHAIN_ID;
    const [contract, tokenId] = trimmedSlug.split('_');

    setAddError(undefined);

    if (!manual || selectedAsset) {
      dispatch(setEvmAssetManualAction({ account, chainId, slug: trimmedSlug, manual }));

      return;
    }

    if (!network || !isAddress(contract)) {
      setAddError('Not a valid contract address');

      return;
    }

    setIsDetecting(true);
    try {
      if (tokenId == null) {
        try {
          const tokenInfo = await fetchGetTokenInfo(chainId, contract);
          const standard = etherlinkTokenTypeToStandard(tokenInfo.type);

          if (standard === EvmAssetStandardEnum.ERC20 && tokenInfo.decimals != null) {
            dispatch(setEvmAssetManualAction({ account, chainId, slug: trimmedSlug, manual, standard }));
            dispatch(
              processLoadedEvmTokensMetadataAction({
                chainId,
                metadata: {
                  [trimmedSlug]: {
                    name: tokenInfo.name ?? undefined,
                    symbol: tokenInfo.symbol ?? undefined,
                    decimals: Number(tokenInfo.decimals),
                    iconUri: tokenInfo.icon_url ?? undefined,
                    standard
                  }
                }
              })
            );
            if (tokenInfo.exchange_rate != null) {
              dispatch(
                processLoadedEvmExchangeRatesAction({
                  chainId,
                  rates: { [trimmedSlug]: Number(tokenInfo.exchange_rate) }
                })
              );
            }

            return;
          }
        } catch (error) {
          console.error(error);
        }
      }

      const detected = await getEvmAssetMetadata(network, contract, tokenId);

      if (!detected || (detected.standard === EvmAssetStandardEnum.ERC20 && detected.metadata.decimals == null)) {
        setAddError('Token not found via API or on-chain');

        return;
      }

      dispatch(setEvmAssetManualAction({ account, chainId, slug: trimmedSlug, manual, standard: detected.standard }));

      if (detected.standard === EvmAssetStandardEnum.ERC20 && detected.metadata.decimals != null) {
        dispatch(
          processLoadedEvmTokensMetadataAction({
            chainId,
            metadata: {
              [trimmedSlug]: {
                name: detected.metadata.name,
                symbol: detected.metadata.symbol,
                decimals: detected.metadata.decimals,
                standard: detected.standard
              }
            }
          })
        );
      } else if (detected && detected.standard !== EvmAssetStandardEnum.ERC20) {
        dispatch(
          processLoadedEvmCollectiblesMetadataAction({
            chainId,
            metadata: {
              [trimmedSlug]: {
                tokenId: tokenId ?? '0',
                name: detected.metadata.name,
                symbol: detected.metadata.symbol,
                iconUri: detected.metadata.image,
                collectionName: detected.metadata.name,
                standard: detected.standard
              }
            }
          })
        );
      }
    } catch (error) {
      console.error(error);
      setAddError('Token not found via API or on-chain');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleForceRefresh = async () => {
    if (!account) {
      return;
    }

    setIsRefreshing(true);
    setRefreshError(undefined);

    try {
      const data = await getEtherlinkAccountData(ETHERLINK_MAINNET_CHAIN_ID, account);
      dispatchEtherlinkAccountData({ dispatch, account, chainId: ETHERLINK_MAINNET_CHAIN_ID, data });
    } catch (error) {
      setRefreshError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <View>
      <Text style={styles.title}>Etherlink manual asset</Text>

      {account ? (
        <>
          <Text style={styles.infoText}>Account: {account}</Text>
          <Text style={styles.infoText}>
            Balances timestamp:{' '}
            {balancesTimestamp ? `${new Date(balancesTimestamp).toISOString()} (${balancesTimestamp})` : 'none'}
          </Text>

          <StyledTextInput
            placeholder="Token slug (contract or contract_tokenId)"
            value={slug}
            onChangeText={setSlug}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {knownSlugs.length > 0 && (
            <View style={styles.slugsList}>
              <Text style={styles.infoText}>Stored assets (tap to select):</Text>
              {knownSlugs.map(knownSlug => (
                <TouchableOpacity key={knownSlug} onPress={() => handleSlugPick(knownSlug)}>
                  <Text style={styles.slugItem}>
                    {knownSlug} — {knownAssets[knownSlug].standard}
                    {knownAssets[knownSlug].manual ? ' (manual)' : ''}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.row}>
            <Text style={[styles.infoText, styles.rowLabel]} numberOfLines={1} ellipsizeMode="middle">
              Manual flag{' '}
              {isDetecting
                ? '(detecting…)'
                : selectedAsset
                ? `for ${trimmedSlug}`
                : trimmedSlug !== ''
                ? '(will be added)'
                : ''}
              :
            </Text>
            <Switch
              value={selectedAsset?.manual ?? false}
              disabled={trimmedSlug === '' || isDetecting}
              onChange={handleManualToggle}
            />
          </View>
          {addError != null && <Text style={styles.errorText}>Add error: {addError}</Text>}

          <ButtonMedium
            title="Force Etherlink Refresh"
            iconName={IconNameEnum.RefreshIcon}
            onPress={handleForceRefresh}
            isLoading={isRefreshing}
          />
          {refreshError != null && <Text style={styles.errorText}>Refresh error: {refreshError}</Text>}
        </>
      ) : (
        <Text style={styles.infoText}>No EVM account selected.</Text>
      )}
    </View>
  );
};

const useStyles = createUseStylesMemoized(({ colors, typography }) => ({
  title: {
    ...typography.numbersMedium15,
    color: colors.black,
    marginBottom: formatSize(8)
  },
  infoText: {
    ...typography.numbersRegular13,
    color: colors.black,
    marginBottom: formatSize(4)
  },
  slugsList: {
    marginBottom: formatSize(8)
  },
  slugItem: {
    ...typography.numbersRegular13,
    color: colors.blue,
    paddingVertical: formatSize(2)
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: formatSize(8)
  },
  rowLabel: {
    flexShrink: 1,
    marginRight: formatSize(8)
  },
  errorText: {
    ...typography.numbersRegular13,
    color: colors.destructive,
    marginTop: formatSize(4)
  }
}));
