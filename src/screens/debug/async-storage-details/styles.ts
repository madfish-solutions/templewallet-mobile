import { createUseStylesMemoized } from 'src/styles/create-use-styles';

export const useAsyncStorageDetailsStyles = createUseStylesMemoized(({ colors, typography }) => ({
  title: {
    ...typography.caption13Semibold,
    color: colors.black,
    alignSelf: 'center'
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  statsText: {
    ...typography.caption10Regular,
    color: colors.black
  }
}));
