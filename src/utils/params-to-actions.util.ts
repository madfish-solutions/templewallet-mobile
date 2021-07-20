import { OpKind, WalletParamsWithKind } from '@taquito/taquito';

import { ActivityStatusEnum } from '../enums/activity-status.enum';
import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { ParamPreviewTypeEnum } from '../enums/param-preview-type.enum';
import { ActivityGroup, emptyActivity } from '../interfaces/activity.interface';
import { tokenMetadataSlug } from '../token/utils/token.utils';
import { getParamPreview } from './param-preview.utils';

const knownActivityTypes: Record<WalletParamsWithKind['kind'], ActivityTypeEnum> = {
  [OpKind.ORIGINATION]: ActivityTypeEnum.Origination,
  [OpKind.TRANSACTION]: ActivityTypeEnum.Transaction,
  [OpKind.DELEGATION]: ActivityTypeEnum.Delegation
};

export const paramsToPendingActions = (
  opParams: WalletParamsWithKind[],
  hash: string,
  publicKeyHash: string
): ActivityGroup => {
  const timestamp = Date.now();

  return opParams.reduce<ActivityGroup>((resultPart, subOperationParams) => {
    const commonActivityProps = {
      type: knownActivityTypes[subOperationParams.kind],
      status: ActivityStatusEnum.Pending,
      hash,
      timestamp,
      source: {
        address: publicKeyHash
      }
    };

    let activities: ActivityGroup = [];
    const preview = getParamPreview(subOperationParams);
    switch (preview.type) {
      case ParamPreviewTypeEnum.Delegate:
        activities = [
          {
            ...commonActivityProps,
            destination: {
              address: preview.baker
            },
            amount: '0'
          }
        ];
        break;
      case ParamPreviewTypeEnum.Send:
        activities = preview.transfers.map(({ recipient, amount, asset }) => ({
          ...commonActivityProps,
          destination: {
            address: recipient
          },
          amount: `-${amount}`,
          tokenSlug: asset === 'tez' ? undefined : tokenMetadataSlug({ address: asset.contract, id: asset.id }),
          entrypoint: 'transfer'
        }));
        break;
      case ParamPreviewTypeEnum.ContractCall:
        activities = [
          {
            ...commonActivityProps,
            destination: {
              address: preview.contract
            },
            entrypoint: preview.entrypoint,
            amount: '0'
          }
        ];
        break;
      case ParamPreviewTypeEnum.FA1_2Approve:
        activities = [
          {
            ...commonActivityProps,
            destination: {
              address: preview.approveTo
            },
            entrypoint: 'approve',
            amount: preview.amount,
            tokenSlug:
              preview.asset === 'tez'
                ? undefined
                : tokenMetadataSlug({ address: preview.asset.contract, id: preview.asset.id })
          }
        ];
        break;
      default:
        activities = [
          {
            ...emptyActivity,
            ...commonActivityProps
          }
        ];
    }

    return [...resultPart, ...activities];
  }, []);
};
