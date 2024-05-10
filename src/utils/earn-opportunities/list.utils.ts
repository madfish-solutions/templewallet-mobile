import { ListRenderItem } from 'react-native';

import { EarnOpportunity } from 'src/types/earn-opportunity.types';

export const LOADER_PLACEHOLDER = 'loader-placeholder';

export const earnOpportunityKeyExtractor = (item: EarnOpportunity | typeof LOADER_PLACEHOLDER) =>
  item === LOADER_PLACEHOLDER ? LOADER_PLACEHOLDER : `${item.id}_${item.contractAddress}`;

export const getRenderEarnOpportunityFn =
  <T extends EarnOpportunity>(
    renderPlaceholder: () => JSX.Element,
    renderItem: (item: T) => JSX.Element
  ): ListRenderItem<T | typeof LOADER_PLACEHOLDER> =>
  ({ item }) =>
    item === LOADER_PLACEHOLDER ? renderPlaceholder() : renderItem(item);

export const createItemsListWithLoader = <T extends EarnOpportunity>(
  items: T[],
  shouldShowLoader: boolean
): Array<T | typeof LOADER_PLACEHOLDER> => {
  const initialItems: Array<T | typeof LOADER_PLACEHOLDER> = items;

  return shouldShowLoader ? initialItems.concat(LOADER_PLACEHOLDER) : initialItems;
};
