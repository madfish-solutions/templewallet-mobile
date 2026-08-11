import { AccessList, SignedAuthorization } from 'viem';

import { Eip1559Fees, LegacyFees } from 'src/utils/evm/estimate-evm-transaction';
import { WcEvmRequestError } from 'src/utils/evm/wc-evm-request-error';
import { isDefined } from 'src/utils/is-defined';

import { ValidatedRpcAuthorization, ValidatedRpcTransactionRequest } from './validation-schemas';

interface EvmRpcTransactionRequestBase {
  to?: HexString;
  value: bigint;
  data?: HexString;
  nonce?: number;
}

/**
 * Fee fields may be omitted so viem (or a later confirmation UI) can fill / override them.
 * When present, they reuse the same {@link LegacyFees} / {@link Eip1559Fees} shapes used elsewhere.
 */
export type ParsedEvmRpcTransactionRequest =
  | EvmRpcTransactionRequestBase
  | (EvmRpcTransactionRequestBase & RequiredBy<Partial<LegacyFees>, 'type'>)
  | (EvmRpcTransactionRequestBase & RequiredBy<Partial<Eip1559Fees>, 'type'> & { accessList?: AccessList })
  | (EvmRpcTransactionRequestBase & {
      type: 'eip2930';
      gasPrice?: bigint;
      accessList?: AccessList;
    })
  | (EvmRpcTransactionRequestBase & {
      type: 'eip7702';
      maxFeePerGas?: bigint;
      maxPriorityFeePerGas?: bigint;
      authorizationList: SignedAuthorization[];
      accessList?: AccessList;
    });

const toBigInt = (value: string | undefined): bigint | undefined => {
  if (value === undefined || value === '' || value === '0x') {
    return undefined;
  }

  return BigInt(value);
};

const toNumber = (value: string | undefined): number | undefined => {
  const asBigInt = toBigInt(value);

  return asBigInt === undefined ? undefined : Number(asBigInt);
};

const toYParity = (authorization: ValidatedRpcAuthorization): number => {
  if (isDefined(authorization.yParity)) {
    return Number(BigInt(authorization.yParity));
  }

  if (!isDefined(authorization.v)) {
    throw new WcEvmRequestError('invalid-params', 'authorizationList items require yParity or v');
  }

  const v = Number(BigInt(authorization.v));

  if (v === 0 || v === 1) {
    return v;
  }

  if (v === 27 || v === 28) {
    return v - 27;
  }

  throw new WcEvmRequestError('invalid-params', `Unsupported authorizationList v value: ${authorization.v}`);
};

const parseAccessList = (accessList: ValidatedRpcTransactionRequest['accessList']): AccessList | undefined =>
  accessList?.map(item => ({
    address: item.address,
    storageKeys: item.storageKeys
  }));

const parseAuthorizationList = (
  authorizationList: ValidatedRpcAuthorization[] | undefined
): SignedAuthorization[] | undefined => {
  if (!isDefined(authorizationList)) {
    return undefined;
  }

  return authorizationList.map(authorization => ({
    address: authorization.address,
    chainId: Number(BigInt(authorization.chainId)),
    nonce: Number(BigInt(authorization.nonce)),
    r: authorization.r,
    s: authorization.s,
    yParity: toYParity(authorization)
  }));
};

/**
 * Converts a yup-validated RPC transaction (hex-encoded fields) into viem sendTransaction params.
 *
 * Fee model is determined by which fee fields are present. A bare EIP-2718 `type` of `0x2` without
 * EIP-1559 fee fields must not drop a provided `gasPrice` — otherwise viem re-estimates fees from
 * the network (e.g. Etherlink's ~1 GWEI base fee).
 */
export const parseRpcTransactionRequest = (
  transaction: ValidatedRpcTransactionRequest
): ParsedEvmRpcTransactionRequest => {
  const gas = toBigInt(transaction.gas ?? transaction.gasLimit);
  const gasPrice = toBigInt(transaction.gasPrice);
  const maxFeePerGas = toBigInt(transaction.maxFeePerGas);
  const maxPriorityFeePerGas = toBigInt(transaction.maxPriorityFeePerGas);
  const value = toBigInt(transaction.value) ?? 0n;
  const nonce = toNumber(transaction.nonce);
  const accessList = parseAccessList(transaction.accessList);
  const authorizationList = parseAuthorizationList(transaction.authorizationList);

  const baseRequest: EvmRpcTransactionRequestBase = {
    to: transaction.to,
    value,
    ...(isDefined(transaction.data) ? { data: transaction.data } : {}),
    ...(isDefined(gas) ? { gas } : {}),
    ...(isDefined(nonce) ? { nonce } : {})
  };

  const hasLegacyFee = isDefined(gasPrice);
  const hasEip1559Fee = isDefined(maxFeePerGas) || isDefined(maxPriorityFeePerGas);

  if (hasLegacyFee && hasEip1559Fee) {
    throw new WcEvmRequestError('invalid-params', 'Cannot mix legacy gasPrice with EIP-1559 fee fields');
  }

  if (isDefined(authorizationList) || transaction.type === '0x4') {
    if (!isDefined(authorizationList)) {
      throw new WcEvmRequestError('invalid-params', 'EIP-7702 transactions require authorizationList');
    }

    return {
      ...baseRequest,
      type: 'eip7702',
      authorizationList,
      ...(isDefined(accessList) ? { accessList } : {}),
      ...(isDefined(maxFeePerGas) ? { maxFeePerGas } : {}),
      ...(isDefined(maxPriorityFeePerGas) ? { maxPriorityFeePerGas } : {})
    };
  }

  if (transaction.type === '0x1' || (isDefined(accessList) && hasLegacyFee && !hasEip1559Fee)) {
    return {
      ...baseRequest,
      type: 'eip2930',
      ...(isDefined(accessList) ? { accessList } : {}),
      ...(isDefined(gasPrice) ? { gasPrice } : {})
    };
  }

  if (hasEip1559Fee || (transaction.type === '0x2' && !hasLegacyFee)) {
    return {
      ...baseRequest,
      type: 'eip1559',
      ...(isDefined(accessList) ? { accessList } : {}),
      ...(isDefined(maxFeePerGas) ? { maxFeePerGas } : {}),
      ...(isDefined(maxPriorityFeePerGas) ? { maxPriorityFeePerGas } : {})
    };
  }

  if (isDefined(gasPrice)) {
    return {
      ...baseRequest,
      type: 'legacy',
      gasPrice
    };
  }

  return baseRequest;
};
