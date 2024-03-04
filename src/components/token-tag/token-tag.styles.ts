import { createUseStyles } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useTokenTagStyles = createUseStyles(({ typography }) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  alertIcon: {
    marginRight: formatSize(2)
  },
  text: {
    ...typography.tagline11TagUppercase,
    color: 'white'
  }
}));
