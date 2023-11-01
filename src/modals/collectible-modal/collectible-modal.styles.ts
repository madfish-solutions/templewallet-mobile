import { createUseStylesMemoized } from 'src/styles/create-use-styles';
import { formatSize } from 'src/styles/format-size';

export const useCollectibleModalStyles = createUseStylesMemoized(({ colors, typography }) => ({
  mediaContainer: {
    backgroundColor: colors.blue10,
    borderRadius: formatSize(4),
    overflow: 'hidden'
  },
  collectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: formatSize(12)
  },
  collection: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  collectionLogo: {
    height: formatSize(36),
    width: formatSize(36),
    marginRight: formatSize(8),
    borderRadius: formatSize(6)
  },
  logoFallBack: {
    backgroundColor: colors.input
  },
  collectionName: {
    ...typography.caption13Semibold,
    color: colors.black,
    maxWidth: formatSize(150)
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
  marginRight: {
    marginRight: formatSize(6)
  },
  segmentControl: {
    marginBottom: formatSize(16)
  },
  burnContainer: {
    alignItems: 'center',
    marginTop: formatSize(8)
  },
  burnButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: formatSize(108),
    paddingVertical: formatSize(8),
    paddingHorizontal: formatSize(8.5)
  },
  burnButtonText: {
    marginRight: formatSize(2),
    ...typography.tagline13Tag,
    color: colors.destructive
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  shareButtonText: {
    ...typography.tagline13Tag,
    color: colors.peach
  }
}));
