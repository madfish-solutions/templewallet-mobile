import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useNotificationPreviewItemStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.pageBG,
    paddingHorizontal: formatSize(20),
    paddingTop: formatSize(16)
  },
  containerRead: {
    flexDirection: 'row',
    backgroundColor: colors.input,
    paddingHorizontal: formatSize(20),
    paddingVertical: formatSize(16)
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  title: {
    ...typography.body15Semibold,
    color: colors.black
  },
  titleRead: {
    ...typography.body15Semibold,
    color: colors.gray1
  },
  description: {
    ...typography.caption13Regular,
    color: colors.gray1
  },
  dateDetailsInfo: {
    height: formatSize(24),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: formatSize(16)
  },
  detailsContainer: {
    flexDirection: 'row'
  },
  createdAt: {
    ...typography.tagline11Tag,
    color: colors.gray2
  },
  details: {
    ...typography.caption11Semibold,
    color: colors.orange
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.blue10,
    borderRadius: formatSize(8)
  }
}));
