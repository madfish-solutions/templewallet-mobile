import { BigNumber } from 'bignumber.js';
import { decodeFunctionData, erc20Abi, zeroAddress } from 'viem';

import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { EvmAssetStandardEnum, EVM_TOKEN_SLUG } from 'src/token/interfaces/token-metadata.interface';

import { buildPreparedEvmTransaction } from './build-prepared-evm-transaction';
import {
  SWAP_ERC20_ASSET,
  SWAP_ERC20_QUOTE,
  SWAP_ERC20_TOKEN,
  SWAP_NATIVE_ASSET,
  SWAP_NATIVE_TOKEN,
  SWAP_OWNER,
  SWAP_QUOTE,
  SWAP_ROUTER,
  SWAP_TOKEN_ADDRESS
} from './swap.mock';
import {
  assertSwapBalances,
  buildEvmSwapApproval,
  buildEvmSwapCatalog,
  buildEvmSwapRequest,
  createEvmSwapIdentity,
  getNativeSwapMax,
  isSwapQuoteFresh,
  toSwapAssetSlug,
  toSwapProxyAddress,
  toSwapRouteRequest,
  validateSwapAssets
} from './swap.utils';

jest.mock('src/api.service', () => ({ templeWalletApi: { get: jest.fn() } }));

describe('Etherlink swap assets and transaction rules', () => {
  it('maps native XTZ without treating wrapped XTZ as native', () => {
    expect(toSwapAssetSlug(zeroAddress)).toBe(EVM_TOKEN_SLUG);
    expect(toSwapProxyAddress(EVM_TOKEN_SLUG)).toBe(zeroAddress);
    const catalog = buildEvmSwapCatalog(
      { native: SWAP_NATIVE_TOKEN, wrapped: { ...SWAP_ERC20_TOKEN, symbol: 'WXTZ' } },
      {},
      {},
      {}
    );
    expect(catalog[0]).toMatchObject({
      symbol: 'XTZ',
      decimals: 18,
      balance: '0',
      standard: EvmAssetStandardEnum.NATIVE,
      iconName: CryptoLogoNameEnum.Etherlink
    });
    expect(catalog[1]).toMatchObject({
      symbol: 'WXTZ',
      assetSlug: SWAP_TOKEN_ADDRESS,
      standard: EvmAssetStandardEnum.ERC20
    });
  });

  it.each([false, true])('uses stored token icons for manual=%s without a provider logo', manual => {
    const iconURL = 'https://example.com/usdc.png';
    const [asset] = buildEvmSwapCatalog(
      { token: SWAP_ERC20_TOKEN },
      {},
      { [SWAP_TOKEN_ADDRESS]: { standard: EvmAssetStandardEnum.ERC20, manual, visibility: VisibilityEnum.Visible } },
      { [SWAP_TOKEN_ADDRESS]: { address: SWAP_TOKEN_ADDRESS, standard: EvmAssetStandardEnum.ERC20, iconURL } }
    );

    expect(asset.thumbnailUri).toBe(iconURL);
    expect(asset.decimals).toBe(SWAP_ERC20_TOKEN.decimals);
  });

  it.each([undefined, '', '   '])('uses the provider logo when the stored icon is %s', iconURL => {
    const logoURI = 'https://example.com/provider.png';
    const [asset] = buildEvmSwapCatalog(
      { token: { ...SWAP_ERC20_TOKEN, logoURI } },
      {},
      {},
      { [SWAP_TOKEN_ADDRESS]: { address: SWAP_TOKEN_ADDRESS, standard: EvmAssetStandardEnum.ERC20, iconURL } }
    );

    expect(asset.thumbnailUri).toBe(logoURI);
  });

  it('deduplicates addresses and includes zero-balance output tokens without false prices', () => {
    const catalog = buildEvmSwapCatalog(
      { a: SWAP_ERC20_TOKEN, b: { ...SWAP_ERC20_TOKEN, address: '0x00000000000000000000000000000000000000AB' } },
      {},
      {},
      {}
    );
    expect(catalog).toHaveLength(1);
    expect(catalog[0]).toMatchObject({ balance: '0', exchangeRate: undefined, assetSlug: SWAP_TOKEN_ADDRESS });
  });

  it('rejects a token that wallet metadata identifies as an NFT', () => {
    expect(
      buildEvmSwapCatalog(
        { a: SWAP_ERC20_TOKEN },
        {},
        {
          [SWAP_TOKEN_ADDRESS]: {
            standard: EvmAssetStandardEnum.ERC721,
            manual: false,
            visibility: VisibilityEnum.Visible
          }
        },
        {}
      )
    ).toHaveLength(0);
  });

  it.each(['1', '1000000', '1000000000000000000', '900719925474099312345'])(
    'serializes atomic input %s without a decimal conversion',
    amount => {
      const identity = createEvmSwapIdentity(
        SWAP_OWNER,
        SWAP_NATIVE_ASSET,
        SWAP_ERC20_ASSET,
        new BigNumber(amount),
        0.25
      );
      expect(toSwapRouteRequest(identity)).toMatchObject({ amount, slippage: '0.25', fee: '0.6' });
    }
  );

  it.each(['0', '-1', '0.5', 'NaN', 'Infinity'])('rejects invalid atomic input %s', amount => {
    expect(() =>
      createEvmSwapIdentity(SWAP_OWNER, SWAP_NATIVE_ASSET, SWAP_ERC20_ASSET, new BigNumber(amount), 0.25)
    ).toThrow();
  });

  it('preserves router calldata, native value, and selected wallet fees', () => {
    const request = buildEvmSwapRequest(SWAP_QUOTE, SWAP_NATIVE_ASSET, SWAP_ERC20_ASSET);
    expect(request).toEqual({ to: SWAP_ROUTER, data: '0x12345678', value: 1000000000000000000n, gas: 100000n });
    expect(
      buildPreparedEvmTransaction(request, {
        gasLimit: 120000n,
        fees: { type: 'eip1559', maxFeePerGas: 20n, maxPriorityFeePerGas: 2n }
      })
    ).toMatchObject({
      to: SWAP_ROUTER,
      data: '0x12345678',
      value: 1000000000000000000n,
      gas: 120000n,
      maxFeePerGas: 20n
    });
    expect(buildEvmSwapRequest(SWAP_ERC20_QUOTE, SWAP_ERC20_ASSET, SWAP_NATIVE_ASSET).value).toBe(0n);
  });

  it('approves only the exact amount to the router through the source token contract', () => {
    const approval = buildEvmSwapApproval(SWAP_ERC20_QUOTE, SWAP_ERC20_ASSET);
    expect(approval).toMatchObject({ to: SWAP_TOKEN_ADDRESS, value: 0n });
    expect(decodeFunctionData({ abi: erc20Abi, data: approval.data! })).toMatchObject({
      functionName: 'approve',
      args: [SWAP_ROUTER, 1000000n]
    });
    expect(() => buildEvmSwapApproval(SWAP_QUOTE, SWAP_NATIVE_ASSET)).toThrow();
  });

  it('rejects mismatched account, pair, amount, chain, and decimals', () => {
    for (const identity of [
      { ...SWAP_QUOTE.identity, fromAddress: SWAP_ROUTER },
      { ...SWAP_QUOTE.identity, amount: '1' },
      { ...SWAP_QUOTE.identity, dst: SWAP_ROUTER },
      { ...SWAP_QUOTE.identity, chainId: 1 }
    ])
      expect(() => validateSwapAssets({ ...SWAP_QUOTE, identity }, SWAP_NATIVE_ASSET, SWAP_ERC20_ASSET)).toThrow();
    expect(() => validateSwapAssets(SWAP_QUOTE, { ...SWAP_NATIVE_ASSET, decimals: 6 }, SWAP_ERC20_ASSET)).toThrow();
  });

  it('blocks expired quotes and reserves native gas for MAX', () => {
    expect(isSwapQuoteFresh(SWAP_QUOTE, 59999)).toBe(true);
    expect(isSwapQuoteFresh(SWAP_QUOTE, 60000)).toBe(false);
    expect(getNativeSwapMax('1000')).toBeUndefined();
    expect(getNativeSwapMax('1000', 200n)).toBe('800');
    expect(getNativeSwapMax('1000', 2000n)).toBe('0');
  });

  it('requires current native and ERC20 balances for the selected fee cap', () => {
    const request = buildEvmSwapRequest(SWAP_QUOTE, SWAP_NATIVE_ASSET, SWAP_ERC20_ASSET);
    expect(() => assertSwapBalances(request, 100000n, 20n, 1000000000000000000n, 1000000n)).toThrow('Insufficient XTZ');
    expect(() => assertSwapBalances({ value: 0n }, 100000n, 20n, 2000000n, 1000000n, 999999n)).toThrow(
      'Insufficient source'
    );
    expect(() => assertSwapBalances({ value: 0n }, 100000n, 20n, 2000000n, 1000000n, 1000000n)).not.toThrow();
  });
});
