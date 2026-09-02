import { tokenAddressValidation } from './token-address';

jest.mock('src/utils/sapling/address-utils', () => ({
  isSaplingAddress: (address: string) => address.startsWith('zet1')
}));

describe('tokenAddressValidation', () => {
  it('accepts a valid KT contract address', async () => {
    await expect(tokenAddressValidation.isValid('KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn')).resolves.toEqual(true);
  });

  it('rejects an implicit tz address as non-contract', async () => {
    await expect(tokenAddressValidation.validate('tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN')).rejects.toThrow(
      'Only KT... contract address allowed'
    );
  });

  it('rejects an EVM address with a network mismatch message', async () => {
    await expect(tokenAddressValidation.validate('0x0f5d2fb29fb7d3cfee444a200298f468908cc942')).rejects.toThrow(
      'You entered the EVM address. Please enter the Tezos address'
    );
  });

  it('rejects a sapling address with the contract-only message instead of a network mismatch', async () => {
    await expect(
      tokenAddressValidation.validate('zet14CMN2T4x1NpsK8wRow9jGGSDGm8VgTB79QiZbDDJgHRLZzUUsdRmc11cM1s6HTGx4')
    ).rejects.toThrow('Only KT... contract address allowed');
  });

  it('rejects a Tron address with a network mismatch message', async () => {
    await expect(tokenAddressValidation.validate('TJRabPrwbZy45sbavfcjinPJC18kjpRTv8')).rejects.toThrow(
      'You entered the Tron address. Please enter the Tezos address'
    );
  });

  it('rejects a malformed value', async () => {
    await expect(tokenAddressValidation.isValid('not-an-address')).resolves.toEqual(false);
  });
});
