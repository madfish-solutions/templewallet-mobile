import { PayloadAction } from '@reduxjs/toolkit';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { useBlockLevel } from './use-block-level.hook';

export const useLoadOnEachBlock = <P, T extends string>(
  isLoading: boolean,
  actionFactory: () => PayloadAction<P, T>
) => {
  const blockLevel = useBlockLevel();
  const prevBlockLevelRef = useRef<number | undefined>(-1);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoading && prevBlockLevelRef.current !== blockLevel) {
      dispatch(actionFactory());
      prevBlockLevelRef.current = blockLevel;
    }
  }, [dispatch, blockLevel, isLoading, actionFactory]);
};
