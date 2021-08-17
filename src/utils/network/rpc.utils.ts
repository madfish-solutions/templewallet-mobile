import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { RpcInterface } from '../../interfaces/network.interface';
import { RPC } from './rpc-record';

export const currentRpc$ = new BehaviorSubject(RPC.TEMPLE_DEFAULT);
export const currentRpcUrl$ = currentRpc$.pipe(map(({ url }) => url));
export const updateCurrentRpc = (rpc: RpcInterface) => currentRpc$.next(rpc);
