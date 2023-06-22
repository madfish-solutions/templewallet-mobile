import { ObjktTypeEnum } from 'src/enums/objkt-type.enum';

export interface Collection {
  name: string;
  logo: string;
  creator: string;
  contract: string;
  type: ObjktTypeEnum;
  galleryId?: string;
}

export interface CollectionsRootState {
  collections: CollectionState;
}

export interface CollectionState {
  created: Record<string, Collection[]>;
}

export const collectionsInitialState: CollectionState = { created: {} };
