import type { PersistPartial } from 'redux-persist/es/persistReducer';

import { sendAnalyticsEvent } from './analytics/analytics.util';

export const persistFailHandler = (error: Error) =>
  void sendAnalyticsEvent('REDUX_PERSIST_FAIL', undefined, undefined, { message: error.message });

const persistPropertyMock: PersistPartial = {
  _persist: {
    version: 0,
    rehydrated: false
  }
};

export const mockPersistedState = <S>(state: S) => ({ ...state, ...persistPropertyMock });
