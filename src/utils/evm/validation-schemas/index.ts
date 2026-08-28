import { Address, TypedDataDefinition } from 'viem';
import { BaseSchema, string as stringSchema, ValidationError } from 'yup';

import { OldTypedData, ValidatedRpcTransactionRequest } from 'src/types/strict-wc-session-request';
import { WcEvmRequestError } from 'src/utils/evm/wc-evm-request-error';

import { rpcTransactionRequestValidationSchema } from './transaction-request';
import {
  evmAddressValidationSchema,
  hexByteStringSchema,
  jsonTypedDataValidationSchema,
  oldTypedDataValidationSchema,
  oneOfSchemas,
  tupleSchema
} from './utils';
import { ValidatedWatchAssetParams, watchAssetParamsValidationSchema } from './watch-asset';

const ethOldSignTypedDataValidationSchema = tupleSchema([
  oldTypedDataValidationSchema().required(),
  evmAddressValidationSchema().required()
]).required();

const ethSignTypedDataValidationSchema = tupleSchema([
  evmAddressValidationSchema().required(),
  jsonTypedDataValidationSchema().required()
]).required();

const ethPersonalSignPayloadValidationSchema = oneOfSchemas([
  tupleSchema([
    hexByteStringSchema().required(),
    evmAddressValidationSchema().required(),
    stringSchema().nullable()
  ]).required(),
  tupleSchema([hexByteStringSchema().required(), evmAddressValidationSchema().required()]).required()
]).required();

const sendTransactionPayloadValidationSchema = tupleSchema([
  rpcTransactionRequestValidationSchema().required()
]).required();

const validateEvmRpcParams = <T>(schema: BaseSchema, params: unknown): T => {
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

export const validateOldSignTypedDataParams = (params: unknown): [OldTypedData, Address] =>
  validateEvmRpcParams(ethOldSignTypedDataValidationSchema, params);

export const validateSendTransactionParams = (params: unknown): [ValidatedRpcTransactionRequest] =>
  validateEvmRpcParams(sendTransactionPayloadValidationSchema, params);

export const validateWatchAssetParams = (params: unknown): ValidatedWatchAssetParams => {
  if (Array.isArray(params) && params.length !== 1) {
    throw new ValidationError('The array must contain exactly one element');
  }

  const normalized = Array.isArray(params) ? params[0] : params;

  return validateEvmRpcParams(watchAssetParamsValidationSchema(), normalized);
};
