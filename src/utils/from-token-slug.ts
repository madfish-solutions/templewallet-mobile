export const fromTokenSlug = (slug: string) => slug.split('_');

/** EVM collectible slugs are `${contract}_${tokenId}`; fungible slugs are a bare contract address or the native slug */
export const isEvmCollectibleSlug = (slug: string) => slug.includes('_');
