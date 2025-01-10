import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { hidePromotionAction } from 'src/store/partners-promotion/partners-promotion-actions';
import { usePromotionHidingTimestampSelector } from 'src/store/partners-promotion/partners-promotion-selectors';

export const AD_HIDING_TIMEOUT = 12 * 3600 * 1000;

const shouldBeHiddenTemporarily = (hiddenAt: number) => {
  return Date.now() - hiddenAt < AD_HIDING_TIMEOUT;
};

export const useAdTemporaryHiding = (id: string) => {
  const dispatch = useDispatch();
  const hiddenAt = usePromotionHidingTimestampSelector(id);
  const [isHiddenTemporarily, setIsHiddenTemporarily] = useState(shouldBeHiddenTemporarily(hiddenAt));

  useEffect(() => {
    const newIsHiddenTemporarily = shouldBeHiddenTemporarily(hiddenAt);
    setIsHiddenTemporarily(newIsHiddenTemporarily);

    if (newIsHiddenTemporarily) {
      const timeout = setTimeout(() => {
        setIsHiddenTemporarily(false);
      }, Math.max(Date.now() - hiddenAt + AD_HIDING_TIMEOUT, 0));

      return () => clearTimeout(timeout);
    }

    return;
  }, [hiddenAt]);

  const hidePromotion = useCallback(() => {
    dispatch(hidePromotionAction({ timestamp: Date.now(), id }));
  }, [id, dispatch]);

  return { isHiddenTemporarily, hidePromotion };
};
