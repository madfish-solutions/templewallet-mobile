import { PayloadAction } from '@reduxjs/toolkit';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { useAccountAddressForTezos } from 'src/store/wallet/wallet-selectors';

import { useBlockLevel } from './use-block-level.hook';

export const useLoadOnEachBlock = <P, T extends string>(
  isLoading: boolean,
  actionFactory: (currentAccountPkh: string) => PayloadAction<P, T>
) => {
  const blockLevel = useBlockLevel();
  const prevBlockLevelRef = useRef<number | undefined>(-1);
  const currentAccountPkh = useAccountAddressForTezos();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!currentAccountPkh) {
      return;
    }

    if (!isLoading && prevBlockLevelRef.current !== blockLevel) {
      dispatch(actionFactory(currentAccountPkh));
      prevBlockLevelRef.current = blockLevel;
    }
  }, [dispatch, blockLevel, isLoading, actionFactory, currentAccountPkh]);
};
