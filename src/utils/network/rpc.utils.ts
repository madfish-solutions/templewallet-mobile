import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { RpcEnum } from '../../enums/rpc.enum';
import { RpcInterface } from '../../interfaces/rpc.interface';
import { RpcArray } from './rpc-array';

export const currentRpc$ = new BehaviorSubject(RpcArray.filter(item => item.id === RpcEnum.TEMPLE_DEFAULT)[0]);
export const currentRpcUrl$ = currentRpc$.pipe(map(({ url }) => url));
export const updateCurrentRpc = (rpc: RpcInterface) => currentRpc$.next(rpc);
