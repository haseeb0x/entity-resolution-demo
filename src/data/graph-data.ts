// Small entity graph used by graph-context.ts (Scenario 5).
//
// Two intentionally disjoint clusters: the customer's Montreal counterparty
// network (employer + Canadian retailers/utilities), and the watchlist
// entity's Lebanese network (sanctioned organization + designated shells).
// They share zero neighbors — that absence is the signal that flips the
// verdict.

import type { GraphData } from '@/types';

export const graphData: GraphData = {
  nodes: [
    // Focal nodes (the two "Ali Hassan"s).
    {
      id: 'cust_ali_hassan_montreal',
      label: 'Ali Hassan (Montreal)',
      group: 'customer',
    },
    {
      id: 'ofac_ali_hassan_hezbollah',
      label: 'Ali Hassan (sanctioned)',
      group: 'watchlist',
    },
    // Customer's neighbors.
    { id: 'emp_shopify', label: 'Shopify Inc.', group: 'customer-neighbor' },
    {
      id: 'merch_loblaws',
      label: 'Loblaws',
      group: 'customer-neighbor',
    },
    {
      id: 'util_hydro_quebec',
      label: 'Hydro-Québec',
      group: 'customer-neighbor',
    },
    {
      id: 'merch_bell_canada',
      label: 'Bell Canada',
      group: 'customer-neighbor',
    },
    // Watchlist entity's neighbors.
    {
      id: 'ofac_org_hezbollah',
      label: 'Hizballah',
      group: 'watchlist-neighbor',
    },
    {
      id: 'ofac_shell_southlebanon_a',
      label: 'South Lebanon Trading LLC',
      group: 'watchlist-neighbor',
    },
    {
      id: 'ofac_shell_southlebanon_b',
      label: 'Bekaa Logistics SAL',
      group: 'watchlist-neighbor',
    },
  ],
  edges: [
    // Customer ↔ counterparties.
    { source: 'cust_ali_hassan_montreal', target: 'emp_shopify' },
    { source: 'cust_ali_hassan_montreal', target: 'merch_loblaws' },
    { source: 'cust_ali_hassan_montreal', target: 'util_hydro_quebec' },
    { source: 'cust_ali_hassan_montreal', target: 'merch_bell_canada' },
    // Watchlist entity ↔ designated counterparties.
    { source: 'ofac_ali_hassan_hezbollah', target: 'ofac_org_hezbollah' },
    {
      source: 'ofac_ali_hassan_hezbollah',
      target: 'ofac_shell_southlebanon_a',
    },
    {
      source: 'ofac_ali_hassan_hezbollah',
      target: 'ofac_shell_southlebanon_b',
    },
  ],
};
