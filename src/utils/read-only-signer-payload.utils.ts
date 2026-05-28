import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Account } from 'src/interfaces/account.interfaces';
import { Shelter } from 'src/shelter/shelter';
import { ReadOnlySignerPayload } from 'src/types/read-only-signer-payload';

import { getAccountAddressForTezos } from './account.utils';
import { throwError$ } from './rxjs.utils';

export const getReadOnlySignerPayload$ = (account: Account) => {
  const tezosAddress = getAccountAddressForTezos(account);

  if (!tezosAddress) {
    return throwError$('Select a Tezos account to continue');
  }

  return Shelter.revealAccountPublicKey$(tezosAddress).pipe(
    switchMap(publicKey =>
      publicKey ? of<ReadOnlySignerPayload>({ tezosAddress, publicKey }) : throwError$('Failed to reveal public key')
    )
  );
};
