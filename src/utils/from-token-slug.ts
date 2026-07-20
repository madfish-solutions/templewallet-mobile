export const fromTokenSlug = (slug: string) => slug.split('_');

/**
 * EVM-only: collectible slugs are `${contract}_${tokenId}`, while fungible slugs are a bare contract
 * address or `eth`. Not valid for Tezos slugs, there every FA2 asset contains `_`.
 */
export const isEvmCollectibleSlug = (slug: string) => slug.includes('_');
