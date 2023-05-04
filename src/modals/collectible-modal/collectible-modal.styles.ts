import { createUseStyles } from '../../styles/create-use-styles';
import { formatSize } from '../../styles/format-size';

export const useCollectibleModalStyles = createUseStyles(({ colors, typography }) => ({
  collection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: formatSize(12)
  },
  collectionLogo: {
    height: formatSize(36),
    width: formatSize(36),
    marginRight: formatSize(8),
    borderRadius: formatSize(6)
  },
  logoFallBack: {
    backgroundColor: colors.orange
  },
  collectionName: {
    ...typography.caption13Semibold,
    color: colors.black
  },
  nameContainer: {
    marginBottom: formatSize(8)
  },
  name: {
    ...typography.body20Bold,
    textTransform: 'none',
    color: colors.black
  },
  descriptionContainer: {
    marginBottom: formatSize(12)
  },
  description: {
    ...typography.caption13Regular,
    color: colors.black
  },
  creatorsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: formatSize(16)
  },
  creatorsText: {
    marginRight: formatSize(4),
    ...typography.caption13Regular,
    color: colors.gray1
  },
  linkWithIcon: {
    marginVertical: formatSize(4)
  },
  segmentControl: {
    marginBottom: formatSize(18)
  },
  marginBottom: {
    marginBottom: formatSize(16)
  }
}));
