import { createUseStyles } from 'src/styles/create-use-styles';

export const useStaticTokenIconStyles = createUseStyles(({ colors }) => ({
  container: {
    overflow: 'hidden',
    position: 'relative'
  },
  hiddenImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 1,
    height: 1,
    opacity: 0
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lines
  }
}));
