import { combineEpics } from 'redux-observable';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { quipuSwapApi } from '../../api.service';
import { TEZ_TOKEN_METADATA } from '../../token/data/tokens-metadata';
import { getTokenSlug } from '../../token/utils/token.utils';
import { loadTokensMetadata$ } from '../../utils/token-metadata.utils';
import { loadTokenWhitelist } from './swap-actions';
import { tokenWhitelistEntry } from './swap-state';

const MAINNET_CHAIN_ID = 'NetXdQprcVkpaWU';

export const loadTokenWhitelistEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadTokenWhitelist.submit),
    switchMap(() =>
      from(quipuSwapApi.get<tokenWhitelistEntry[]>('whitelist.json')).pipe(
        switchMap(({ data }) => {
          const mappedWhitelist: tokenWhitelistEntry[] = data.filter(item => {
            return item.network === MAINNET_CHAIN_ID;
          });

          const whitelabelSlugsArray: string[] = [];

          for (const { contractAddress, fa2TokenId } of mappedWhitelist) {
            whitelabelSlugsArray.push(getTokenSlug({ address: contractAddress, id: fa2TokenId }));
          }

          return loadTokensMetadata$(whitelabelSlugsArray).pipe(
            map(tokensMetadata => {
              const parsedMetadata = whitelabelSlugsArray.map((slug, index) => {
                const [address, id] = slug.split('_');

                return { ...tokensMetadata[index], address, id: Number(id) ?? 0 };
              });

              return loadTokenWhitelist.success([TEZ_TOKEN_METADATA, ...parsedMetadata]);
            }),
            catchError(err => of(loadTokenWhitelist.fail(err.message)))
          );
        }),
        catchError(err => of(loadTokenWhitelist.fail(err.message)))
      )
    )
  );

export const swapEpics = combineEpics(loadTokenWhitelistEpic);
