import { useMemo } from 'react';
import useSWR from 'swr';

import { fetchAttributesCounts } from 'src/apis/objkt';
import { HIDDEN_ATTRIBUTES_NAME } from 'src/apis/objkt/constants';
import { getAttributesWithRarity } from 'src/modals/collectible-modal/utils/attributes.utils';
import { CollectibleDetailsInterface } from 'src/token/interfaces/collectible-interfaces.interface';

import { CollectibleAttribute } from '../types';

export const useAttributesWithRarity = (details: CollectibleDetailsInterface | nullish): CollectibleAttribute[] => {
  const initialAttributes = useMemo(
    () => (details ? details.attributes.filter(item => !HIDDEN_ATTRIBUTES_NAME.includes(item.attribute.name)) : []),
    [details?.attributes]
  );

  const { data } = useSWR(['useFetchCollectibleAttributes', details], async () => {
    if (!details || !initialAttributes.length) {
      return null;
    }

    const attributeIds = initialAttributes.map(({ attribute }) => attribute.id);

    return await fetchAttributesCounts(attributeIds, details.galleries.length > 0).then(
      attributes => (attributes ? getAttributesWithRarity(attributes, details) : null),
      error => void console.error(error)
    );
  });

  return data || initialAttributes;
};
