import { CollectibleDetailsInterface } from 'src/token/interfaces/collectible-interfaces.interface';

import { useSelector } from '../selector';

export const useCollectiblesDetailsSelector = () => useSelector(state => state.collectibles.details.data);

export const useCollectibleDetailsSelector = (slug: string): CollectibleDetailsInterface | undefined =>
  useSelector(state => state.collectibles.details.data[slug]);

export const useCollectibleDetailsLoadingSelector = () => useSelector(state => state.collectibles.details.isLoading);
