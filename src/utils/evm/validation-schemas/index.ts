import { Address, TypedDataDefinition } from 'viem';
import { BaseSchema, string as stringSchema } from 'yup';

import { WcEvmRequestError } from 'src/utils/evm/wc-evm-request-error';

import { rpcTransactionRequestValidationSchema, ValidatedRpcTransactionRequest } from './transaction-request';
import {
  evmAddressValidationSchema,
  hexByteStringSchema,
  jsonTypedDataValidationSchema,
  oldTypedDataValidationSchema,
  oneOfSchemas,
  tupleSchema
} from './utils';
import { ValidatedWatchAssetParams, watchAssetParamsValidationSchema } from './watch-asset';

export type { ValidatedRpcAuthorization, ValidatedRpcTransactionRequest } from './transaction-request';
export type { ValidatedWatchAssetParams } from './watch-asset';

export type OldTypedDataField = {
  name: string;
  type: string;
  value: unknown;
};

export const ethOldSignTypedDataValidationSchema = tupleSchema([
  oldTypedDataValidationSchema().required(),
  evmAddressValidationSchema().required()
]).required();

export const ethSignTypedDataValidationSchema = tupleSchema([
  evmAddressValidationSchema().required(),
  jsonTypedDataValidationSchema().required()
]).required();

export const ethPersonalSignPayloadValidationSchema = oneOfSchemas([
  tupleSchema([
    hexByteStringSchema().required(),
    evmAddressValidationSchema().required(),
    stringSchema().nullable()
  ]).required(),
  tupleSchema([hexByteStringSchema().required(), evmAddressValidationSchema().required()]).required()
]).required();

export const sendTransactionPayloadValidationSchema = tupleSchema([
  rpcTransactionRequestValidationSchema().required()
]).required();

export const validateEvmRpcParams = <T>(schema: BaseSchema, params: unknown): T => {
  try {
    return schema.validateSync(params, { abortEarly: true });
  } catch (cause) {
    throw new WcEvmRequestError('invalid-params', cause instanceof Error ? cause.message : 'Invalid params', {
      cause
    });
  }
};

export const validatePersonalSignParams = (params: unknown): [HexString, Address] => {
  const [message, address] = validateEvmRpcParams<[HexString, Address, string | null] | [HexString, Address]>(
    ethPersonalSignPayloadValidationSchema,
    params
  );

  return [message, address];
};

export const validateSignTypedDataParams = (params: unknown): [Address, TypedDataDefinition] =>
  validateEvmRpcParams(ethSignTypedDataValidationSchema, params);

export const validateOldSignTypedDataParams = (params: unknown): [OldTypedDataField[], Address] =>
  validateEvmRpcParams(ethOldSignTypedDataValidationSchema, params);

export const validateSendTransactionParams = (params: unknown): [ValidatedRpcTransactionRequest] =>
  validateEvmRpcParams(sendTransactionPayloadValidationSchema, params);

export const validateWatchAssetParams = (params: unknown): ValidatedWatchAssetParams => {
  const normalized = Array.isArray(params) ? params[0] : params;

  return validateEvmRpcParams(watchAssetParamsValidationSchema(), normalized);
};
