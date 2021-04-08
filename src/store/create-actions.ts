import { createAction } from '@reduxjs/toolkit';

export const createActions = <CreatePayload = void, SuccessPayload = void, FailPayload = void>(type: string) => ({
  create: createAction<CreatePayload>(type),
  success: createAction<SuccessPayload>(`${type}/success`),
  fail: createAction<FailPayload>(`${type}/fail`)
});
