import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { iosCardShadow } from 'src/styles/shadows';

const SLIDE_TO_CONFIRM_HEIGHT = formatSize(50);
export const SLIDE_TO_CONFIRM_THUMB_WIDTH = formatSize(60);
export const SLIDE_TO_CONFIRM_BORDER_RADIUS = formatSize(8);

export const useSlideToConfirmButtonStyles = createUseStyles(({ colors, typography }) => ({
  track: {
    height: SLIDE_TO_CONFIRM_HEIGHT,
    borderRadius: SLIDE_TO_CONFIRM_BORDER_RADIUS,
    backgroundColor: colors.peach10,
    justifyContent: 'center'
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderTopLeftRadius: SLIDE_TO_CONFIRM_BORDER_RADIUS,
    borderBottomLeftRadius: SLIDE_TO_CONFIRM_BORDER_RADIUS,
    backgroundColor: colors.peach
  },
  label: {
    ...typography.body17Semibold,
    color: colors.peach,
    textAlign: 'center'
  },
  thumb: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: SLIDE_TO_CONFIRM_THUMB_WIDTH,
    height: SLIDE_TO_CONFIRM_HEIGHT,
    borderRadius: SLIDE_TO_CONFIRM_BORDER_RADIUS,
    backgroundColor: colors.peach,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: iosCardShadow
  },
  disabled: {
    opacity: 0.5
  }
}));
