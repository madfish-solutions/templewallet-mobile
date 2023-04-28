import { useEffect, useState } from 'react';
import { catchError, EMPTY, map } from 'rxjs';

import { fetchCollectiblesByCollection$ } from 'src/apis/objkt';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { TokenInterface } from 'src/token/interfaces/token.interface';

export const useCollectiblebyCollectionInfo = (contract: string) => {
  const [collectibles, setCollectibles] = useState<TokenInterface[]>([]);

  useEffect(() => {
    const subscription = fetchCollectiblesByCollection$(contract)
      .pipe(
        map(result => result),
        catchError(err => {
          showErrorToast({ description: err.message });

          return EMPTY;
        })
      )
      .subscribe(collectibles => setCollectibles(collectibles));

    return () => subscription.unsubscribe();
  }, []);

  return collectibles;
};
