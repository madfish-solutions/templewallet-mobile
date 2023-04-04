export interface Collection {
  name: string;
  logo: string;
  contract: string;
}

export interface CollectionsRootState {
  collections: CollectionState;
}

export interface CollectionState {
  collectionInfo: Collection[];
}

export const collectionsInitialState: CollectionState = { collectionInfo: [] };
