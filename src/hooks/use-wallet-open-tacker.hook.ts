import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { walletOpenedAction } from '../store/settings/settings-actions';

export const useWalletOpenTacker = () => {
  const dispatch = useDispatch();

  useEffect(() => void dispatch(walletOpenedAction()), []);
};
