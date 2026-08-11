import { getAddress, isAddress } from 'viem';
import {
  array as arraySchema,
  BaseSchema,
  mixed as mixedSchema,
  number as numberSchema,
  object as objectSchema,
  string as stringSchema
} from 'yup';

export const evmAddressValidationSchema = () =>
  stringSchema()
    .test('valid', 'Invalid address', value => (value === undefined ? true : isAddress(value)))
    .transform(function (value: unknown) {
      return typeof value === 'string' && isAddress(value) ? getAddress(value) : value;
    });

const HEX_STRING_REGEX = /^0x([0-9a-f]*)$/i;

export const hexStringSchema = () => stringSchema().matches(HEX_STRING_REGEX, 'Invalid hex string');

export const hexByteStringSchema = () =>
  hexStringSchema().test('even-digits', 'String must contain even amount of digits', value => {
    if (value === undefined) {
      return true;
    }

    const match = value.match(HEX_STRING_REGEX);

    return !match || match[1].length % 2 === 0;
  });

const typedDataTypeSchema = arraySchema()
  .of(
    objectSchema({
      name: stringSchema().required(),
      type: stringSchema().required()
    }).required()
  )
  .required();

const typedDataDomainSchema = objectSchema().shape({
  chainId: numberSchema().integer().positive(),
  name: stringSchema().min(1),
  salt: hexByteStringSchema(),
  verifyingContract: evmAddressValidationSchema(),
  version: stringSchema().min(1)
});

const typedDataTypesSchema = objectSchema().test(
  'valid-types',
  'Invalid types',
  (value: StringRecord<unknown> | undefined) => {
    if (value === undefined) {
      return true;
    }

    const keys = Object.keys(value);

    return (
      keys.includes('EIP712Domain') &&
      keys.every(key => {
        try {
          typedDataTypeSchema.validateSync(value[key]);

          return true;
        } catch {
          return false;
        }
      })
    );
  }
);

const arbitraryObjectSchema = objectSchema().required();

export const oldTypedDataValidationSchema = () =>
  arraySchema().of(
    objectSchema({
      name: stringSchema().required(),
      type: stringSchema().required(),
      value: mixedSchema().required()
    }).required()
  );

export const typedDataValidationSchema = () =>
  objectSchema({
    types: typedDataTypesSchema,
    primaryType: stringSchema().required(),
    domain: typedDataDomainSchema,
    message: arbitraryObjectSchema
  });

/** yup 0.32 has no `.json()`; parse JSON strings before object validation. */
export const jsonTypedDataValidationSchema = () =>
  typedDataValidationSchema().transform(function (value: unknown) {
    if (typeof value !== 'string') {
      return value;
    }

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  });

/**
 * yup 0.32 has no `tuple`; validate fixed-length arrays element-wise and return transformed values.
 */
export const tupleSchema = (elementSchemas: BaseSchema[]) =>
  arraySchema()
    .min(elementSchemas.length)
    .max(elementSchemas.length)
    .test('tuple', 'Invalid params tuple', function (value) {
      if (!Array.isArray(value) || value.length !== elementSchemas.length) {
        return false;
      }

      try {
        elementSchemas.forEach((schema: BaseSchema, index: number) => {
          schema.validateSync(value[index]);
        });

        return true;
      } catch (error) {
        return this.createError({
          message: error instanceof Error ? error.message : 'Invalid params tuple'
        });
      }
    })
    .transform(value => {
      if (!Array.isArray(value)) {
        return value;
      }

      return elementSchemas.map((schema: BaseSchema, index: number) => schema.validateSync(value[index]));
    });

export const oneOfSchemas = (schemas: BaseSchema[]) =>
  mixedSchema()
    .test('one-of-schemas', 'Value does not match any allowed schema', function (value) {
      const errors: string[] = [];

      for (const schema of schemas) {
        try {
          schema.validateSync(value);

          return true;
        } catch (error) {
          if (error instanceof Error) {
            errors.push(error.message);
          }
        }
      }

      return this.createError({
        message: errors[0] ?? 'Value does not match any allowed schema'
      });
    })
    .transform(value => {
      for (const schema of schemas) {
        try {
          return schema.validateSync(value);
        } catch {
          // try next schema
        }
      }

      return value;
    });
