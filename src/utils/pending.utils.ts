import { OpKind, BatchOperation } from '@taquito/taquito';

import { ActivityStatusEnum } from '../enums/activity-status.enum';
import { ActivityTypeEnum } from '../enums/activity-type.enum';
import { AccountInterface } from '../interfaces/account.interface';
import { ActivityInterface } from '../interfaces/activity.interface';
import {
  LIQUIDITY_BAKING_LP_SLUG,
  LIQUIDITY_BAKING_LP_TOKEN_ADDRESS,
  LIQUIDITY_BAKING_LP_TOKEN_ID
} from '../token/data/token-slugs';
import { TEZ_TOKEN_SLUG } from '../token/data/tokens-metadata';
import { isDefined } from './is-defined';

export const parseOperationsToActivity = (
  activity: BatchOperation,
  sender: AccountInterface
): Array<ActivityInterface> =>
  activity.results.map(operation => {
    let slug = '';
    let address: string | undefined;
    let tokenId: number | undefined;
    let amount = '0';

    if (operation.kind === OpKind.TRANSACTION) {
      if (operation.amount !== '0') {
        slug = TEZ_TOKEN_SLUG;
        amount = operation.amount;
      }
      if (operation.parameters?.entrypoint === 'update_operators') {
        const params = operation.parameters;
        const value = params.value as unknown;
        const outerArg =
          isDefined(value) && Array.isArray(value) && value.length > 0 && isDefined(value[0].args)
            ? value[0].args
            : null;
        const innerArg =
          isDefined(outerArg) && Array.isArray(outerArg) && outerArg.length > 0 && isDefined(outerArg[0].args)
            ? outerArg[0].args
            : null;
        const lastArg =
          isDefined(innerArg) && Array.isArray(innerArg) && innerArg.length > 1 && isDefined(innerArg[1].args)
            ? innerArg[1].args
            : null;

        if (Array.isArray(lastArg) && lastArg.length > 1 && isDefined(lastArg[1].int)) {
          slug = operation.destination + '_' + lastArg[1].int;
          address = operation.destination;
          tokenId = lastArg[1].int;
          amount = operation.amount;
        }
      }
      if (operation.parameters?.entrypoint === 'transfer') {
        const params = operation.parameters;
        const value = params.value as unknown;
        const outerArg =
          isDefined(value) && Array.isArray(value) && value.length > 0 && isDefined(value[0].args)
            ? value[0].args
            : null;
        const innerArg =
          isDefined(outerArg) && Array.isArray(outerArg) && outerArg.length > 1 && isDefined(outerArg[1].args)
            ? outerArg[0].args
            : null;
        const lastArg =
          isDefined(innerArg) && Array.isArray(innerArg) && innerArg.length > 1 && isDefined(innerArg[1].args)
            ? innerArg[1].args
            : null;

        if (Array.isArray(lastArg) && lastArg.length > 1 && isDefined(lastArg[0].int) && isDefined(lastArg[1].int)) {
          slug = operation.destination + '_' + lastArg[0].int;
          address = operation.destination;
          tokenId = lastArg[0].int;
          amount = lastArg[1].int;
        }
      }
      if (operation.parameters?.entrypoint === 'approve') {
        slug = `${operation.destination}_0`;
        address = operation.destination;
        tokenId = 0;
        amount = operation.amount;
      }
      if (
        operation.parameters?.entrypoint === 'removeLiquidity' ||
        operation.parameters?.entrypoint === 'addLiquidity'
      ) {
        slug = LIQUIDITY_BAKING_LP_SLUG;
        address = LIQUIDITY_BAKING_LP_TOKEN_ADDRESS;
        tokenId = LIQUIDITY_BAKING_LP_TOKEN_ID;
        amount = operation.amount;
      }
    }

    return {
      hash: activity.hash,
      type: ActivityTypeEnum.Transaction,
      status: ActivityStatusEnum.Pending,
      amount,
      address,
      tokenId: tokenId?.toString(),
      timestamp: Date.now(),
      destination: {
        address: slug
      },
      source: {
        address: sender.publicKeyHash
      },
      id: -1
    };
  });
