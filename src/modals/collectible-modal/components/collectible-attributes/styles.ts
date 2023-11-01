import { StyleSheet } from 'react-native';

import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

import { COLLECTIBLE_WIDTH } from '../../constants';

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  }
});

export const useCollectibleAttributeStyles = createUseStylesMemoized(({ typography, colors }) => ({
  root: {
    width: COLLECTIBLE_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: formatSize(8),
    paddingVertical: formatSize(8),
    borderRadius: formatSize(10),
    borderWidth: formatSize(1),
    backgroundColor: colors.cardBG,
    borderColor: colors.lines
  },
  name: {
    marginBottom: formatSize(4),
    ...typography.caption13Regular,
    color: colors.gray1
  },
  value: {
    marginBottom: formatSize(4),
    alignItems: 'center',
    ...typography.body15Semibold,
    color: colors.black
  },
  rarity: {
    ...typography.caption13Regular,
    color: colors.gray1
  }
}));
