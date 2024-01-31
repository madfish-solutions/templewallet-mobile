import React, { useState } from 'react';

import { HeaderCloseButton } from '../components/header/header-close-button/header-close-button';
import { HeaderProgress } from '../components/header/header-progress/header-progress';
import { useNavigationSetOptions } from '../components/header/use-navigation-set-options.hook';

export function useInnerScreenProgress(total: number, progressLeft = false) {
  const [innerScreenIndex, setInnerScreenIndex] = useState(0);

  useNavigationSetOptions(
    {
      headerLeft: () =>
        total !== 0 && progressLeft ? <HeaderProgress current={innerScreenIndex + 1} total={total} /> : null,
      headerRight: () =>
        total !== 0 && !progressLeft ? (
          <HeaderProgress current={innerScreenIndex + 1} total={total} />
        ) : (
          <HeaderCloseButton />
        )
    },
    [innerScreenIndex, total]
  );

  return { innerScreenIndex, setInnerScreenIndex };
}
