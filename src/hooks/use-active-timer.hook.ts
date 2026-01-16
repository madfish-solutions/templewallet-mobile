import { useCallback, useEffect, useRef } from 'react';

import { isDefined } from '../utils/is-defined';

export const useActiveTimer = () => {
  const activeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const clearActiveTimer = useCallback(
    () => void (isDefined(activeTimer.current) && clearTimeout(activeTimer.current)),
    []
  );

  useEffect(() => clearActiveTimer, []);

  return { activeTimer, clearActiveTimer };
};
