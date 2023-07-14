import { black } from 'src/config/styles';
import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

export const useLbPoolPartStyles = createUseStylesMemoized(({ colors }) => ({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: formatSize(8)
  },
  dashWrapper: {
    width: formatSize(16),
    overflow: 'hidden'
  },
  item: {
    ...generateShadow(1, black),
    borderRadius: formatSize(10),
    padding: formatSize(6),
    backgroundColor: colors.cardBG,
    justifyContent: 'center',
    alignItems: 'center'
  },
  reverse: {
    flexDirection: 'row-reverse'
  }
}));
