import React, { FC, Fragment, useMemo } from 'react';
import { Text, View } from 'react-native';

import { AssetValueText } from '../../../../../components/asset-value-text/asset-value-text';
import { Divider } from '../../../../../components/divider/divider';
import { PublicKeyHashText } from '../../../../../components/public-key-hash-text/public-key-hash-text';
import { RobotIcon } from '../../../../../components/robot-icon/robot-icon';
import { ParamPreviewTypeEnum } from '../../../../../enums/param-preview-type.enum';
import { useTokenMetadataGetter } from '../../../../../hooks/use-token-metadata-getter.hook';
import { Asset, ParamPreviewInterface } from '../../../../../interfaces/param-preview.interface';
import { formatSize } from '../../../../../styles/format-size';
import { TokenMetadataInterface } from '../../../../../token/interfaces/token-metadata.interface';
import { getTokenSlug } from '../../../../../token/utils/token.utils';
import { isDefined } from '../../../../../utils/is-defined';
import { getTruncatedProps } from '../../../../../utils/style.util';
import { isCollectible } from '../../../../../utils/tezos.util';
import { useOperationsPreviewItemStyles } from './operations-preview-item.styles';

interface Props {
  paramPreview: ParamPreviewInterface;
}

interface PreviewDataInterface {
  iconSeed: string;
  description: string;
  hash?: string;
  contract?: string;
  token?: { tokenData: TokenMetadataInterface; amount: string };
}

interface ParamsPreviewDataInterface {
  type?: ParamPreviewTypeEnum;
  contract?: string;
  asset?: Asset;
  amount: string;
}

export const OperationsPreviewItem: FC<Props> = ({ paramPreview }) => {
  const styles = useOperationsPreviewItemStyles();
  const getTokenMetadata = useTokenMetadataGetter();
  const formattedAmount = (params: ParamsPreviewDataInterface) => {
    const getContract = () => {
      if (isDefined(params.contract) && params.type !== ParamPreviewTypeEnum.ContractCall) {
        return { address: params.contract };
      }
      if (typeof params.asset === 'object') {
        return { address: params.asset.contract, id: params.asset.id };
      }

      return undefined;
    };

    const contract = getContract();

    const slug = getTokenSlug(contract ?? {});
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
            hash: transfer.recipient,
            token: formattedAmount(transfer)
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
                <Text {...getTruncatedProps(styles.description)}>{description}</Text>
              </View>
              {isDefined(hash) && (
                <View style={styles.hashContainer}>
                  <PublicKeyHashText publicKeyHash={hash} />
                </View>
              )}
            </View>
            {isDefined(token) && Number(token.amount) > 0 && (
              <View>
                <AssetValueText
                  amount={token.amount}
                  asset={token.tokenData}
                  style={styles.amountToken}
                  showMinusSign
                />
                <Divider size={formatSize(8)} />
                {!isCollectible(token.tokenData) && (
                  <AssetValueText
                    convertToDollar
                    amount={token.amount}
                    asset={token.tokenData}
                    style={styles.amountDollar}
                    showMinusSign
                  />
                )}
              </View>
            )}
          </View>
          <Divider size={formatSize(8)} />
        </Fragment>
      ))}
    </>
  );
};
