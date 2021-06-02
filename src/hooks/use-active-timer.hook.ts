import { useRef } from 'react';

import { isDefined } from '../utils/is-defined';

export const useActiveTimer = () => {
  const activeTimer = useRef<ReturnType<typeof setTimeout>>();

  const clearActiveTimer = () => isDefined(activeTimer.current) && clearTimeout(activeTimer.current);

  return { activeTimer, clearActiveTimer };
};
