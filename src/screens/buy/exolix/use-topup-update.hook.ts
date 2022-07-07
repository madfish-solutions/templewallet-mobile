import { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { refreshExolixExchangeDataAction } from '../../../store/exolix/exolix-actions';
import { useExolixExchangeData } from '../../../store/exolix/exolix-selectors';
import { isDefined } from '../../../utils/is-defined';

const useTopUpUpdate = (setIsError: (isError: boolean) => void) => {
  const exchangeData = useExolixExchangeData();
  const dispatch = useDispatch();
  const setExchangeData = useCallback(
    (id: string) => {
      dispatch(refreshExolixExchangeDataAction(id));
    },
    [dispatch]
  );
  const isAlive = useRef(false);

  useEffect(() => {
    let timeoutId = setTimeout(async function repeat() {
      isAlive.current = true;
      if (!isDefined(exchangeData)) {
        setIsError(true);

        return;
      }
      try {
        setExchangeData(exchangeData.id);
        if (!isAlive.current) {
          return;
        }
        timeoutId = setTimeout(repeat, 3000);
      } catch (e) {
        setIsError(true);
      }
    }, 3000);

    return () => {
      isAlive.current = false;
      clearTimeout(timeoutId);
    };
  }, [exchangeData, setExchangeData, setIsError]);
};

export default useTopUpUpdate;
