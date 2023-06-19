import { MichelsonMapKey } from '@taquito/michelson-encoder';
import { MichelsonMap } from '@taquito/taquito';

type BigMapKeyType = string | number | object;

export interface BigMap<Key extends BigMapKeyType, Value> {
  get(keyToEncode: Key, block?: number): Promise<Value | undefined>;
  getMultipleValues(
    keysToEncode: Array<Key>,
    block?: number,
    batchSize?: number
  ): Promise<MichelsonMap<MichelsonMapKey, Value | undefined>>;
  toJSON(): string;
  toString(): string;
}
