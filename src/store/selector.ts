import { TypedUseSelectorHook, useSelector as useSelectorRaw } from 'react-redux';

import { RootState } from './create-store';

export const useSelector: TypedUseSelectorHook<RootState> = useSelectorRaw;
