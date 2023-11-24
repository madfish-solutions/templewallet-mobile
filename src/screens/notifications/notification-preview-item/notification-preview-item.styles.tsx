import { createUseStyles } from '../../../styles/create-use-styles';
import { formatSize } from '../../../styles/format-size';

export const useNotificationPreviewItemStyles = createUseStyles(({ colors, typography }) => ({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.pageBG,
    paddingLeft: formatSize(20),
    paddingRight: formatSize(22),
    paddingVertical: formatSize(16),
    borderBottomWidth: formatSize(0.5),
    borderBottomColor: colors.lines
  },
  containerRead: {
    backgroundColor: colors.input
  },
  iconContainer: {
    position: 'relative'
  },
  notificationDotIcon: {
    position: 'absolute',
    zIndex: 1,
    top: 0,
    right: 0
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
