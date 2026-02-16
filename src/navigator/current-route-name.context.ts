import { createContext } from 'react';

import { ModalsEnum } from './enums/modals.enum';
import { ScreensEnum } from './enums/screens.enum';

export const CurrentRouteNameContext = createContext<ScreensEnum | ModalsEnum>(ScreensEnum.Welcome);
