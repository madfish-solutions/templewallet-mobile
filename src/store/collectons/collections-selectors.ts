import { jsonEqualityFn } from 'src/utils/store.utils';

import { useSelector } from '../selector';

export const useCollectionsSelector = () => useSelector(state => state.collections.collectionInfo, jsonEqualityFn);
