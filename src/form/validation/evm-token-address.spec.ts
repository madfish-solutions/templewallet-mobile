import { evmTokenAddressValidation } from './evm-token-address';

describe('evmTokenAddressValidation', () => {
  it('accepts a valid EVM contract address', async () => {
    await expect(evmTokenAddressValidation.isValid('0x0f5d2fb29fb7d3cfee444a200298f468908cc942')).resolves.toEqual(
      true
    );
  });

  it('rejects an empty value', async () => {
    await expect(evmTokenAddressValidation.isValid('')).resolves.toEqual(false);
  });

  it('rejects a Tezos address with a network mismatch message', async () => {
    await expect(evmTokenAddressValidation.validate('KT1PWx2mnDueood7fEmfbBDKx1D9BAnnXitn')).rejects.toThrow(
      'You entered the Tezos address. Please enter the EVM address'
    );
  });

  it('rejects a malformed value as invalid address', async () => {
    await expect(evmTokenAddressValidation.validate('0xNOT_AN_ADDRESS')).rejects.toThrow('Invalid address');
  });
});
