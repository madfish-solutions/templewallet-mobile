import { useButtonLargePrimaryStyleConfig } from 'src/components/button/button-large/button-large-primary/button-large-primary.styles';
import { useButtonLargeSecondaryStyleConfig } from 'src/components/button/button-large/button-large-secondary/button-large-secondary.styles';
import { black, DEFAULT_BORDER_WIDTH } from 'src/config/styles';
import { createUseStylesMemoized, createUseStylesConfig } from 'src/styles/create-use-styles';
import { formatSize, formatTextSize } from 'src/styles/format-size';
import { generateShadow } from 'src/styles/generate-shadow';

export const useEarnOpportunityItemStyles = createUseStylesMemoized(({ colors, typography }) => ({
  root: {
    ...generateShadow(1, black),
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
  aprText: {
    ...typography.caption13Semibold,
    color: colors.black,
    textAlign: 'right',
    alignSelf: 'flex-end'
  },
  tokensContainer: {
    paddingBottom: formatSize(10)
  },
  bage: {
    position: 'relative',
    zIndex: 2,
    marginRight: formatSize(-6),
    paddingVertical: formatSize(4)
  },
  bageText: {
    lineHeight: formatTextSize(13)
  },
  lastBage: {
    zIndex: 1
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
  },
  liquidityBakingIconWrapper: {
    width: formatSize(12),
    height: formatSize(12),
    backgroundColor: colors.blue,
    borderWidth: DEFAULT_BORDER_WIDTH,
    borderColor: colors.lines,
    borderRadius: formatSize(4),
    justifyContent: 'center',
    alignItems: 'center'
  },
  alignEnd: {
    alignItems: 'flex-end'
  }
}));

export const useButtonPrimaryStyleConfig = createUseStylesConfig(({ typography }) => ({
  ...useButtonLargePrimaryStyleConfig(),
  containerStyle: {
    height: formatSize(38),
    borderRadius: formatSize(10)
  },
  titleStyle: {
    ...typography.tagline13Tag
  }
}));

export const useButtonSecondaryStyleConfig = createUseStylesConfig(({ typography }) => ({
  ...useButtonLargeSecondaryStyleConfig(),
  containerStyle: {
    height: formatSize(38),
    borderRadius: formatSize(10),
    borderWidth: formatSize(2)
  },
  titleStyle: {
    ...typography.tagline13Tag
  }
}));
