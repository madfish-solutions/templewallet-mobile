export const tokenMetadataSlug = <T extends { address: string; id: number }>({ address, id }: T) => `${address}_${id}`;
