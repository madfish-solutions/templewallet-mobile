import { getProofAuthorizingKey, prepareSpendDescriptionWithAuthorizingKey } from 'react-native-sapling';

import { toBase64 } from '../helpers';
import { ParametersSpendProof, SaplingSpendDescription } from '../types';

import { decryptKey } from './helpers';

/**
 * @description holds the proving key, create proof for spend descriptions
 * The class can be instantiated from a proving key or a spending key
 */
export class InMemoryProvingKey {
  #provingKey: Buffer;

  constructor(provingKey: string) {
    this.#provingKey = Buffer.from(provingKey, 'hex');
  }

  /**
   * @description Allows to instantiate the InMemoryProvingKey from an encrypted/unencrypted spending key
   *
   * @param spendingKey Base58Check-encoded spending key
   * @param password Optional password to decrypt the spending key
   * @example
   * ```
   * await InMemoryProvingKey.fromSpendingKey('sask27SLmU9herddHz4qFJBLMjWYMbJF8RtS579w9ej9mfCYK7VUdyCJPHK8AzW9zMsopGZEkYeNjAY7Zz1bkM7CGu8eKLzrjBLTMC5wWJDhxiK91ahA29rhDRsHdJDV2u2jFwb2MNUix8JW7sAkAqYVaJpCehTBPgRQ1KqKwqqUaNmuD8kazd4Q8MCWmgbWs21Yuomdqyi9FLigjRp7oY4m5adaVU19Nj1AHvsMY2tePeU2L')
   * ```
   *
   */
  static async fromSpendingKey(spendingKey: string, password?: string) {
    const decodedSpendingKey = decryptKey(spendingKey, password);
    const provingKey = await getProofAuthorizingKey(decodedSpendingKey.toString('base64'));

    return new InMemoryProvingKey(Buffer.from(provingKey, 'base64').toString('hex'));
  }

  /**
   * @description Prepare an unsigned sapling spend description using the proving key
   *
   * @param parametersSpendProof.saplingContext The sapling proving context
   * @param parametersSpendProof.address The address of the input
   * @param parametersSpendProof.randomCommitmentTrapdoor The randomness of the commitment
   * @param parametersSpendProof.publicKeyReRandomization The re-randomization of the public key
   * @param parametersSpendProof.amount The value of the input
   * @param parametersSpendProof.root The root of the merkle tree
   * @param parametersSpendProof.witness The path of the commitment in the tree
   * @param derivationPath tezos current standard 'm/'
   * @returns The unsinged spend description
   */
  async prepareSpendDescription(
    parametersSpendProof: Omit<ParametersSpendProof, 'spendingKey'>
  ): Promise<Omit<SaplingSpendDescription, 'signature'>> {
    const spendDescription = Buffer.from(
      await prepareSpendDescriptionWithAuthorizingKey(
        parametersSpendProof.saplingContext,
        toBase64(this.#provingKey),
        toBase64(parametersSpendProof.address),
        toBase64(parametersSpendProof.randomCommitmentTrapdoor),
        toBase64(parametersSpendProof.publicKeyReRandomization),
        Number(parametersSpendProof.amount),
        Buffer.from(parametersSpendProof.root, 'hex').toString('base64'),
        Buffer.from(parametersSpendProof.witness, 'hex').toString('base64')
      )
    );

    return {
      commitmentValue: spendDescription.slice(0, 32),
      nullifier: spendDescription.slice(64, 96),
      publicKeyReRandomization: spendDescription.slice(96, 128),
      rtAnchor: spendDescription.slice(32, 64),
      proof: spendDescription.slice(128, 320)
    };
  }
}
