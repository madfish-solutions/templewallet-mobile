import { RpcTypeEnum } from '../enums/rpc-type.enum';
import { useSelectedRpcSelector } from '../store/settings/settings-selectors';
import { FILM_TOKEN_METADATA, TEZ_TOKEN_METADATA } from '../token/data/tokens-metadata';

export const useGasToken = () => {
  const selectedRpc = useSelectedRpcSelector();

  return selectedRpc.type === RpcTypeEnum.DCP
    ? { isDcpNode: true, metadata: FILM_TOKEN_METADATA }
    : { isDcpNode: false, metadata: TEZ_TOKEN_METADATA };
};
