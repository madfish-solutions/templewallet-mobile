import { object, SchemaOf } from 'yup';

import { AssetAmountInterface } from '../../components/asset-amount-input/asset-amount-input';
import { assetAmountValidation } from '../../form/validation/asset-amount';

export interface RemoveLiquidityModalFormValues {
  lpToken: AssetAmountInterface;
  aToken: AssetAmountInterface;
  bToken: AssetAmountInterface;
}

export const removeLiquidityModalValidationSchema: SchemaOf<RemoveLiquidityModalFormValues> = object().shape({
  lpToken: assetAmountValidation,
  aToken: assetAmountValidation,
  bToken: assetAmountValidation
});
