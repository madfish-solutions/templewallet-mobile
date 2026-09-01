import { buildContactValidationSchema } from './validation-schema';

const evmAddress = '0xfDc237eff648793c9F3B976c702493f0EE056489';
const tezosAddress = 'tz1XFDgWRqHBbFJmgXqVshnBzVg2SRBZGuXi';

const buildSchema = (contactsAddresses: string[] = [], ownAccounts: string[] = []) =>
  buildContactValidationSchema({ contactsNames: [], contactsAddresses, ownAccounts });

describe('contact validation schema', () => {
  it.each([evmAddress, tezosAddress])('accepts the supported address %s', async address => {
    await expect(buildSchema().validate({ name: 'Contact', address })).resolves.toEqual({ name: 'Contact', address });
  });

  it('rejects an invalid address', async () => {
    await expect(buildSchema().validate({ name: 'Contact', address: 'not-an-address' })).rejects.toThrow(
      'Invalid address'
    );
  });

  it('rejects an existing contact address', async () => {
    await expect(buildSchema([evmAddress]).validate({ name: 'Contact', address: evmAddress })).rejects.toThrow(
      'Contact with the same address already exists'
    );
  });

  it('rejects an own EVM account address', async () => {
    await expect(buildSchema([], [evmAddress]).validate({ name: 'Contact', address: evmAddress })).rejects.toThrow(
      'Your account cannot be added to contacts'
    );
  });

  it('accepts a 20-character contact name', async () => {
    const name = '12345678901234567890';

    await expect(buildSchema().validate({ name, address: tezosAddress })).resolves.toEqual({
      name,
      address: tezosAddress
    });
  });
});
