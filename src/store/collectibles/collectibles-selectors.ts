import { CollectibleDetailsInterface } from 'src/token/interfaces/collectible-interfaces.interface';

import { useSelector } from '../selector';

export const useAllCollectiblesDetailsSelector = () => useSelector(state => state.collectibles.details.data);

export const useCollectibleDetailsSelector = (slug: string): CollectibleDetailsInterface | nullish =>
  useSelector(state => state.collectibles.details.data[slug]);

export const useCollectibleDetailsLoadingSelector = () => useSelector(state => state.collectibles.details.isLoading);

export const useCollectibleIsAdultSelector = (slug: string): boolean | undefined =>
  useSelector(state => state.collectibles.adultFlags[slug]?.val);
