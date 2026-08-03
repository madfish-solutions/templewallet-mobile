import { BigNumber } from 'bignumber.js';

import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { TEZ_SHIELDED_TOKEN_SLUG, TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { EvmAssetStandardEnum } from 'src/token/interfaces/token-metadata.interface';
import { EvmNativeSendAsset, TezosSendAsset } from 'src/types/send-asset';

import { createSendIntent } from './create-send-intent';

const EVM_ADDRESS = '0x2222222222222222222222222222222222222222';
const TEZOS_ADDRESS = 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb';
const SAPLING_ADDRESS = 'zet12Q2EgWK7Xc322r9r6JVG5bLgLF9GJWS6gJpDW6Lh4nrgMPTFS6JEKVbAuqjicPEuE';

const makeTezosAsset = (overrides: Partial<TezosSendAsset> = {}): TezosSendAsset => ({
  address: 'tez',
  id: 0,
  name: 'Tezos',
  symbol: 'XTZ',
  decimals: 6,
  balance: '1000000',
  visibility: VisibilityEnum.Visible,
  assetKey: `tezos:mainnet:${TEZ_TOKEN_SLUG}`,
  assetSlug: TEZ_TOKEN_SLUG,
  chainKind: TempleChainKind.Tezos,
  chainId: 'mainnet',
  networkName: 'Tezos',
  sendStandard: 'tezos',
  ...overrides
});

const makeEvmAsset = (): EvmNativeSendAsset => ({
  name: 'Etherlink XTZ',
  symbol: 'XTZ',
  decimals: 18,
  balance: '1000000',
  assetKey: 'evm:42793:eth',
  assetSlug: 'eth',
  chainKind: TempleChainKind.EVM,
  chainId: 42793,
  networkName: 'Etherlink',
  sendStandard: EvmAssetStandardEnum.NATIVE
});

const makeParams = (overrides: Partial<Parameters<typeof createSendIntent>[0]> = {}) => ({
  accountId: 'account-id',
  amount: new BigNumber(100),
  asset: makeTezosAsset(),
  evmAddress: EVM_ADDRESS,
  isOnRampEnabled: true,
  memo: '',
  receiverAddress: TEZOS_ADDRESS,
  tezosAddress: TEZOS_ADDRESS,
  tezosBalance: '1000',
  ...overrides
});

describe('createSendIntent', () => {
  it('creates an EVM transfer intent', () => {
    const asset = makeEvmAsset();

    expect(createSendIntent(makeParams({ asset, receiverAddress: EVM_ADDRESS }))).toEqual({
      success: true,
      intent: {
        type: 'evm-transfer',
        accountId: 'account-id',
        asset,
        receiverAddress: EVM_ADDRESS,
        atomicAmount: '100'
      }
    });
  });

  it('rejects an EVM transfer without an EVM account', () => {
    const asset = makeEvmAsset();

    expect(createSendIntent(makeParams({ asset, evmAddress: undefined }))).toEqual({
      success: false,
      reason: 'missing-evm-account'
    });
  });

  it('rejects a Tezos transfer without a Tezos account', () => {
    expect(createSendIntent(makeParams({ tezosAddress: undefined }))).toEqual({
      success: false,
      reason: 'missing-tezos-account'
    });
  });

  it.each([
    [SAPLING_ADDRESS, 'transfer', 'memo'],
    [TEZOS_ADDRESS, 'unshield', undefined]
  ] as const)('creates a shielded Tez %s intent', (receiverAddress, type, memo) => {
    expect(
      createSendIntent(
        makeParams({
          asset: makeTezosAsset({ assetSlug: TEZ_SHIELDED_TOKEN_SLUG, sendStandard: 'shielded-tez' }),
          memo: 'memo',
          receiverAddress
        })
      )
    ).toEqual({
      success: true,
      intent: {
        type: 'sapling-transaction',
        transactionType: type,
        amount: '100',
        recipientAddress: receiverAddress,
        ...(memo && { memo })
      }
    });
  });

  it('creates a shield intent for Tez sent to a Sapling address', () => {
    expect(createSendIntent(makeParams({ memo: 'memo', receiverAddress: SAPLING_ADDRESS }))).toEqual({
      success: true,
      intent: {
        type: 'sapling-transaction',
        transactionType: 'shield',
        amount: '100',
        recipientAddress: SAPLING_ADDRESS,
        memo: 'memo'
      }
    });
  });

  it('opens on-ramp when the Tez amount exceeds the balance', () => {
    expect(createSendIntent(makeParams({ amount: new BigNumber(1001) }))).toEqual({
      success: true,
      intent: { type: 'on-ramp' }
    });
  });

  it('creates a regular transfer when on-ramp is disabled', () => {
    const asset = makeTezosAsset();

    expect(createSendIntent(makeParams({ amount: new BigNumber(1001), asset, isOnRampEnabled: false }))).toEqual({
      success: true,
      intent: {
        type: 'tezos-transfer',
        asset,
        receiverAddress: TEZOS_ADDRESS,
        amount: '1001'
      }
    });
  });
});
