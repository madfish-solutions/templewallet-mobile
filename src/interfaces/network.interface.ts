import { NetworkEnum } from '../enums/network.enum';

export interface NetworkInterface {
  id: NetworkEnum;
  label: string;
  name: string;
  description: string;
  lambdaContract: string;
  rpcBaseURL: string;
}

export type NetworkRecord = {
  [key in NetworkEnum]: NetworkInterface;
};
