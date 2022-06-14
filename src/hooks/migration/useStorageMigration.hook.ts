import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { migrateAssetsVisibility } from '../../store/wallet/wallet-actions';

export const useStorageMigration = () => {
  const dispatch = useDispatch();

  useEffect(() => void dispatch(migrateAssetsVisibility()), []);
};
