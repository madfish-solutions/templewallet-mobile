export enum ModalsEnum {
  Receive = 'Receive',
  Send = 'Send',
  AddToken = 'AddToken',
  CreateHdAccount = 'CreateHdAccount',
  SelectBaker = 'SelectBaker'
}

export type ModalsParamList = {
  [ModalsEnum.Receive]: undefined;
  [ModalsEnum.Send]: undefined;
  [ModalsEnum.AddToken]: undefined;
  [ModalsEnum.CreateHdAccount]: undefined;
  [ModalsEnum.SelectBaker]: undefined;
};
