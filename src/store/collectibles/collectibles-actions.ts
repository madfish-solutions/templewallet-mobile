import { AttributeInfo } from '../../interfaces/attribute.interface';
import { CollectibleDetailsInterface } from '../../token/interfaces/collectible-interfaces.interface';
import { createActions } from '../create-actions';

export const loadCollectiblesDetailsActions = createActions<
  string,
  Record<string, CollectibleDetailsInterface>,
  string
>('assets/LOAD_TOKEN_METADATA');

export const loadCollectibleAttributesActions = createActions<
  { tokenSlug: string; attributeIds: number[]; isGallery: boolean },
  { tokenSlug: string; attributesInfo: AttributeInfo[] },
  string
>('assets/LOAD_TOKEN_METADATA');
