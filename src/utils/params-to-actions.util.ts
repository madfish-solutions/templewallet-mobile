import { OpKind } from '@taquito/taquito';

import { ActivityStatusEnum } from '../enums/activity-status.enum';
import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { ParamPreviewTypeEnum } from '../enums/param-preview-type.enum';
import { ActivityGroup, emptyActivity } from '../interfaces/activity.interface';
import { ParamsWithKind } from '../interfaces/op-params.interface';
import { invertSign } from './number.util';
import { getParamPreview } from './param-preview.utils';

const knownActivityTypes: Record<ParamsWithKind['kind'], ActivityTypeEnum> = {
  [OpKind.ORIGINATION]: ActivityTypeEnum.Origination,
  [OpKind.TRANSACTION]: ActivityTypeEnum.Transaction,
  [OpKind.DELEGATION]: ActivityTypeEnum.Delegation,
  [OpKind.ACTIVATION]: ActivityTypeEnum.Activation,
  [OpKind.REGISTER_GLOBAL_CONSTANT]: ActivityTypeEnum.Transaction
};

export const paramsToPendingActions = (
  opParams: ParamsWithKind[],
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
          ...(asset !== 'tez' && { address: asset.contract, id: asset.id ?? 0 }),
          destination: {
            address: recipient
          },
          amount: `-${amount}`,
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
            amount: invertSign(preview.amount)
          }
        ];
        break;
      case ParamPreviewTypeEnum.FA1_2Approve:
        activities = [
          {
            ...commonActivityProps,
            ...(preview.asset !== 'tez' && { address: preview.asset.contract, id: preview.asset.id ?? 0 }),
            destination: {
              address: preview.approveTo
            },
            entrypoint: 'approve',
            amount: invertSign(preview.amount)
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
