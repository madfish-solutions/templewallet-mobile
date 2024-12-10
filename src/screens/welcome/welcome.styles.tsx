import { transparent } from 'src/config/styles';
import { createUseStyles, createUseStylesConfig } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useWelcomeStyles = createUseStyles(({ colors, typography }) => ({
  scrollViewContentContainer: {
    paddingTop: 0,
    paddingHorizontal: 0
  },
  bg: {
    flex: 1
  },
  imageView: {
    marginTop: formatSize(96),
    alignItems: 'center'
  },
  logo: {
    backgroundColor: colors.pageBG
  },
  footer: {
    paddingHorizontal: formatSize(16)
  },
  orDivider: {
    height: formatSize(18),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: formatSize(16),
    marginBottom: formatSize(16)
  },
  orDividerLine: {
    flex: 1,
    height: formatSize(1),
    backgroundColor: colors.lines
  },
  orDividerText: {
    ...typography.caption13Regular,
    width: formatSize(37),
    textAlign: 'center',
    color: colors.gray1
  }
}));

export const useCloudButtonActiveColorStyleConfig = createUseStylesConfig(({ colors }) => ({
  googleDrive: {
    titleColor: colors.blue,
    backgroundColor: transparent,
    borderColor: colors.blue
  },
  iCloud: {
    titleColor: colors.black,
    backgroundColor: transparent,
    borderColor: colors.black
  }
}));
