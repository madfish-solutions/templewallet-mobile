import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {
  migrateAccountsState,
  migrateIsShownDomainName,
  updateRpcSettings,
  migrateQuipuApy,
  migrateTokensMetadata,
  migrateTokenSuggestion,
  addDcpTokensMetadata
} from '../../store/migration/migration-actions';

export const useStorageMigration = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(migrateTokensMetadata());
    dispatch(migrateTokenSuggestion());
    dispatch(migrateIsShownDomainName());
    dispatch(migrateQuipuApy());
    dispatch(migrateAccountsState());
    dispatch(updateRpcSettings());
    dispatch(addDcpTokensMetadata());
  }, []);
};
