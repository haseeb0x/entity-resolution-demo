// Watchlist entries are real public data from the OFAC SDN list
// (https://sanctionslist.ofac.treas.gov). Inclusion on the SDN list represents
// US Treasury designation, not criminal conviction. Population data is
// approximate and used for demonstration only.

import type { WatchlistEntry } from '@/types';

export const watchlist: WatchlistEntry[] = [];
