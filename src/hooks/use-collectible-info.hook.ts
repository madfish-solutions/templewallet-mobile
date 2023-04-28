import { useEffect, useState } from 'react';
import { EMPTY } from 'rxjs';
import { map, tap, finalize, catchError } from 'rxjs/operators';

import { fetchCollectibleInfo$ } from '../apis/objkt';
import { CollectibleInfo } from '../interfaces/collectible-info.interface';
import { showErrorToast } from '../toast/toast.utils';

const initialState = {
  description: '',
  creators: [],
  collection: {
    name: '',
    logo: ''
  }
};

export const useCollectibleInfo = (address: string, id: string) => {
  const [collectibleInfo, setCollectibleInfo] = useState<CollectibleInfo>(initialState);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const subscription = fetchCollectibleInfo$(address, id)
      .pipe(
        tap(() => setIsLoading(true)),
        map(result => result),
        catchError(err => {
          showErrorToast({ description: err.message });

          return EMPTY;
        }),
        finalize(() => setIsLoading(false))
      )
      .subscribe(result => {
        setCollectibleInfo(result);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { collectibleInfo, isLoading };
};
