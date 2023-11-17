import { ObjktAttribute } from 'src/apis/objkt/types';

export interface CollectibleAttribute extends ObjktAttribute {
  attribute: ObjktAttribute['attribute'] & {
    rarity?: number;
  };
}
