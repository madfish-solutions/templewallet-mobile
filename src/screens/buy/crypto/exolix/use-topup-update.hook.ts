import { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { emptyFn } from '../../../../config/general';
import { refreshExolixExchangeDataAction } from '../../../../store/exolix/exolix-actions';
import { useExolixExchangeData } from '../../../../store/exolix/exolix-selectors';
import { isDefined } from '../../../../utils/is-defined';

const useTopUpUpdate = (setIsError: (isError: boolean) => void) => {
  const exchangeData = useExolixExchangeData();
  const dispatch = useDispatch();
  const setExchangeData = useCallback(
    (id: string) => {
      dispatch(refreshExolixExchangeDataAction(id));
    },
    [dispatch]
  );
  const timeoutId = useRef(setTimeout(emptyFn, 0));

  const repeat = () => {
    if (!isDefined(exchangeData)) {
      setIsError(true);

      return;
    }
    try {
      setExchangeData(exchangeData.id);
      timeoutId.current = setTimeout(repeat, 3000);
    } catch (e) {
      setIsError(true);
    }
  };

  useEffect(() => {
    timeoutId.current = setTimeout(repeat, 3000);

    return () => {
      clearTimeout(timeoutId.current);
    };
  }, [exchangeData, setExchangeData, setIsError]);
};

export default useTopUpUpdate;
