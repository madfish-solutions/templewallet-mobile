import AsyncStorage from '@react-native-async-storage/async-storage';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { RpcEnum } from '../../enums/rpc.enum';
import { RpcInterface } from '../../interfaces/rpc.interface';
import { RpcArray } from './rpc-array';

const rpcIdStorageKey = 'rpcIdStorageKey';

export const currentRpc$ = new BehaviorSubject(RpcArray.filter(item => item.id === RpcEnum.TEMPLE_DEFAULT)[0]);
export const currentRpcUrl$ = currentRpc$.pipe(map(({ url }) => url));
export const updateCurrentRpc = (rpc: RpcInterface) => currentRpc$.next(rpc);

export const findRpcById = (rpcId: string | null) => RpcArray.find(item => item.id === rpcId) ?? RpcArray[0];

export const setRpcIdToStorage = (rpcId: RpcEnum) => AsyncStorage.setItem(rpcIdStorageKey, rpcId);
export const getRpcFromStorage = async (): Promise<RpcInterface> =>
  AsyncStorage.getItem(rpcIdStorageKey).then(findRpcById);
