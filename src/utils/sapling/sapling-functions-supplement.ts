import { assert } from '../assert.utils';

import { SaplingFunctionsSupplement } from './types';

let supplement: SaplingFunctionsSupplement | undefined;

export const setSaplingFunctionsSupplement = (newSupplement: SaplingFunctionsSupplement) => {
  supplement = newSupplement;
};

export const clearSaplingFunctionsSupplement = () => {
  supplement = undefined;
};

export const getProofAuthorizingKey: SaplingFunctionsSupplement['getProofAuthorizingKey'] = async spendingKey => {
  assert(supplement);

  return supplement.getProofAuthorizingKey(spendingKey);
};

export const getRawPaymentAddress: SaplingFunctionsSupplement['getRawPaymentAddress'] = async (
  viewingKey,
  diversifier
) => {
  assert(supplement);

  return supplement.getRawPaymentAddress(viewingKey, diversifier);
};

export const keyAgreement: SaplingFunctionsSupplement['keyAgreement'] = async (p, sk) => {
  assert(supplement);

  return supplement.keyAgreement(p, sk);
};

export const getPkdFromRawPaymentAddress: SaplingFunctionsSupplement['getPkdFromRawPaymentAddress'] = async address => {
  assert(supplement);

  return supplement.getPkdFromRawPaymentAddress(address);
};

export const prepareSpendDescriptionWithAuthorizingKey: SaplingFunctionsSupplement['prepareSpendDescriptionWithAuthorizingKey'] =
  async (
    saplingContext,
    provingKey,
    address,
    randomCommitmentTrapdoor,
    publicKeyReRandomization,
    amount,
    root,
    witness
  ) => {
    assert(supplement);

    return supplement.prepareSpendDescriptionWithAuthorizingKey(
      saplingContext,
      provingKey,
      address,
      randomCommitmentTrapdoor,
      publicKeyReRandomization,
      amount,
      root,
      witness
    );
  };

export const deriveEpkFromEsk: SaplingFunctionsSupplement['deriveEpkFromEsk'] = async (diversifier, esk) => {
  assert(supplement);

  return supplement.deriveEpkFromEsk(diversifier, esk);
};

export const getOutgoingViewingKey: SaplingFunctionsSupplement['getOutgoingViewingKey'] = async spendingKey => {
  assert(supplement);

  return supplement.getOutgoingViewingKey(spendingKey);
};
