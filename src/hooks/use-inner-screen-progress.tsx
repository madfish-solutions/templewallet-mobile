import React, { useState } from 'react';

import { HeaderBackButton } from 'src/components/header/header-back-button/header-back-button';
import { HeaderCloseButton } from 'src/components/header/header-close-button/header-close-button';
import { HeaderProgress } from 'src/components/header/header-progress/header-progress';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';

export function useInnerScreenProgress(total: number, progressLeft = false, shouldAddBackButton = false) {
  const [innerScreenIndex, setInnerScreenIndex] = useState(0);

  useNavigationSetOptions(
    {
      headerLeft: () =>
        total !== 0 && progressLeft ? (
          <HeaderProgress current={innerScreenIndex + 1} total={total} />
        ) : shouldAddBackButton ? (
          <HeaderBackButton />
        ) : null,
      headerRight: () =>
        total !== 0 && !progressLeft ? (
          <HeaderProgress current={innerScreenIndex + 1} total={total} />
        ) : shouldAddBackButton ? null : (
          <HeaderCloseButton />
        )
    },
    [innerScreenIndex, total]
  );

  return { innerScreenIndex, setInnerScreenIndex };
}
