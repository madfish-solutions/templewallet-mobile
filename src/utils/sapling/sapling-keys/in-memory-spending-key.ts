import { b58Encode, PrefixV2 } from '@taquito/utils';
import * as bip39 from 'bip39';
import {
  getExtendedSpendingKey,
  getExtendedFullViewingKeyFromSpendingKey,
  prepareSpendDescriptionWithSpendingKey,
  signSpendDescription as nativeSignSpendDescription,
  getProofAuthorizingKey
} from 'react-native-sapling';

import { bufToUint8Array, toBase64 } from '../helpers';
import { ParametersSpendProof, ParametersSpendSig, SaplingSpendDescription, SaplingTransactionInput } from '../types';

import { decryptKey } from './helpers';
// eslint-disable-next-line import/no-cycle
import { InMemoryViewingKey } from './in-memory-viewing-key';

/**
 * @description holds the spending key, create proof and signature for spend descriptions
 * can instantiate from mnemonic word list or decrypt a encrypted spending key
 * with access to instantiate a InMemoryViewingKey
 */
export class InMemorySpendingKey {
  #spendingKeyBuf: Buffer;
  #saplingViewingKey: InMemoryViewingKey | undefined;
  /**
   *
   * @param spendingKey unencrypted sask... or encrypted MMXj...
   * @param password required for MMXj encrypted keys
   */
  constructor(spendingKey: string, password?: string) {
    this.#spendingKeyBuf = decryptKey(spendingKey, password);
  }

  /**
   *
   * @param mnemonic string of words
   * @param derivationPath tezos current standard 'm/'
   * @returns InMemorySpendingKey class instantiated
   */
  static async fromMnemonic(mnemonic: string, derivationPath = 'm/') {
    // no password passed here. password provided only changes from sask -> MMXj
    const fullSeed = await bip39.mnemonicToSeed(mnemonic);

    const first32: Buffer = fullSeed.slice(0, 32);
    const second32: Buffer = fullSeed.slice(32);
    // reduce seed bytes must be 32 bytes reflecting both halves
    const seed = Buffer.from(first32.map((byte, index) => byte ^ second32[index]));

    const spendingKeyArr = bufToUint8Array(
      Buffer.from(await getExtendedSpendingKey(toBase64(seed), derivationPath), 'base64')
    );

    const spendingKey = b58Encode(spendingKeyArr, PrefixV2.SaplingSpendingKey);

    return new InMemorySpendingKey(spendingKey);
  }

  /**
   *
   * @returns InMemoryViewingKey instantiated class
   */
  async getSaplingViewingKeyProvider() {
    let viewingKey: Buffer;
    if (!this.#saplingViewingKey) {
      viewingKey = Buffer.from(
        await getExtendedFullViewingKeyFromSpendingKey(toBase64(this.#spendingKeyBuf)),
        'base64'
      );
      this.#saplingViewingKey = new InMemoryViewingKey(viewingKey.toString('hex'));
    }

    return this.#saplingViewingKey;
  }

  /**
   * @description Prepare an unsigned sapling spend description using the spending key
   * @param parametersSpendProof.saplingContext The sapling proving context
   * @param parametersSpendProof.address The address of the input
   * @param parametersSpendProof.randomCommitmentTrapdoor The randomness of the commitment
   * @param parametersSpendProof.publicKeyReRandomization The re-randomization of the public key
   * @param parametersSpendProof.amount The value of the input
   * @param parametersSpendProof.root The root of the merkle tree
   * @param parametersSpendProof.witness The path of the commitment in the tree
   * @param derivationPath tezos current standard 'm/'
   * @returns The unsigned spend description
   */
  async prepareSpendDescription(
    parametersSpendProof: ParametersSpendProof
  ): Promise<Omit<SaplingSpendDescription, 'signature'>> {
    const spendDescription = Buffer.from(
      await prepareSpendDescriptionWithSpendingKey(
        parametersSpendProof.saplingContext,
        toBase64(this.#spendingKeyBuf),
        toBase64(parametersSpendProof.address),
        toBase64(parametersSpendProof.randomCommitmentTrapdoor),
        toBase64(parametersSpendProof.publicKeyReRandomization),
        Number(parametersSpendProof.amount),
        Buffer.from(parametersSpendProof.root, 'hex').toString('base64'),
        Buffer.from(parametersSpendProof.witness, 'hex').toString('base64')
      ),
      'base64'
    );

    return {
      commitmentValue: spendDescription.slice(0, 32),
      nullifier: spendDescription.slice(64, 96),
      publicKeyReRandomization: spendDescription.slice(96, 128),
      rtAnchor: spendDescription.slice(32, 64),
      proof: spendDescription.slice(128, 320)
    };
  }

  /**
   * @description Sign a sapling spend description
   * @param parametersSpendSig.publicKeyReRandomization The re-randomization of the public key
   * @param parametersSpendSig.unsignedSpendDescription The unsigned Spend description
   * @param parametersSpendSig.hash The data to be signed
   * @returns The signed spend description
   */
  async signSpendDescription(parametersSpendSig: ParametersSpendSig): Promise<SaplingTransactionInput> {
    const { commitmentValue, rtAnchor, nullifier, publicKeyReRandomization, proof } =
      parametersSpendSig.unsignedSpendDescription;
    const signedSpendDescription = Buffer.from(
      await nativeSignSpendDescription(
        Buffer.concat(
          [commitmentValue, rtAnchor, nullifier, publicKeyReRandomization, proof].map(buf => bufToUint8Array(buf))
        ).toString('base64'),
        toBase64(this.#spendingKeyBuf),
        toBase64(parametersSpendSig.publicKeyReRandomization),
        toBase64(parametersSpendSig.hash)
      ),
      'base64'
    );

    return {
      commitmentValue: signedSpendDescription.slice(0, 32),
      nullifier: signedSpendDescription.slice(64, 96),
      publicKeyReRandomization: signedSpendDescription.slice(96, 128),
      proof: signedSpendDescription.slice(128, 320),
      signature: signedSpendDescription.slice(320, 384)
    };
  }

  /**
   * @description Return a proof authorizing key from the configured spending key
   */
  async getProvingKey() {
    const provingKey = await getProofAuthorizingKey(toBase64(this.#spendingKeyBuf));

    return Buffer.from(provingKey, 'base64').toString('hex');
  }
}
