import { groupBy, map, maxBy } from 'lodash-es';

import { AttributeInfo } from '../../interfaces/attribute.interface';

export const getUniqueAndMaxValueAttribute = (array: AttributeInfo[]) => {
  const grouped = groupBy(array, 'attribute_id');

  return map(grouped, value => maxBy(value, 'tokens') as AttributeInfo);
};
