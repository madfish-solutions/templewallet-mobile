import { BigNumber } from 'bignumber.js';
import { ValidationError } from 'yup';

import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { EvmAssetStandardEnum } from 'src/token/interfaces/token-metadata.interface';
import { SendAsset } from 'src/types/send-asset';

import { SendModalFormValues, sendModalValidationSchema } from './send-modal.form';

const makeAsset = (chainKind: TempleChainKind): SendAsset =>
  chainKind === TempleChainKind.Tezos
    ? {
        address: 'tez',
        id: 0,
        name: 'Tezos',
        symbol: 'XTZ',
        decimals: 6,
        balance: '100',
        visibility: VisibilityEnum.Visible,
        assetKey: `${chainKind}:mainnet:native`,
        assetSlug: TEZ_TOKEN_SLUG,
        chainKind,
        chainId: 'NetXdQprcVkpaWU',
        networkName: 'Tezos',
        sendStandard: 'tezos'
      }
    : {
        name: 'Etherlink XTZ',
        symbol: 'XTZ',
        decimals: 18,
        balance: '100',
        assetKey: `${chainKind}:mainnet:native`,
        assetSlug: 'eth',
        chainKind,
        chainId: 42793,
        networkName: 'Etherlink',
        sendStandard: EvmAssetStandardEnum.NATIVE
      };

const makeValues = (chainKind: TempleChainKind, recipient: string): SendModalFormValues => ({
  assetAmount: {
    asset: makeAsset(chainKind),
    amount: new BigNumber(1)
  },
  receiverPublicKeyHash: recipient,
  transferBetweenOwnAccounts: false,
  memo: ''
});

describe('sendModalValidationSchema', () => {
  it('reports Required for both empty fields on submit', async () => {
    const error = await sendModalValidationSchema
      .validate(
        {
          ...makeValues(TempleChainKind.Tezos, ''),
          assetAmount: { asset: makeAsset(TempleChainKind.Tezos), amount: undefined }
        },
        { abortEarly: false }
      )
      .catch(caughtError => caughtError);

    expect(error).toBeInstanceOf(ValidationError);
    expect(error).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining(['Required', 'Required'])
      })
    );
  });

  it('accepts an address matching the selected chain', async () => {
    await expect(
      sendModalValidationSchema.validate(makeValues(TempleChainKind.Tezos, 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb'))
    ).resolves.toBeDefined();
    await expect(
      sendModalValidationSchema.validate(makeValues(TempleChainKind.EVM, '0x2222222222222222222222222222222222222222'))
    ).resolves.toBeDefined();
  });

  it('rejects an address from the other chain', async () => {
    await expect(
      sendModalValidationSchema.validate(makeValues(TempleChainKind.EVM, 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb'))
    ).rejects.toThrow('Invalid address');
    await expect(
      sendModalValidationSchema.validate(
        makeValues(TempleChainKind.Tezos, '0x2222222222222222222222222222222222222222')
      )
    ).rejects.toThrow('Invalid address');
  });

  it('validates a selected account against the asset chain', async () => {
    await expect(
      sendModalValidationSchema.validate({
        ...makeValues(TempleChainKind.EVM, ''),
        recipient: {
          name: 'Tezos account',
          address: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb'
        },
        transferBetweenOwnAccounts: true
      })
    ).rejects.toThrow('Invalid address');
  });
});
