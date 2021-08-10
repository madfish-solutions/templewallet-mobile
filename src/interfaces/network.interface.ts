import { NetworkEnum } from '../enums/network.enum';

export interface NetworkInterface {
  id: NetworkEnum;
  label: string;
  name: string;
  description: string;
  lambdaContract: string;
  type: string;
  rpcBaseURL: string;
  color: string;
  disabled: boolean;
  nameI18nKey?: string;
}

export type NetworkRecord = {
  [key in NetworkEnum]: NetworkInterface;
};
