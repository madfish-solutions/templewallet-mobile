import React from 'react';
import { useDispatch } from 'react-redux';

import { Divider } from '../../../components/divider/divider';
import { IconNameEnum } from '../../../components/icon/icon-name.enum';
import { ScreensEnum } from '../../../navigator/enums/screens.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { loadExolixCurrenciesAction } from '../../../store/exolix/exolix-actions';
import { formatSize } from '../../../styles/format-size';
import { TopUpOption } from '../components/top-up-option/top-up-option';

export const CryptoTopup = () => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();

  const handleOnPress = () => {
    dispatch(loadExolixCurrenciesAction.submit());
    navigate(ScreensEnum.Exolix);
  };

  return (
    <>
      <Divider size={formatSize(16)} />
      <TopUpOption title="Buy TEZ with Exolix" iconName={IconNameEnum.Exolix} onPress={handleOnPress} />
    </>
  );
};
