import { basicLightColors } from '../../styles/colors';
import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useDelegateTagStyles = createUseStyles(({ typography }) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  alertIcon: {
    marginRight: formatSize(2)
  },
  text: {
    ...typography.tagline11TagUppercase,
    color: basicLightColors.white
  }
}));
