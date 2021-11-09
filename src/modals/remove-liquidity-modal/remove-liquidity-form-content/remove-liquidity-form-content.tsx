import { BigNumber } from 'bignumber.js';
import { FormikProps } from 'formik';
import React, { FC } from 'react';

import { AssetAmountInterface } from '../../../components/asset-amount-input/asset-amount-input';
import { Divider } from '../../../components/divider/divider';
import { FormAssetAmountInput } from '../../../form/form-asset-amount-input/form-asset-amount-input';
import { formatSize } from '../../../styles/format-size';
import { findLpToTokenOutput, findTokenToLpInput } from '../../../utils/dex.utils';
import { isDefined } from '../../../utils/is-defined';
import { RemoveLiquidityModalFormValues } from '../remove-liquidity-modal.form';

const lpTokenTotalSupply = new BigNumber(145213358);
const aTokenPool = new BigNumber(1451598517666);
const bTokenPool = new BigNumber(14455122863);

export const RemoveLiquidityFormContent: FC<FormikProps<RemoveLiquidityModalFormValues>> = ({
  values,
  setTouched,
  setValues
}) => {
  const updateForm = (lpTokenAmount?: BigNumber, aTokenAmount?: BigNumber, bTokenAmount?: BigNumber) => {
    setValues({
      ...values,
      lpToken: { ...values.lpToken, amount: lpTokenAmount },
      aToken: { ...values.aToken, amount: aTokenAmount },
      bToken: { ...values.bToken, amount: bTokenAmount }
    });

    setTimeout(() => {
      setTouched({
        lpToken: { amount: true },
        aToken: { amount: true },
        bToken: { amount: true }
      });
    });
  };
  const handleLpTokenChange = (lpToken: AssetAmountInterface) => {
    let lpTokenAmount, aTokenAmount, bTokenAmount;

    if (isDefined(lpToken.amount)) {
      lpTokenAmount = lpToken.amount;
      aTokenAmount = findLpToTokenOutput(lpTokenAmount, lpTokenTotalSupply, aTokenPool);
      bTokenAmount = findLpToTokenOutput(lpTokenAmount, lpTokenTotalSupply, bTokenPool);
    }

    updateForm(lpTokenAmount, aTokenAmount, bTokenAmount);
  };

  const handleATokenChange = (aToken: AssetAmountInterface) => {
    let lpTokenAmount, aTokenAmount, bTokenAmount;

    if (isDefined(aToken.amount)) {
      aTokenAmount = aToken.amount;
      lpTokenAmount = findTokenToLpInput(aTokenAmount, lpTokenTotalSupply, aTokenPool);
      bTokenAmount = findLpToTokenOutput(lpTokenAmount, lpTokenTotalSupply, bTokenPool);
    }

    updateForm(lpTokenAmount, aTokenAmount, bTokenAmount);
  };

  const handleBTokenChange = (bToken: AssetAmountInterface) => {
    let lpTokenAmount, aTokenAmount, bTokenAmount;

    if (isDefined(bToken.amount)) {
      bTokenAmount = bToken.amount;
      lpTokenAmount = findTokenToLpInput(bTokenAmount, lpTokenTotalSupply, bTokenPool);
      aTokenAmount = findLpToTokenOutput(lpTokenAmount, lpTokenTotalSupply, aTokenPool);
    }

    updateForm(lpTokenAmount, aTokenAmount, bTokenAmount);
  };

  return (
    <>
      <FormAssetAmountInput
        name="lpToken"
        label="Select LP"
        assetsList={[values.lpToken.asset]}
        onValueChange={handleLpTokenChange}
      />
      <Divider size={formatSize(16)} />
      <FormAssetAmountInput
        name="aToken"
        label="Output"
        assetsList={[values.aToken.asset]}
        onValueChange={handleATokenChange}
      />
      <Divider size={formatSize(16)} />
      <FormAssetAmountInput
        name="bToken"
        label="Output"
        assetsList={[values.bToken.asset]}
        onValueChange={handleBTokenChange}
      />
    </>
  );
};
