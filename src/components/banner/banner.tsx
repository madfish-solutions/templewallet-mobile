import React, { FC } from 'react';
import { useDispatch } from 'react-redux';

import { togglePartnersPromotionAction } from 'src/store/partners-promotion/partners-promotion-actions';
import { setAdsBannerVisibilityAction } from 'src/store/settings/settings-actions';

import { ABContainer } from '../ab-container/ab-container';
import { AGroupBanner } from './a-group-banner/a-group-banner';
import { BGroupBanner } from './b-group-banner/b-group-banner';
import { BannerProps } from './banner.props';

export const Banner: FC<BannerProps> = ({ style }) => {
  const dispatch = useDispatch();

  const handleDisableBannerButton = () => {
    dispatch(togglePartnersPromotionAction(false));
    dispatch(setAdsBannerVisibilityAction(false));
  };

  const handleEnableBannerButton = () => {
    dispatch(togglePartnersPromotionAction(true));
    dispatch(setAdsBannerVisibilityAction(false));
  };

  return (
    <ABContainer
      groupAComponent={
        <AGroupBanner style={style} onDisable={handleDisableBannerButton} onEnable={handleEnableBannerButton} />
      }
      groupBComponent={
        <BGroupBanner style={style} onDisable={handleDisableBannerButton} onEnable={handleEnableBannerButton} />
      }
    />
  );
};
