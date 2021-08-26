import { BigNumber } from 'bignumber.js';
import React, { FC, Fragment, useMemo } from 'react';
import { Text, View } from 'react-native';

import { Divider } from '../../../../../components/divider/divider';
import { PublicKeyHashText } from '../../../../../components/public-key-hash-text/public-key-hash-text';
import { RobotIcon } from '../../../../../components/robot-icon/robot-icon';
import { ParamPreviewTypeEnum } from '../../../../../enums/param-preview-type.enum';
import { useTokenMetadataGetter } from '../../../../../hooks/use-token-metadata-getter.hook';
import {
  ContractCallParamPreviewInterface,
  FA1_2ApproveParamPreviewInterface,
  ParamPreviewInterface,
  Token
} from '../../../../../interfaces/param-preview.interface';
import { useExchangeRatesSelector } from '../../../../../store/currency/currency-selectors';
import { formatSize } from '../../../../../styles/format-size';
import { getTokenSlug } from '../../../../../token/utils/token.utils';
import { isDefined } from '../../../../../utils/is-defined';
import { formatAssetAmount } from '../../../../../utils/number.util';
import { mutezToTz } from '../../../../../utils/tezos.util';
import { useOperationsPreviewItemStyles } from './operations-preview-item.styles';

interface Props {
  paramPreview: ParamPreviewInterface;
}

interface PreviewDataInterface {
  iconSeed: string;
  description: string;
  hash?: string;
  contract?: string;
}

interface ParamsPreviewDataInterface {
  type: ParamPreviewTypeEnum;
  contract?: string;
  asset: any;
  amount: number;
}

export const OperationsPreviewItem: FC<Props> = ({ paramPreview }) => {
  const styles = useOperationsPreviewItemStyles();
  const getTokenMetadata = useTokenMetadataGetter();
  const exchangeRates = useExchangeRatesSelector();
  const formatAmount = (params: ParamsPreviewDataInterface) => {
    const contract = () => {
      if (params.contract && params.type !== ParamPreviewTypeEnum.ContractCall) {
        return params.contract;
      }
      if (params.asset) {
        return params.asset.contract;
      }

      return;
    };
    const slug = getTokenSlug(isDefined(contract()) ? { address: contract() } : {});
    const { decimals, symbol } = getTokenMetadata(slug);
    const tokenAmount = formatAssetAmount(mutezToTz(new BigNumber(params.amount), decimals));
    const dollarAmount = formatAssetAmount(
      new BigNumber(exchangeRates[slug] * Number(tokenAmount)),
      BigNumber.ROUND_DOWN,
      2
    );

    return { tokenAmount, symbol, dollarAmount };
  };

  const previewData = useMemo<PreviewDataInterface[]>(() => {
    switch (paramPreview.type) {
      case ParamPreviewTypeEnum.Send:
        return paramPreview.transfers.map(transfer => {
          return {
            iconSeed: transfer.recipient,
            description: 'Transfer to',
            hash: transfer.recipient
          };
        });
      case ParamPreviewTypeEnum.Delegate:
        return [{ iconSeed: paramPreview.baker, description: 'Delegate to', hash: paramPreview.baker }];
      case ParamPreviewTypeEnum.FA1_2Approve:
        return [
          {
            iconSeed: paramPreview.approveTo,
            description: 'Approve to',
            hash: paramPreview.approveTo,
            amount: formatAmount(paramPreview)
          }
        ];
      case ParamPreviewTypeEnum.ContractCall:
        return [
          {
            iconSeed: paramPreview.contract,
            description: `${paramPreview.entrypoint} method call`,
            hash: paramPreview.contract,
            amount: formatAmount(paramPreview)
          }
        ];
      case ParamPreviewTypeEnum.Other:
        return [{ iconSeed: paramPreview.opKind, description: paramPreview.opKind }];
    }
  }, [paramPreview]);

  return (
    <>
      {previewData.map(({ iconSeed, description, hash, amount }, index) => (
        <Fragment key={iconSeed + index}>
          <View style={styles.container}>
            <View style={styles.contentWrapper}>
              <View style={styles.infoContainer}>
                <RobotIcon seed={iconSeed} size={formatSize(33)} />
                <Divider size={formatSize(10)} />
                <Text style={styles.description}>{description}</Text>
              </View>
              {isDefined(hash) && <PublicKeyHashText publicKeyHash={hash} />}
            </View>
            {amount && amount.tokenAmount > 0 && (
              <View>
                <Text style={styles.amountToken}>{`-${amount.tokenAmount} ${amount.symbol}`}</Text>
                <Divider size={formatSize(8)} />
                <Text style={styles.amountDollar}>{`-${amount.dollarAmount}`}</Text>
              </View>
            )}
          </View>
          <Divider size={formatSize(8)} />
        </Fragment>
      ))}
    </>
  );
};
