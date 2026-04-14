import { InMemorySigner } from '@taquito/signer';

import { InMemorySpendingKey } from 'src/utils/sapling/sapling-keys/in-memory-spending-key';
import { getMnemonicFromSecretKey } from 'src/utils/sapling/secret-key-to-mnemonic';

export const deriveSaskFromPrivateKey = async (privateKey: string): Promise<string> => {
  const signer = await InMemorySigner.fromSecretKey(privateKey);
  const secretKey = await signer.secretKey();
  const fakeMnemonic = getMnemonicFromSecretKey(secretKey);

  return InMemorySpendingKey.deriveSaskFromMnemonic(fakeMnemonic);
};
