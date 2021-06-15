import { createContext } from 'react';

import { ScreensEnum } from './enums/screens.enum';

export const CurrentRouteNameContext = createContext<ScreensEnum>(ScreensEnum.Welcome);
