import { bakingBadApi } from 'src/apis/baking-bad';

import { BakingBadGetBakerParams, BakingBadStoryResponse } from '../interfaces/baking-bad';

export const bakingBadGetBakerStory = ({ address }: BakingBadGetBakerParams) =>
  bakingBadApi.get<BakingBadStoryResponse>(`/story/${address}`).then(({ data }) => data);
