import { RpcTypeEnum } from '../enums/rpc-type.enum';

export interface RpcInterface {
  name: string;
  url: string;
  type: RpcTypeEnum;
}
