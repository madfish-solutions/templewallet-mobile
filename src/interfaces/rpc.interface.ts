import { RpcEnum } from '../enums/rpc.enum';

export interface RpcInterface {
  id: RpcEnum;
  label: string;
  name: string;
  description: string;
  url: string;
}
