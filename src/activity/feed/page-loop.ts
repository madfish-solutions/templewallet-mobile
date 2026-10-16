import type { Activity } from '../types';
import { throwIfAborted } from '../utils';

import { ActivityFeedPage, SourceCursor, UNKNOWN_SCANNED_DOWN_TO } from './types';

const MAX_PAGES_PER_FETCH = 5;

// A page often parses to zero rows (everything in it was filtered out) - keep scanning until one appears, but only up to the budget
export const fetchWithPageLoop = async <C extends SourceCursor>(
  fetchPage: (cursor: C | undefined, signal: AbortSignal) => Promise<ActivityFeedPage<C>>,
  initialCursor: C | undefined,
  signal: AbortSignal
): Promise<ActivityFeedPage<C>> => {
  let cursor = initialCursor;
  let scannedDownTo = UNKNOWN_SCANNED_DOWN_TO;
  const activities: Activity[] = [];

  for (let pageIndex = 0; pageIndex < MAX_PAGES_PER_FETCH; pageIndex++) {
    throwIfAborted(signal);

    const page = await fetchPage(cursor, signal);
    activities.push(...page.activities);
    scannedDownTo = Math.min(scannedDownTo, page.scannedDownTo);

    if (page.nextCursor === null || activities.length > 0) {
      return { activities, nextCursor: page.nextCursor, scannedDownTo };
    }

    cursor = page.nextCursor;
  }

  return { activities, nextCursor: cursor ?? null, scannedDownTo };
};
