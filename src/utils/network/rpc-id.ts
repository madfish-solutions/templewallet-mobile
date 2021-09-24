export enum TempleChainId {
  Mainnet = 'NetXdQprcVkpaWU',
  Granadanet = 'NetXz969SFaFn8k',
  Florencenet = 'NetXxkAx4woPLyu',
  Edo2net = 'NetXSgo1ZT2DRUG',
  Delphinet = 'NetXm8tYqnMWky1',
  Carthagenet = 'NetXjD3HPJJjmcd'
}

export const NETWORK_IDS = new Map<string, string>([
  [TempleChainId.Mainnet, 'mainnet'],
  [TempleChainId.Granadanet, 'granadanet'],
  [TempleChainId.Florencenet, 'florencenet'],
  [TempleChainId.Edo2net, 'edo2net'],
  [TempleChainId.Delphinet, 'delphinet'],
  [TempleChainId.Carthagenet, 'carthagenet']
]);
