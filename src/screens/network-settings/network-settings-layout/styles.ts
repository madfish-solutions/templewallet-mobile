import { StyleSheet } from 'react-native';

import { black } from 'src/config/styles';
import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize, formatTextSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';
import { hexa } from 'src/utils/style.util';

export const useNetworkSettingsLayoutStyles = createUseStylesMemoized(({ colors, typography }) => ({
  container: {
    gap: formatSize(24)
  },
  section: {
    gap: formatSize(8)
  },
  sectionTitle: {
    ...typography.body15Semibold,
    color: colors.black
  },
  optionContainer: {
    ...generateShadow(1, black),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: formatSize(4),
    padding: formatSize(16),
    borderRadius: formatSize(10),
    backgroundColor: colors.cardBG
  },
  optionTitle: {
    ...typography.caption13Semibold,
    color: colors.black,
    lineHeight: formatTextSize(18)
  },
  optionDescription: {
    ...typography.caption11Regular,
    color: colors.gray1,
    lineHeight: formatTextSize(13)
  },
  activeLabel: {
    borderWidth: StyleSheet.hairlineWidth * 2,
    borderColor: colors.adding,
    backgroundColor: hexa(colors.adding, 0.1),
    paddingHorizontal: formatSize(8),
    borderRadius: formatSize(4),
    height: formatSize(19),
    justifyContent: 'center',
    alignItems: 'center'
  },
  activeLabelText: {
    ...typography.tagline11TagUppercase,
    color: colors.adding
  }
}));
