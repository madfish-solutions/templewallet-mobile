import React, { useState } from 'react';

import { HeaderProgress } from '../components/header/header-progress/header-progress';
import { useNavigationSetOptions } from '../components/header/use-navigation-set-options.hook';

export function useInnerScreenProgress(total: number) {
  const [innerScreenIndex, setInnerScreenIndex] = useState(0);

  useNavigationSetOptions(
    {
      headerRight: () => (total !== 0 ? <HeaderProgress current={innerScreenIndex + 1} total={total} /> : null)
    },
    [innerScreenIndex, total]
  );

  return { innerScreenIndex, setInnerScreenIndex };
}
