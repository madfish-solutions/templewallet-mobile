import { mnemonicToSeedSync } from 'bip39';

import { generateSeed, getPublicKeyAndHash, seedToHDPrivateKey } from './keys.util';
import { Observable } from 'rxjs';
import { ImportAccountPayload } from '../store/wallet/wallet-actions';
import { AccountInterface } from '../interfaces/account.interface';
import { map, switchMap } from 'rxjs/operators';

export const importWallet = () => (payload$: Observable<ImportAccountPayload>): Observable<AccountInterface> =>
  payload$.pipe(
    // TODO: use password to encrypt sensitive data
    //   const encryptedData = await encryptObject(
    //     {
    //       seedPhrase,
    //       [publicKeyHash]: privateKey
    //     },
    //     password
    //   );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    switchMap(({ seedPhrase, password }) => {
      const seed = mnemonicToSeedSync(seedPhrase);
      const hdAccountIndex = 0;

      const privateKey = seedToHDPrivateKey(seed, hdAccountIndex);

      return getPublicKeyAndHash(privateKey).pipe(
        map(([publicKey, publicKeyHash]) => ({
          name: 'Account 1',
          publicKey,
          publicKeyHash
        }))
      );
    })
  );

export const createWallet = async (password: string) => {
  const seedPhrase = generateSeed();

  return importWallet(seedPhrase, password);
};
