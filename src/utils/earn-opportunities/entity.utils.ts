import { LoadableEntityState } from 'src/store/types';

import { isDefined } from '../is-defined';

export const nullableEntityWasLoading = <T>(entity: LoadableEntityState<T | null | undefined> | undefined) => {
  return isDefined(entity) && (isDefined(entity.error) || entity.data !== undefined);
};
