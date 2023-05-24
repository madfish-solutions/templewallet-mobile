import { black } from 'src/config/styles';
import { createUseStyles, createUseStylesConfig } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

export const useFarmItemStyles = createUseStyles(({ colors, typography }) => ({
  root: {
    ...generateShadow(2, black),
    borderRadius: formatSize(10),
    backgroundColor: colors.cardBG,
    marginHorizontal: formatSize(16)
  },
  mainContent: {
    paddingHorizontal: formatSize(12),
    paddingBottom: formatSize(12)
  },
  bageContainer: {
    position: 'relative',
    flexDirection: 'row',
    marginBottom: formatSize(8)
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  attributeTitle: {
    ...typography.caption11Regular,
    color: colors.gray1
  },
  attributeValue: {
    ...typography.numbersRegular17,
    color: colors.black
  },
  apyText: {
    ...typography.caption13Semibold,
    color: colors.black
  },
  tokensContainer: {
    paddingBottom: formatSize(8),
    borderBottomWidth: formatSize(1),
    marginBottom: formatSize(8),
    borderColor: colors.lines
  },
  bage: {
    position: 'relative',
    zIndex: 2,
    marginRight: formatSize(-8)
  },
  mb16: {
    marginBottom: formatSize(16)
  },
  earnSource: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  flex: {
    flex: 1
  },
  earnSourceIcon: {
    marginRight: formatSize(2)
  }
}));

export const useButtonPrimaryStyleConfig = createUseStylesConfig(({ colors, typography }) => ({
  containerStyle: {
    flex: 1,
    height: formatSize(38),
    borderRadius: formatSize(10),
    borderWidth: formatSize(2)
  },
  titleStyle: {
    ...typography.tagline13Tag
  },
  iconStyle: {
    size: formatSize(24),
    marginRight: formatSize(8)
  },
  activeColorConfig: {
    titleColor: colors.white,
    backgroundColor: colors.orange
  },
  disabledColorConfig: {
    titleColor: colors.white,
    backgroundColor: colors.disabled
  }
}));

export const useButtonSecondaryStyleConfig = createUseStylesConfig(({ colors, typography }) => ({
  containerStyle: {
    flex: 1,
    width: formatSize(156),
    height: formatSize(38),
    borderRadius: formatSize(10),
    borderWidth: formatSize(2)
  },
  titleStyle: {
    ...typography.tagline13Tag
  },
  iconStyle: {
    size: formatSize(24),
    marginRight: formatSize(8)
  },
  activeColorConfig: {
    titleColor: colors.orange,
    backgroundColor: colors.white,
    borderColor: colors.orange
  },
  disabledColorConfig: {
    titleColor: colors.white,
    backgroundColor: colors.disabled
  }
}));
