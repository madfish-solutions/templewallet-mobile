import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { RpcEnum } from '../../enums/network.enum';
import { RpcInterface } from '../../interfaces/network.interface';
import { RPC } from './rpc-record';

export const currentRpc$ = new BehaviorSubject(RPC.filter(item => item.id === RpcEnum.TEMPLE_DEFAULT)[0]);
export const currentRpcUrl$ = currentRpc$.pipe(map(({ url }) => url));
export const updateCurrentRpc = (rpc: RpcInterface) => currentRpc$.next(rpc);
