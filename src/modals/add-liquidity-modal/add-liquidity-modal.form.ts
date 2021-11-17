import { object, SchemaOf } from 'yup';

import { AssetAmountInterface } from '../../components/asset-amount-input/asset-amount-input';
import { assetAmountValidation } from '../../form/validation/asset-amount';

export interface AddLiquidityModalFormValues {
  aToken: AssetAmountInterface;
  bToken: AssetAmountInterface;
}

export const addLiquidityModalValidationSchema: SchemaOf<AddLiquidityModalFormValues> = object().shape({
  aToken: assetAmountValidation,
  bToken: assetAmountValidation
});
