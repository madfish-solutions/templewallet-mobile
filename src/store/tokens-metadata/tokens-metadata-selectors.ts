import { useSelector } from 'react-redux';

import { RpcTypeEnum } from '../../enums/rpc-type.enum';
import { TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { getTokenMetadata } from '../../utils/token-metadata.utils';
import { RootState } from '../create-store';
import { useSelectedRpcSelector } from '../settings/settings-selectors';
import { TokensMetadataRootState, TokensMetadataState } from './tokens-metadata-state';

export const useTokenMetadataSelector = (slug: string) => {
  const selectedRpc = useSelectedRpcSelector();
  const isDcpNode = selectedRpc.type === RpcTypeEnum.DCP;

  return useSelector<RootState, TokenMetadataInterface>(
    state => getTokenMetadata(state, isDcpNode, slug),
    (left, right) => JSON.stringify(left) === JSON.stringify(right)
  );
};

export const useTokensMetadataSelector = () => {
  const selectedRpc = useSelectedRpcSelector();
  const isDcpNode = selectedRpc.type === RpcTypeEnum.DCP;

  return useSelector<TokensMetadataRootState, Record<string, TokenMetadataInterface>>(
    ({ tokensMetadata }) => (isDcpNode ? tokensMetadata.dcpMetadataRecord : tokensMetadata.metadataRecord),
    (left, right) => JSON.stringify(left) === JSON.stringify(right)
  );
};

export const useAddTokenSuggestionSelector = () =>
  useSelector<TokensMetadataRootState, TokensMetadataState['addTokenSuggestion']>(
    ({ tokensMetadata }) => tokensMetadata.addTokenSuggestion
  );
