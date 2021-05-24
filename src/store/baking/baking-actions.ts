import { BakerInterface } from '../../interfaces/baker.interface';
import { createActions } from '../create-actions';

export const loadSelectedBakerActions = createActions<string, BakerInterface, string>('baking/LOAD_SELECTED_BAKER');

export const loadBakersListActions = createActions<void, BakerInterface[], string>('baking/LOAD_BAKERS_LIST');
