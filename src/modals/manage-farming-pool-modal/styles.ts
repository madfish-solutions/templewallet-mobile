import { createUseStyles } from 'src/styles/create-use-styles';

export const useManageFarmingPoolModalStyles = createUseStyles(({ colors }) => ({
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  notSupportedText: {
    color: colors.black
  }
}));
