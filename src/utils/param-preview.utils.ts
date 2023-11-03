import { OpKind, ParamsWithKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { ParamPreviewTypeEnum } from '../enums/param-preview-type.enum';
import { ParamPreviewInterface, Token } from '../interfaces/param-preview.interface';

import { isDefined } from './is-defined';
import { tzToMutez } from './tezos.util';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const getParamPreview = (opParam: ParamsWithKind): ParamPreviewInterface => {
  if (opParam.kind === OpKind.DELEGATION && isDefined(opParam.delegate)) {
    // Delegate
    return {
      type: ParamPreviewTypeEnum.Delegate,
      baker: opParam.delegate
    };
  } else if (opParam.kind === OpKind.TRANSACTION) {
    // Tezos send
    if (!opParam.parameter && opParam.amount > 0) {
      return {
        type: ParamPreviewTypeEnum.Send,
        transfers: [
          {
            asset: 'tez',
            recipient: opParam.to,
            amount: opParam.amount.toString()
          }
        ]
      };
    }

    if (opParam.parameter) {
      // Tokens send
      const tokenTransfers = tryParseTokenTransfers(opParam.parameter, opParam.to);
      if (tokenTransfers.length > 0) {
        return {
          type: ParamPreviewTypeEnum.Send,
          transfers: tokenTransfers.map(({ token, to, amount }) => ({
            asset: token,
            recipient: to,
            amount
          }))
        };
      }

      // FA1.2 Token Approve
      const fa1_2Approve = tryParseFA1_2Approve(opParam.parameter, opParam.to);
      if (fa1_2Approve) {
        return {
          type: ParamPreviewTypeEnum.FA1_2Approve,
          asset: fa1_2Approve.token,
          approveTo: fa1_2Approve.to,
          amount: fa1_2Approve.amount
        };
      }

      // Smart contract call
      return {
        type: ParamPreviewTypeEnum.ContractCall,
        contract: opParam.to,
        entrypoint: opParam.parameter.entrypoint,
        amount: (opParam.mutez === true ? opParam.amount : tzToMutez(new BigNumber(opParam.amount), 6)).toString()
      };
    }
  }

  // Rest...
  return {
    type: ParamPreviewTypeEnum.Other,
    opKind: opParam.kind
  };
};

/**
 * Parse token transfers
 */

interface TokenTransferParams {
  token: Token;
  from: string;
  to: string;
  amount: string;
}

const tryParseTokenTransfers = (parameters: any, destination: string): TokenTransferParams[] => {
  const tokenTransfers: TokenTransferParams[] = [];

  // FA1.2
  try {
    const { entrypoint, value } = parameters;
    if (entrypoint === 'transfer') {
      let from, to, amount: string | undefined;

      const { args: x } = value as any;
      if (typeof x[0].string === 'string') {
        from = x[0].string;
      }
      const { args: y } = x[1];
      if (typeof y[0].string === 'string') {
        to = y[0].string;
      }
      if (typeof y[1].int === 'string') {
        amount = y[1].int;
      }

      if (isDefined(from) && isDefined(to) && isDefined(amount)) {
        tokenTransfers.push({
          token: { contract: destination },
          from,
          to,
          amount
        });
      }
    }
  } catch {}

  // FA2
  try {
    const { entrypoint, value } = parameters;
    if (entrypoint === 'transfer') {
      for (const { args: x } of value as any) {
        let from: string | undefined;

        if (typeof x[0].string === 'string') {
          from = x[0].string;
        }
        for (const { args: y } of x[1]) {
          let to, amount: string | undefined;
          let token: Token | undefined;

          if (typeof y[0].string === 'string') {
            to = y[0].string;
          }
          if (typeof y[1].args[0].int === 'string') {
            token = {
              contract: destination,
              id: +y[1].args[0].int
            };
          }
          if (typeof y[1].args[1].int === 'string') {
            amount = y[1].args[1].int;
          }

          if (isDefined(from) && isDefined(to) && token && isDefined(amount)) {
            tokenTransfers.push({ token, from, to, amount });
          }
        }
      }
    }
  } catch {}

  return tokenTransfers;
};

/**
 * Prase FA1_2 Approve
 */

interface FA1_2ApproveParams {
  token: Token;
  to: string;
  amount: string;
}

const tryParseFA1_2Approve = (parameters: any, destination: string): FA1_2ApproveParams | null => {
  // FA1.2
  try {
    const { entrypoint, value } = parameters;
    if (entrypoint === 'approve') {
      let to, amount: string | undefined;

      const { args: x } = value as any;
      if (typeof x[0].string === 'string') {
        to = x[0].string;
      }
      if (typeof x[1].int === 'string') {
        amount = x[1].int;
      }

      if (isDefined(to) && isDefined(amount)) {
        return {
          token: { contract: destination },
          to,
          amount
        };
      }
    }
  } catch {}

  return null;
};
