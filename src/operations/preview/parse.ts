import { WalletParamsWithKind, OpKind } from '@taquito/taquito';

import { OpPreview, OpPreviewType, Token } from './types';

export function getOpPreview(op: WalletParamsWithKind): OpPreview {
  switch (op.kind) {
    case OpKind.DELEGATION:
      return {
        type: OpPreviewType.Delegate,
        baker: op.delegate
      };

    case OpKind.TRANSACTION:
      if (!op.parameter && op.amount > 0) {
        return {
          type: OpPreviewType.Send,
          transfers: [
            {
              asset: 'tez',
              recipient: op.to,
              amount: op.amount.toString()
            }
          ]
        };
      }

      if (op.parameter) {
        const tokenTransfers = tryParseTokenTransfers(op.parameter, op.to);
        if (tokenTransfers.length > 0) {
          return {
            type: OpPreviewType.Send,
            transfers: tokenTransfers.map(({ token, to, amount }) => ({
              asset: token,
              recipient: to,
              amount
            }))
          };
        }

        const fa1_2Approve = tryParseFA1_2Approve(op.parameter, op.to);
        if (fa1_2Approve) {
          return {
            type: OpPreviewType.FA1_2Approve,
            asset: fa1_2Approve.token,
            approveTo: fa1_2Approve.to,
            amount: fa1_2Approve.amount
          };
        }

        return {
          type: OpPreviewType.ContractCall,
          contract: op.to,
          entrypoint: op.parameter.entrypoint
        };
      }

    default:
      return {
        type: OpPreviewType.Other,
        opKind: op.kind
      };
  }
}

/**
 * Parse token transfers
 */

type TokenTransferParams = {
  token: Token;
  from: string;
  to: string;
  amount: string;
};

export function tryParseTokenTransfers(parameters: any, destination: string): TokenTransferParams[] {
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

      if (from && to && amount) {
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

          if (from && to && token && amount) {
            tokenTransfers.push({ token, from, to, amount });
          }
        }
      }
    }
  } catch {}

  return tokenTransfers;
}

/**
 * Prase FA1_2 Approve
 */

type FA1_2ApproveParams = {
  token: Token;
  to: string;
  amount: string;
};

function tryParseFA1_2Approve(parameters: any, destination: string): FA1_2ApproveParams | null {
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

      if (to && amount) {
        return {
          token: { contract: destination },
          to,
          amount
        };
      }
    }
  } catch {}

  return null;
}
