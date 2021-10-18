import { useMemo, useState } from 'react';

import { getDApps } from './operations';
import { CustomDAppInfo } from './types';

export const useDApps = () => {
  const [data, setData] = useState<CustomDAppInfo[]>();

  return data;
};
