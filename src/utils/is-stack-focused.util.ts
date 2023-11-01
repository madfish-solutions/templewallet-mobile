import { ScreensOrModalsEnum } from '../interfaces/stacks.interface';

import { isDefined } from './is-defined';

export const isStackFocused = (currentRouteName: ScreensOrModalsEnum, screensStack: ScreensOrModalsEnum[]) =>
  isDefined(currentRouteName) && screensStack.includes(currentRouteName);
