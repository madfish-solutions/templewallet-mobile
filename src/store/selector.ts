import { TypedUseSelectorHook, useSelector as useSelectorRaw } from 'react-redux';

import type { RootState } from './types';

export const useSelector: TypedUseSelectorHook<RootState> = useSelectorRaw;
