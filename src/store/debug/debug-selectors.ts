import { useSelector } from 'react-redux';

import { DebugRootState, DebugState } from './debug-state';

const useDebugStateSelector = () => useSelector<DebugRootState, DebugState>(({ debug }) => debug);

export const useRecentActionsSelector = () => useDebugStateSelector().recentActions;
