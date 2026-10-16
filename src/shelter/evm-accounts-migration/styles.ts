import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useEvmAccountsMigrationGateStyles = createUseStylesMemoized(({ colors, typography }) => ({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: formatSize(24),
    backgroundColor: colors.pageBG
  },
  content: {
    alignItems: 'center'
  },
  title: {
    ...typography.numbersMedium20,
    color: colors.black,
    textAlign: 'center'
  },
  body: {
    ...typography.body15Regular,
    color: colors.gray1,
    textAlign: 'center'
  },
  error: {
    color: colors.destructive
  },
  loader: {
    width: formatSize(80),
    height: formatSize(80)
  },
  buttons: {
    width: '100%'
  }
}));
