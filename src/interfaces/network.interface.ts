import { RpcEnum } from '../enums/network.enum';

export interface RpcInterface {
  id: RpcEnum;
  label: string;
  name: string;
  description: string;
  url: string;
}
