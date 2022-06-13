import { useDispatch } from 'react-redux';

import { migrateAssetsVisibility } from '../../store/wallet/wallet-actions';

export const useStorageMigration = () => {
  const dispatch = useDispatch();

  dispatch(migrateAssetsVisibility());
};
