import { createUseStyles } from '../../styles/create-use-styles';

export const useFormNumericInputStyles = createUseStyles(() => ({
  buttonsAndSubtitleWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  buttonsWrapper: {},
  subtitleWrapper: {
    flexWrap: 'wrap'
  }
}));
