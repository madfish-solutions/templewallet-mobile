import { createAction } from '@reduxjs/toolkit';
import { AccountInterface } from '../../interfaces/account.interface';

const createActions = <CreatePayload = void, SuccessPayload = void, FailPayload = void>(type: string) => ({
  create: createAction<CreatePayload>(type),
  success: createAction<SuccessPayload>(`${type}/success`),
  fail: createAction<FailPayload>(`${type}/fail`)
});

export const createWalletActions = createActions<string, AccountInterface>('@wallet/create');
