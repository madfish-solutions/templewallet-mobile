import { from, map } from 'rxjs';

import { quipuStakingApi } from '../api.service';
import { isDefined } from './is-defined';

export const QUIPU_DEFAULT_PERCENTAGE = 13.5;

export const loadQuipuApy$ = from(quipuStakingApi.get('/list/3').then(r => r.data)).pipe(
  map(tokenList => {
    if (isDefined(tokenList) && isDefined(tokenList.item) && isDefined(tokenList.item.apy)) {
      return tokenList.item.apy;
    }

    return QUIPU_DEFAULT_PERCENTAGE;
  })
);
