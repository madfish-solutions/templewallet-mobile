import React, { FC, Fragment, useMemo } from 'react';
import { View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { ParamPreviewTypeEnum } from 'src/enums/param-preview-type.enum';
import { Asset, ParamPreviewInterface } from 'src/interfaces/param-preview.interface';
import { formatSize } from 'src/styles/format-size';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { isDefined } from 'src/utils/is-defined';
import { isCollectible } from 'src/utils/tezos.util';

import { OperationPreviewAssetAmounts } from '../../../common/operation-preview-asset-amounts';
import { OperationPreviewCard } from '../../../common/operation-preview-card';

import { useTokenGetter } from './utils';

interface Props {
  paramPreview: ParamPreviewInterface;
}

interface PreviewDataInterface {
  iconSeed: string;
  description: string;
  hash?: string;
  contract?: string;
  token?: { tokenData: TokenInterface; amount: string };
}

interface ParamsPreviewDataInterface {
  type?: ParamPreviewTypeEnum;
  contract?: string;
  asset?: Asset;
  amount: string;
}

export const OperationsPreviewItem: FC<Props> = ({ paramPreview }) => {
  const getToken = useTokenGetter();

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

    const tokenData = getToken(slug);

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
          <OperationPreviewCard iconSeed={iconSeed} description={description} publicKeyHash={hash}>
            {isDefined(token) && Number(token.amount) > 0 && (
              <View>
                <OperationPreviewAssetAmounts
                  amount={token.amount}
                  asset={token.tokenData}
                  receiver={hash}
                  showMinusSign
                  showDollar={!isCollectible(token.tokenData)}
                />
              </View>
            )}
          </OperationPreviewCard>
          <Divider size={formatSize(8)} />
        </Fragment>
      ))}
    </>
  );
};
