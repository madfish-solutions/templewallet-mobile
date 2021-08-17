import { RpcEnum } from '../enums/network.enum';

export interface RpcInterface {
  id: RpcEnum;
  label: string;
  name: string;
  description: string;
  rpcBaseURL: string;
}

export type RpcRecord = {
  [key in string]: RpcInterface;
};
