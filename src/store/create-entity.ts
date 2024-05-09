import { LoadableEntityState } from './types';

export const createEntity = <T>(
  data: T,
  isLoading = false,
  error?: string,
  wasLoading?: boolean
): LoadableEntityState<T> => ({
  data,
  isLoading,
  error,
  wasLoading
});
