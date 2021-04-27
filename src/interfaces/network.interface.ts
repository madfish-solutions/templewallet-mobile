export interface NetworkInterface {
  id: string;
  name: string;
  description: string;
  lambdaContract: string;
  type: string;
  rpcBaseURL: string;
  color: string;
  disabled: boolean;
  nameI18nKey?: string;
}
