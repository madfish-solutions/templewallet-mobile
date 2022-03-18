import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { resetKeychainOnInstallAction } from '../store/root-state.actions';
import { useFirstAppLaunchSelector } from '../store/settings/settings-selectors';

export const useResetKeychainOnInstall = () => {
  const dispatch = useDispatch();
  const isFirstAppLaunch = useFirstAppLaunchSelector();

  useEffect(() => void dispatch(resetKeychainOnInstallAction.submit()), [isFirstAppLaunch]);
};
