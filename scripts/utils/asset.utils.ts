export const getTokenSlug = <T extends { address?: string; id?: number | string }>({ address, id }: T) =>
  address != null ? `${address}_${id ?? 0}` : 'tez';
