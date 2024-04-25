import { useCallback } from 'react';
import { Share } from 'react-native';

import { LIMIT_NFT_FEATURES } from 'src/config/system';
import { CollectibleModalSelectors } from 'src/modals/collectible-modal/collectible-modal.selectors';
import { showErrorToast } from 'src/toast/error-toast.utils';
import { AnalyticsEventCategory } from 'src/utils/analytics/analytics-event.enum';
import { useAnalytics } from 'src/utils/analytics/use-analytics.hook';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';
import { getTempleDynamicLink } from 'src/utils/dynamic-links';
import { formatImgUri } from 'src/utils/image.utils';
import { buildCollectibleDynamicLink } from 'src/utils/nft-dynamic-links';

export const useShareNFT = (slug: string, thumbnailUri: string | undefined, title = '---', description?: string) => {
  const { trackEvent } = useAnalytics();

  return useCallback(async () => {
    const dataStr = buildCollectibleDynamicLink(slug);

    try {
      const linkUrl = await getTempleDynamicLink(dataStr, {
        title,
        descriptionText: description,
        imageUrl: thumbnailUri ? formatImgUri(thumbnailUri, 'medium') : undefined
      });

      await Share.share({
        message: `View ${LIMIT_NFT_FEATURES ? 'collectible' : 'NFT'} with Temple Wallet mobile: ${linkUrl}`
      });

      await trackEvent(CollectibleModalSelectors.shareNFTSuccess, AnalyticsEventCategory.ButtonPress);
    } catch (error: any) {
      showErrorToast({
        description: error.message,
        isCopyButtonVisible: true,
        onPress: () => copyStringToClipboard(error.message)
      });

      await trackEvent(CollectibleModalSelectors.shareNFTFailed, AnalyticsEventCategory.ButtonPress, {
        errorMessage: error.message
      });
    }
  }, [slug, title, description, thumbnailUri, trackEvent]);
};
