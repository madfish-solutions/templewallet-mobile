import React, { FC, Fragment, useMemo } from 'react';
import { Text, View } from 'react-native';

import { Divider } from '../../../../../components/divider/divider';
import { DollarValueText } from '../../../../../components/dollar-value-text/dollar-value-text';
import { PublicKeyHashText } from '../../../../../components/public-key-hash-text/public-key-hash-text';
import { RobotIcon } from '../../../../../components/robot-icon/robot-icon';
import { TokenValueText } from '../../../../../components/token-value-text/token-value-text';
import { ParamPreviewTypeEnum } from '../../../../../enums/param-preview-type.enum';
import { useTokenMetadataGetter } from '../../../../../hooks/use-token-metadata-getter.hook';
import { Asset, ParamPreviewInterface } from '../../../../../interfaces/param-preview.interface';
import { formatSize } from '../../../../../styles/format-size';
import { TokenInterface } from '../../../../../token/interfaces/token.interface';
import { getTokenSlug } from '../../../../../token/utils/token.utils';
import { isDefined } from '../../../../../utils/is-defined';
import { useOperationsPreviewItemStyles } from './operations-preview-item.styles';

interface Props {
  paramPreview: ParamPreviewInterface;
}

type TokenPreviewType = Omit<TokenInterface, 'isVisible' | 'balance'>;

interface PreviewDataInterface {
  iconSeed: string;
  description: string;
  hash?: string;
  contract?: string;
  token?: { tokenData: TokenPreviewType; amount: string };
}

interface ParamsPreviewDataInterface {
  type: ParamPreviewTypeEnum;
  contract?: string;
  asset?: { contract: string } | Asset | string;
  amount: string;
}

export const OperationsPreviewItem: FC<Props> = ({ paramPreview }) => {
  const styles = useOperationsPreviewItemStyles();
  const getTokenMetadata = useTokenMetadataGetter();
  const formattedAmount = (params: ParamsPreviewDataInterface) => {
    const contract = () => {
      if (params.contract && params.type !== ParamPreviewTypeEnum.ContractCall) {
        return params.contract;
      }
      if (typeof params.asset === 'object') {
        return params.asset.contract;
      }

      return;
    };
    const slug = getTokenSlug(isDefined(contract()) ? { address: contract() } : {});
    const tokenData = getTokenMetadata(slug);
    const amount = params.amount;

    return { tokenData, amount };
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
            token: formattedAmount(paramPreview)
          }
        ];
      case ParamPreviewTypeEnum.ContractCall:
        return [
          {
            iconSeed: paramPreview.contract,
            description: `${paramPreview.entrypoint} method call`,
            hash: paramPreview.contract,
            token: formattedAmount(paramPreview)
          }
        ];
      case ParamPreviewTypeEnum.Other:
        return [{ iconSeed: paramPreview.opKind, description: paramPreview.opKind }];
    }
  }, [paramPreview]);

  return (
    <>
      {previewData.map(({ iconSeed, description, hash, token }, index) => (
        <Fragment key={iconSeed + index}>
          <View style={styles.container}>
            <View style={styles.contentWrapper}>
              <View style={styles.infoContainer}>
                <RobotIcon seed={iconSeed} size={formatSize(32)} />
                <Divider size={formatSize(10)} />
                <Text style={styles.description}>{description}</Text>
              </View>
              {isDefined(hash) && <PublicKeyHashText publicKeyHash={hash} />}
            </View>
            {isDefined(token) && Number(token.amount) > 0 && (
              <View>
                <TokenValueText amount={token.amount} token={token.tokenData} style={styles.amountToken} />
                <Divider size={formatSize(8)} />
                <DollarValueText amount={token.amount} token={token.tokenData} style={styles.amountDollar} />
              </View>
            )}
          </View>
          <Divider size={formatSize(8)} />
        </Fragment>
      ))}
    </>
  );
};
