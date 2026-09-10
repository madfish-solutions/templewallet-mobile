import { ActivityOperKindEnum, ActivityOperTransferType, EvmOperation, TezosOperation } from 'src/activity/types';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';

import { getActivityRowAmountView, getEvmBundleFaceAsset, getTezosBundleFaceAsset } from './utils';

const makeTezosTransfer = (assetSlug: string, amountSigned: string): TezosOperation => ({
  kind: ActivityOperKindEnum.transfer,
  type: ActivityOperTransferType.receive,
  fromAddress: 'tz1From',
  toAddress: 'tz1To',
  assetSlug,
  amountSigned
});

describe('getTezosBundleFaceAsset', () => {
  it('picks the first nonzero-transfer slug and sums it, when no preference is given', () => {
    const operations = [makeTezosTransfer('kt1aaa', '10'), makeTezosTransfer('kt1bbb', '5')];

    expect(getTezosBundleFaceAsset(operations)).toEqual({ assetSlug: 'kt1aaa', amountSigned: '10' });
  });

  it('prefers the matched slug and sums it, even when another slug comes first', () => {
    const operations = [
      makeTezosTransfer('kt1aaa', '10'),
      makeTezosTransfer('kt1bbb', '5'),
      makeTezosTransfer('kt1bbb', '7')
    ];

    expect(getTezosBundleFaceAsset(operations, 'kt1bbb')).toEqual({ assetSlug: 'kt1bbb', amountSigned: '12' });
  });

  it('falls back to the first-candidate rule when the preferred slug has no nonzero transfer', () => {
    const operations = [makeTezosTransfer('kt1aaa', '10'), makeTezosTransfer('kt1bbb', '0')];

    expect(getTezosBundleFaceAsset(operations, 'kt1bbb')).toEqual({ assetSlug: 'kt1aaa', amountSigned: '10' });
  });

  it('faces TEZ when the gas legs net to a nonzero amount (e.g. an NFT sale)', () => {
    const operations = [makeTezosTransfer('kt1nft_0', '-1'), makeTezosTransfer(TEZ_TOKEN_SLUG, '950000')];

    expect(getTezosBundleFaceAsset(operations)).toEqual({ assetSlug: TEZ_TOKEN_SLUG, amountSigned: '950000' });
  });

  it('skips TEZ and faces the first moved token when the gas legs net to zero (swap routed through TEZ)', () => {
    const operations = [
      makeTezosTransfer(TEZ_TOKEN_SLUG, '100'),
      makeTezosTransfer('kt1btc_0', '-8'),
      makeTezosTransfer(TEZ_TOKEN_SLUG, '-100'),
      makeTezosTransfer('kt1usd_0', '62')
    ];

    expect(getTezosBundleFaceAsset(operations)).toEqual({ assetSlug: 'kt1btc_0', amountSigned: '-8' });
  });

  it('lets the preferred slug beat the gas face', () => {
    const operations = [makeTezosTransfer('kt1nft_0', '-1'), makeTezosTransfer(TEZ_TOKEN_SLUG, '950000')];

    expect(getTezosBundleFaceAsset(operations, 'kt1nft_0')).toEqual({ assetSlug: 'kt1nft_0', amountSigned: '-1' });
  });

  it('returns no face when only zero-net TEZ legs moved', () => {
    const operations = [makeTezosTransfer(TEZ_TOKEN_SLUG, '100'), makeTezosTransfer(TEZ_TOKEN_SLUG, '-100')];

    expect(getTezosBundleFaceAsset(operations)).toEqual({});
  });

  it('ignores a preferred TEZ face whose legs net to zero (swap routed through TEZ on the TEZ page)', () => {
    const operations = [
      makeTezosTransfer(TEZ_TOKEN_SLUG, '100'),
      makeTezosTransfer('kt1btc_0', '-8'),
      makeTezosTransfer(TEZ_TOKEN_SLUG, '-100'),
      makeTezosTransfer('kt1usd_0', '62')
    ];

    expect(getTezosBundleFaceAsset(operations, TEZ_TOKEN_SLUG)).toEqual({ assetSlug: 'kt1btc_0', amountSigned: '-8' });
  });

  it('skips zero-net candidates in both the preferred and fallback branches', () => {
    const operations = [
      makeTezosTransfer('kt1aaa', '5'),
      makeTezosTransfer('kt1aaa', '-5'),
      makeTezosTransfer('kt1bbb', '7')
    ];

    expect(getTezosBundleFaceAsset(operations, 'kt1aaa')).toEqual({ assetSlug: 'kt1bbb', amountSigned: '7' });
    expect(getTezosBundleFaceAsset(operations)).toEqual({ assetSlug: 'kt1bbb', amountSigned: '7' });
  });
});

const makeEvmTransfer = (contract: string, amountSigned: string): EvmOperation => ({
  kind: ActivityOperKindEnum.transfer,
  logIndex: 0,
  type: ActivityOperTransferType.receive,
  fromAddress: '0xFrom',
  toAddress: '0xTo',
  asset: { contract, amountSigned }
});

describe('getEvmBundleFaceAsset', () => {
  it('picks the first nonzero-transfer contract and sums it, when no preference is given', () => {
    const operations = [makeEvmTransfer('0xaaa', '10'), makeEvmTransfer('0xbbb', '5')];

    expect(getEvmBundleFaceAsset(operations)).toEqual({ contract: '0xaaa', amountSigned: '10' });
  });

  it('prefers the matched contract and sums it, even when another contract comes first', () => {
    const operations = [makeEvmTransfer('0xaaa', '10'), makeEvmTransfer('0xbbb', '5'), makeEvmTransfer('0xbbb', '7')];

    expect(getEvmBundleFaceAsset(operations, '0xbbb')).toEqual({ contract: '0xbbb', amountSigned: '12' });
  });

  it('matches the preferred contract case-insensitively', () => {
    const operations = [makeEvmTransfer('0xaaa', '10'), makeEvmTransfer('0xBBB', '5')];

    expect(getEvmBundleFaceAsset(operations, '0xbbb')).toEqual({ contract: '0xBBB', amountSigned: '5' });
  });

  it('falls back to the first-candidate rule when the preferred contract has no nonzero transfer', () => {
    const operations = [makeEvmTransfer('0xaaa', '10'), makeEvmTransfer('0xbbb', '0')];

    expect(getEvmBundleFaceAsset(operations, '0xbbb')).toEqual({ contract: '0xaaa', amountSigned: '10' });
  });

  it('skips zero-net candidates in both the preferred and fallback branches', () => {
    const operations = [makeEvmTransfer('0xaaa', '5'), makeEvmTransfer('0xaaa', '-5'), makeEvmTransfer('0xbbb', '7')];

    expect(getEvmBundleFaceAsset(operations, '0xaaa')).toEqual({ contract: '0xbbb', amountSigned: '7' });
    expect(getEvmBundleFaceAsset(operations)).toEqual({ contract: '0xbbb', amountSigned: '7' });
  });

  it('returns no face when every candidate nets to zero', () => {
    const operations = [makeEvmTransfer('0xaaa', '5'), makeEvmTransfer('0xaaa', '-5')];

    expect(getEvmBundleFaceAsset(operations)).toBeUndefined();
  });
});

describe('getActivityRowAmountView', () => {
  it('renders the amount for an interaction carrying a native-value asset', () => {
    const view = getActivityRowAmountView(
      ActivityOperKindEnum.interaction,
      { contract: 'eth', amountSigned: '-70000000000000000000', decimals: 18, symbol: 'XTZ', isNft: false },
      undefined
    );

    expect(view.amountText).toBe('-70');
    expect(view.symbolText).toBe('XTZ');
    expect(view.isPositive).toBe(false);
  });

  it('renders nothing for an interaction without an asset', () => {
    expect(getActivityRowAmountView(ActivityOperKindEnum.interaction, undefined, undefined)).toEqual({
      isPositive: false
    });
  });
});
