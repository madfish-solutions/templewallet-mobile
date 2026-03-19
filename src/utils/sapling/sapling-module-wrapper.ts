import { randomBytes } from '@stablelib/random';
import {
  randR as nativeRandR,
  getOutgoingViewingKey as nativeGetOutgoingViewingKey,
  preparePartialOutputDescription as nativePreparePartialOutputDescription,
  getDiversifierFromRawPaymentAddress as nativeGetDiversifierFromRawPaymentAddress,
  getPkdFromRawPaymentAddress as nativeGetPkdFromRawPaymentAddress,
  keyAgreement as nativeKeyAgreement,
  createBindingSignature as nativeCreateBindingSignature,
  initParameters as nativeInitParameters,
  initProvingContext,
  dropProvingContext,
  deriveEpkFromEsk
} from 'react-native-sapling';

import { toBase64 } from './helpers';
import { getSaplingParams } from './sapling-params-provider';
import { ParametersOutputProof } from './types';

let saplingInitPromise: Promise<void> | undefined;

export class SaplingWrapper {
  async withProvingContext<T>(action: (context: string) => Promise<T>) {
    await this.initSaplingParameters();

    const context = await initProvingContext();
    const result: T = await action(context);
    await dropProvingContext(context);

    return result;
  }

  getRandomBytes(length: number) {
    return randomBytes(length);
  }

  async randR() {
    return Buffer.from(await nativeRandR(), 'base64');
  }

  async getOutgoingViewingKey(vk: Buffer) {
    return Buffer.from(await nativeGetOutgoingViewingKey(toBase64(vk)), 'base64');
  }

  async preparePartialOutputDescription(parametersOutputProof: ParametersOutputProof) {
    const partialOutputDesc = Buffer.from(
      await nativePreparePartialOutputDescription(
        parametersOutputProof.saplingContext,
        toBase64(parametersOutputProof.address),
        toBase64(parametersOutputProof.randomCommitmentTrapdoor),
        toBase64(parametersOutputProof.ephemeralPrivateKey),
        Number(parametersOutputProof.amount)
      ),
      'base64'
    );

    return {
      commitmentValue: partialOutputDesc.slice(0, 32),
      commitment: partialOutputDesc.slice(32, 64),
      proof: partialOutputDesc.slice(64, 256)
    };
  }

  async getDiversifiedFromRawPaymentAddress(decodedDestination: Uint8Array) {
    return Buffer.from(await nativeGetDiversifierFromRawPaymentAddress(toBase64(decodedDestination)), 'base64');
  }

  async deriveEphemeralPublicKey(diversifier: Buffer, esk: Buffer) {
    return Buffer.from(await deriveEpkFromEsk(toBase64(diversifier), toBase64(esk)), 'base64');
  }

  async getPkdFromRawPaymentAddress(destination: Uint8Array) {
    return Buffer.from(await nativeGetPkdFromRawPaymentAddress(toBase64(destination)), 'base64');
  }

  async keyAgreement(p: Buffer, sk: Buffer) {
    return Buffer.from(await nativeKeyAgreement(toBase64(p), toBase64(sk)), 'base64');
  }

  async createBindingSignature(saplingContext: string, balance: string, transactionSigHash: Uint8Array) {
    return Buffer.from(
      await nativeCreateBindingSignature(saplingContext, Number(balance), toBase64(transactionSigHash)),
      'base64'
    );
  }

  async initSaplingParameters() {
    if (!saplingInitPromise) {
      saplingInitPromise = (async () => {
        const { spend, output } = await getSaplingParams();
        const spendParams = spend.saplingSpendParams;
        const outputParams = output.saplingOutputParams;

        await nativeInitParameters(spendParams, outputParams);
      })();
    }

    return saplingInitPromise;
  }
}
