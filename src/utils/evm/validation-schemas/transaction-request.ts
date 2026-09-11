import { array as arraySchema, mixed as mixedSchema, object as objectSchema, string as stringSchema } from 'yup';

import { isDefined } from 'src/utils/is-defined';

import { evmAddressValidationSchema, hexByteStringSchema, hexStringSchema, oneOfSchemas } from './utils';

const constantStringSchema = <T extends string>(value: T) => stringSchema().oneOf([value]);

const rpcTransactionRequestBaseFragment = {
  from: evmAddressValidationSchema(),
  data: hexByteStringSchema(),
  gas: hexStringSchema(),
  gasLimit: hexStringSchema(),
  nonce: hexStringSchema(),
  to: evmAddressValidationSchema(),
  value: hexStringSchema()
};

const legacyFeeValuesFragment = {
  gasPrice: hexStringSchema(),
  maxFeePerGas: mixedSchema().strip(),
  maxPriorityFeePerGas: mixedSchema().strip()
};

const eip1559FeeValuesFragment = {
  gasPrice: mixedSchema().strip(),
  maxFeePerGas: hexStringSchema(),
  maxPriorityFeePerGas: hexStringSchema()
};

const accessListSchema = () =>
  arraySchema().of(
    objectSchema({
      address: evmAddressValidationSchema().required(),
      storageKeys: arraySchema().of(hexStringSchema().required()).required()
    }).required()
  );

/**
 * EIP-7702 authorization entry (RPC hex quantities). Accepts either `yParity` or legacy `v`.
 */
const authorizationListItemSchema = () =>
  objectSchema({
    address: evmAddressValidationSchema().required(),
    chainId: hexStringSchema().required(),
    nonce: hexStringSchema().required(),
    r: hexByteStringSchema().required(),
    s: hexByteStringSchema().required(),
    yParity: hexStringSchema(),
    v: hexStringSchema()
  })
    .test('parity', 'authorizationList items require yParity or v', value => {
      if (!isDefined(value)) {
        return true;
      }

      return isDefined(value.yParity) || isDefined(value.v);
    })
    .required();

const authorizationListSchema = () => arraySchema().of(authorizationListItemSchema()).min(1);

const feeModelTest = (
  value: { gasPrice?: unknown; maxFeePerGas?: unknown; maxPriorityFeePerGas?: unknown } | undefined
) => {
  if (!isDefined(value)) {
    return true;
  }

  const hasLegacyFee = isDefined(value.gasPrice);
  const hasEip1559Fee = isDefined(value.maxFeePerGas) || isDefined(value.maxPriorityFeePerGas);

  return !(hasLegacyFee && hasEip1559Fee);
};

/** Common WalletConnect / dApp shape without an explicit EIP-2718 `type`. */
const rpcTransactionRequestUntypedValidationSchema = objectSchema({
  ...rpcTransactionRequestBaseFragment,
  gasPrice: hexStringSchema(),
  maxFeePerGas: hexStringSchema(),
  maxPriorityFeePerGas: hexStringSchema(),
  accessList: accessListSchema(),
  authorizationList: authorizationListSchema()
})
  .test('fee-model', 'Cannot mix legacy gasPrice with EIP-1559 fee fields', feeModelTest)
  .required();

const rpcTransactionRequestLegacyValidationSchema = objectSchema({
  ...rpcTransactionRequestBaseFragment,
  ...legacyFeeValuesFragment,
  type: constantStringSchema('0x0').required()
}).required();

const rpcTransactionRequestEIP2930ValidationSchema = objectSchema({
  ...rpcTransactionRequestBaseFragment,
  ...legacyFeeValuesFragment,
  type: constantStringSchema('0x1').required(),
  accessList: accessListSchema()
}).required();

const rpcTransactionRequestEIP1559ValidationSchema = objectSchema({
  ...rpcTransactionRequestBaseFragment,
  ...eip1559FeeValuesFragment,
  type: constantStringSchema('0x2').required(),
  accessList: accessListSchema()
}).required();

const rpcTransactionRequestEIP7702ValidationSchema = objectSchema({
  ...rpcTransactionRequestBaseFragment,
  ...eip1559FeeValuesFragment,
  type: constantStringSchema('0x4').required(),
  authorizationList: authorizationListSchema().required(),
  accessList: accessListSchema()
}).required();

const transactionRequestSchemas = [
  rpcTransactionRequestUntypedValidationSchema,
  rpcTransactionRequestLegacyValidationSchema,
  rpcTransactionRequestEIP2930ValidationSchema,
  rpcTransactionRequestEIP1559ValidationSchema,
  rpcTransactionRequestEIP7702ValidationSchema
];

export const rpcTransactionRequestValidationSchema = () => oneOfSchemas(transactionRequestSchemas);
