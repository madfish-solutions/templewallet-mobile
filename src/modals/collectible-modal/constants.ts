import { Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const ITEMS_IN_ROW = 2;
const CONTAINER_OFFSET = 16;
const OFFSET_BETWEEN_ITEMS = 4;
const BORDER_WIDTH = 1;
const INITIAL_ITEM_WIDTH = Math.floor((screenWidth - CONTAINER_OFFSET * 2) / ITEMS_IN_ROW);

export const COLLECTIBLE_WIDTH = INITIAL_ITEM_WIDTH - OFFSET_BETWEEN_ITEMS - BORDER_WIDTH;

export const COLLECTION_ICON_SIZE = 36;
