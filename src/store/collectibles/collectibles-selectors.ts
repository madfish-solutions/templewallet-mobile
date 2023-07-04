import { useSelector } from '../selector';

export const useCollectiblesDetailsSelector = () => useSelector(state => state.collectibles.details);

export const useCollectibleDetailsSelector = (slug: string) => useSelector(state => state.collectibles.details[slug]);
