import { catchError, from, map, of } from 'rxjs';

import { templeWalletApi } from '../../api.service';

export enum ABTestGroup {
  A = 'A',
  B = 'B',
  Unknown = 'Unknown'
}

interface GetABGroupResponse {
  ab: ABTestGroup.A | ABTestGroup.B;
}

export const getABGroup$ = () =>
  from(templeWalletApi.get<GetABGroupResponse>('/abtest')).pipe(
    map(response => response.data.ab),
    catchError(() => of(ABTestGroup.Unknown))
  );
