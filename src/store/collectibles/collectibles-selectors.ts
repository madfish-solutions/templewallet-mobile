import { useSelector } from '../selector';

export const useCollectiblesDetailsSelector = () => useSelector(state => state.collectibles.details.data);

export const useCollectibleDetailsSelector = (slug: string) =>
  useSelector(state => state.collectibles.details.data[slug]);

export const useCollectibleDetailsLoadingSelector = () => useSelector(state => state.collectibles.details.isLoading);
