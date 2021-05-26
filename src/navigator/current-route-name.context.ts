import { createContext } from 'react';

import { ScreensEnum } from './screens.enum';

export const CurrentRouteNameContext = createContext<ScreensEnum>(ScreensEnum.Welcome);
