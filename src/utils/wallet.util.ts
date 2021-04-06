import { mnemonicToSeedSync } from 'bip39';

import { seedToHDPrivateKey, getPublicKeyAndHash } from './seed-phrase.util';

export const importWallet = async (seedPhrase: string, password: string) => {
  const seed = mnemonicToSeedSync(seedPhrase);
  const hdAccountIndex = 0;

  const privateKey = seedToHDPrivateKey(seed, hdAccountIndex);
  const [publicKey, publicKeyHash] = await getPublicKeyAndHash(privateKey);

  console.log({ publicKey, publicKeyHash });
};
