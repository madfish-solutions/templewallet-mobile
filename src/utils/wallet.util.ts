import { mnemonicToSeedSync } from 'bip39';

import { getPublicKeyAndHash, seedToHDPrivateKey } from './keys.util';
import { decryptObject, encryptObject } from './crypto.util';

export const importWallet = async (seedPhrase: string, password: string) => {
  const seed = mnemonicToSeedSync(seedPhrase);
  const hdAccountIndex = 0;

  const privateKey = seedToHDPrivateKey(seed, hdAccountIndex);
  const [publicKey, publicKeyHash] = await getPublicKeyAndHash(privateKey);

  const encryptedData = await encryptObject(
    {
      seedPhrase,
      [publicKey]: privateKey,
      [publicKeyHash]: privateKey
    },
    password
  );

  const decryptedData = await decryptObject(encryptedData, password);

  console.log(encryptedData, decryptedData);
};
