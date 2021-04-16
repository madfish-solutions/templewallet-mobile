import { mnemonicToSeedSync } from 'bip39';
import { getPublicKeyAndHash$, seedToHDPrivateKey } from '../utils/keys.util';
import { mapTo, switchMap } from 'rxjs/operators';
import { Shelter } from './shelter';

export const importWalletOperator$ = (seedPhrase: string, password: string) => {
  const seed = mnemonicToSeedSync(seedPhrase);
  const hdAccountIndex = 0;

  const privateKey = seedToHDPrivateKey(seed, hdAccountIndex);

  return getPublicKeyAndHash$(privateKey).pipe(
    switchMap(([publicKey, publicKeyHash]) =>
      Shelter.importWallet$(
        {
          seedPhrase,
          [publicKeyHash]: privateKey
        },
        password
      ).pipe(
        mapTo({
          name: 'Account 1',
          publicKey,
          publicKeyHash
        })
      )
    )
  );
};
