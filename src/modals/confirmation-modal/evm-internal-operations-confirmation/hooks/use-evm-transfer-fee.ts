import { useEvmTransactionFee } from 'src/hooks/evm/use-evm-transaction-fee';
import { EvmTransactionRequest } from 'src/interfaces/evm-transaction-request.interface';
import { EvmAssetStandardEnum } from 'src/token/interfaces/token-metadata.interface';
import { EvmSendAsset } from 'src/types/send-asset';

interface Props {
  sourceAddress?: HexString;
  request?: EvmTransactionRequest;
  asset: EvmSendAsset;
}

export const useEvmTransferFee = ({ sourceAddress, request, asset }: Props) =>
  useEvmTransactionFee({
    chainId: asset.chainId,
    sourceAddress,
    request,
    nativeCurrencyFallback:
      asset.sendStandard === EvmAssetStandardEnum.NATIVE
        ? { name: asset.networkName, symbol: asset.symbol, decimals: asset.decimals }
        : undefined
  });
