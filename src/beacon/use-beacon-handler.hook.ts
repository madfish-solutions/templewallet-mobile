import { useEffect } from 'react';

import { ConfirmationTypeEnum } from '../interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from '../navigator/enums/modals.enum';
import { useNavigation } from '../navigator/hooks/use-navigation.hook';
import { BeaconHandler } from './beacon-handler';

export const useBeaconHandler = () => {
  const { navigate } = useNavigation();

  useEffect(() => {
    BeaconHandler.init(message =>
      navigate(ModalsEnum.Confirmation, { type: ConfirmationTypeEnum.DAppOperations, message })
    );
  }, []);
};
