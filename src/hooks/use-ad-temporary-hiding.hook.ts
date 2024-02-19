import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { hidePromotionAction } from 'src/store/partners-promotion/partners-promotion-actions';
import { usePromotionHidingTimestampSelector } from 'src/store/partners-promotion/partners-promotion-selectors';
import { AD_HIDING_TIMEOUT } from 'src/utils/optimal.utils';

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
