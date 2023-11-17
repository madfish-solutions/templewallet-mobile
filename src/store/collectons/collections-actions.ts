import { createActions } from '../create-actions';

import { Collection } from './collections-state';

export const loadCollectionsActions = createActions<string, Collection[], string>('collections/LOAD_COLLECTIONS');
