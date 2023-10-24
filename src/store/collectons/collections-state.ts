import { ObjktCollectionType } from 'src/apis/objkt/types';

export interface Collection {
  name: string;
  logo: string;
  creator: string;
  contract: string;
  type: ObjktCollectionType;
  galleryPk?: number;
}

export interface CollectionState {
  created: Record<string, Collection[]>;
}

export const collectionsInitialState: CollectionState = { created: {} };
