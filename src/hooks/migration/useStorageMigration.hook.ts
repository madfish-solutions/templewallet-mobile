import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {
  migrateAccountsState,
  migrateIsShownDomainName,
  migrateRpcList,
  migrateQuipuApy,
  migrateTokensMetadata,
  migrateTokenSuggestion
} from '../../store/migration/migration-actions';

export const useStorageMigration = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(migrateTokensMetadata());
    dispatch(migrateTokenSuggestion());
    dispatch(migrateIsShownDomainName());
    dispatch(migrateQuipuApy());
    dispatch(migrateAccountsState());
    dispatch(migrateRpcList());
  }, []);
};
