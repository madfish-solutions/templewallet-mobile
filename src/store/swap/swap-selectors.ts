import { useSelector } from '../selector';

export const useSwapTokensSelector = () => useSelector(state => state.swap.tokens);
export const useSwapDexesSelector = () => useSelector(state => state.swap.dexes);
