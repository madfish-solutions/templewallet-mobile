import { black } from 'src/config/styles';
import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

export const useLbPoolPartStyles = createUseStylesMemoized(({ colors }) => ({
  root: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center'
  },
  dashWrapper: {
    width: formatSize(4),
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
  },
  amounts: {
    width: 'auto'
  }
}));
