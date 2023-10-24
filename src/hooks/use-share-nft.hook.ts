import { useCallback } from 'react';
import { Share } from 'react-native';

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

    if (dataStr.length > 7168) {
      // See: https://stackoverflow.com/questions/76084161/firebase-dynamic-links-apiexception-400-length-of-dynamiclink-14793-is-over-th
      return void showErrorToast({ title: 'Cannot share', description: 'Data is too large' });
    }

    try {
      const linkUrl = await getTempleDynamicLink(dataStr, {
        title,
        descriptionText: description,
        imageUrl: thumbnailUri ? formatImgUri(thumbnailUri, 'medium') : undefined
      });

      await Share.share({
        message: `View NFT with Temple Wallet mobile: ${linkUrl}`
      });

      await trackEvent(CollectibleModalSelectors.shareNFTSuccess, AnalyticsEventCategory.ButtonPress);
    } catch (e: any) {
      showErrorToast({
        description: e.message,
        isCopyButtonVisible: true,
        onPress: () => copyStringToClipboard(e.message)
      });

      await trackEvent(CollectibleModalSelectors.shareNFTFailed, AnalyticsEventCategory.ButtonPress, {
        errorMessage: e.message
      });
    }
  }, [slug, title, description, thumbnailUri, trackEvent]);
};
