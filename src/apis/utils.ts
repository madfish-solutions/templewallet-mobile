import axios from 'axios';

import { sleep } from 'src/utils/timeouts.util';

export async function refetchOnce429<R>(fetcher: () => Promise<R>, delayAroundInMS = 1000): Promise<R> {
  try {
    return await fetcher();
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 429) {
      await sleep(delayAroundInMS);
      const res = await fetcher();
      await sleep(delayAroundInMS);

      return res;
    }

    throw err;
  }
}
