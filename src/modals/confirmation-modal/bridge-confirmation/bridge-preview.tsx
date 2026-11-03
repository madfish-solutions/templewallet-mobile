import { BigNumber } from 'bignumber.js';
import React, { useMemo } from 'react';
import { View } from 'react-native';

import { BridgeNotes } from 'src/components/bridge-notes/bridge-notes';
import { Divider } from 'src/components/divider/divider';
import { FormattedAmount } from 'src/components/formatted-amount';
import { PublicKeyHashText } from 'src/components/public-key-hash-text/public-key-hash-text';
import { AssetInterface } from 'src/interfaces/asset.interface';
import { formatSize } from 'src/styles/format-size';
import { TEZ_TOKEN_DECIMALS, TEZ_TOKEN_SYMBOL } from 'src/token/data/tokens-metadata';
import { DEFAULT_MAINNET_TEZOS_CHAIN_SPECS, ETHERLINK_MAINNET_CHAIN_SPECS } from 'src/types/networks';
import { getDollarValue } from 'src/utils/balance.utils';
import { BridgeDirection } from 'src/utils/etherlink-bridge/types';
import { mutezToTz } from 'src/utils/tezos.util';
import { useTezosToken } from 'src/utils/wallet.utils';

import { OperationPreviewAssetAmounts } from '../common/operation-preview-asset-amounts';
import { OperationPreviewCard } from '../common/operation-preview-card';
import { OperationPreviewDescription } from '../common/operation-preview-description';

import { useBridgePreviewStyles } from './bridge-preview.styles';

interface Props {
  direction: BridgeDirection;
  amountMutez: string;
  receiveMutez: string;
  feeRate?: string;
  sourceAddress: string;
  destinationAddress: string;
}

const XTZ_SYMBOL = ETHERLINK_MAINNET_CHAIN_SPECS.currency.symbol;
const TEZOS_NETWORK_NAME = DEFAULT_MAINNET_TEZOS_CHAIN_SPECS.name;
const ETHERLINK_NETWORK_NAME = ETHERLINK_MAINNET_CHAIN_SPECS.name;

export const BridgePreview = ({
  direction,
  amountMutez,
  receiveMutez,
  feeRate,
  sourceAddress,
  destinationAddress
}: Props) => {
  const styles = useBridgePreviewStyles();
  const tezosToken = useTezosToken(amountMutez);
  const { exchangeRate } = tezosToken;

  const isWithdraw = direction === 'withdraw';
  const sentSymbol = isWithdraw ? XTZ_SYMBOL : TEZ_TOKEN_SYMBOL;
  const receivedSymbol = isWithdraw ? TEZ_TOKEN_SYMBOL : XTZ_SYMBOL;
  const sourceNetworkName = isWithdraw ? ETHERLINK_NETWORK_NAME : TEZOS_NETWORK_NAME;
  const destinationNetworkName = isWithdraw ? TEZOS_NETWORK_NAME : ETHERLINK_NETWORK_NAME;

  const sentAsset = useMemo<AssetInterface>(() => ({ ...tezosToken, symbol: sentSymbol }), [tezosToken, sentSymbol]);

  const receiveAmount = useMemo(() => mutezToTz(new BigNumber(receiveMutez), TEZ_TOKEN_DECIMALS), [receiveMutez]);
  const receiveFiatValue = useMemo(
    () => (exchangeRate == null ? undefined : getDollarValue(receiveMutez, TEZ_TOKEN_DECIMALS, exchangeRate)),
    [receiveMutez, exchangeRate]
  );

  return (
    <>
      <OperationPreviewCard
        iconSeed={sourceAddress}
        iconSize={formatSize(40)}
        description={`${sentSymbol} sent from ${sourceNetworkName}`}
      >
        <View>
          <OperationPreviewAssetAmounts amount={amountMutez} asset={sentAsset} showMinusSign />
        </View>
      </OperationPreviewCard>
      <Divider size={formatSize(8)} />

      <OperationPreviewCard
        iconSeed={destinationAddress}
        iconSize={formatSize(40)}
        description={
          <View>
            <OperationPreviewDescription>{`${receivedSymbol} received on ${destinationNetworkName}`}</OperationPreviewDescription>
            <Divider size={formatSize(4)} />
            <PublicKeyHashText publicKeyHash={destinationAddress} />
          </View>
        }
      >
        <View>
          <FormattedAmount amount={receiveAmount} symbol={receivedSymbol} showPlusSign style={styles.creditAmount} />
          {receiveFiatValue !== undefined && (
            <>
              <Divider size={formatSize(8)} />
              <FormattedAmount amount={receiveFiatValue} isDollarValue showPlusSign style={styles.creditFiatValue} />
            </>
          )}
        </View>
      </OperationPreviewCard>

      <BridgeNotes
        direction={direction}
        amountMutez={amountMutez}
        receiveMutez={receiveMutez}
        feeRate={feeRate}
        style={styles.notes}
      />
    </>
  );
};
