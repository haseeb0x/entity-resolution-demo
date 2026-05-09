// Entity graph for the screening engine.
//
// Each customer and watchlist entry has counterparty edges representing the
// kind of data a financial institution accumulates over time: employer payroll
// deposits, retail purchases, utility payments, charity donations, banking
// relationships. On the watchlist side, counterparties are sanctioned
// organizations and designated shell companies.
//
// The decisive structural property: no customer counterparty overlaps with
// any watchlist counterparty. Shopify is not Hezbollah. This disjointness
// is itself a signal — the graph-context module converts it into a strong
// negative log-odds contribution that helps clear false positives.

import type { GraphData } from '@/types';

export const graphData: GraphData = {
  nodes: [
    // ===================================================================
    // Scenario 5 focal nodes (original demo — preserved)
    // ===================================================================
    { id: 'cust_ali_hassan_montreal', label: 'Ali Hassan (Montreal)', group: 'customer' },
    { id: 'ofac_ali_hassan_hezbollah', label: 'Ali Hassan (sanctioned)', group: 'watchlist' },

    // ===================================================================
    // 20-person customer database — focal nodes
    // ===================================================================
    { id: 'db_ahmad_khan', label: 'Ahmad Khan', group: 'customer' },
    { id: 'db_muhammad_hassan', label: 'Muhammad Hassan', group: 'customer' },
    { id: 'db_ali_ahmad', label: 'Ali Ahmad', group: 'customer' },
    { id: 'db_omar_ibrahim', label: 'Omar Ibrahim', group: 'customer' },
    { id: 'db_abdullah_ahmed', label: 'Abdullah Ahmed', group: 'customer' },
    { id: 'db_hassan_ali', label: 'Hassan Ali', group: 'customer' },
    { id: 'db_ibrahim_mohammed', label: 'Ibrahim Mohammed', group: 'customer' },
    { id: 'db_khalid_rahman', label: 'Khalid Rahman', group: 'customer' },
    { id: 'db_yusuf_ali', label: 'Yusuf Ali', group: 'customer' },
    { id: 'db_saif_ahmad', label: 'Saif Ahmad', group: 'customer' },
    { id: 'db_fatima_hassan', label: 'Fatima Hassan', group: 'customer' },
    { id: 'db_muhammad_ali', label: 'Muhammad Ali', group: 'customer' },
    { id: 'db_abdullah_ibrahim', label: 'Abdullah Ibrahim', group: 'customer' },
    { id: 'db_ayman_hassan', label: 'Ayman Hassan', group: 'customer' },
    { id: 'db_omar_hassan', label: 'Omar Hassan', group: 'customer' },
    { id: 'db_khaled_yusuf', label: 'Khaled Yusuf', group: 'customer' },
    { id: 'db_ismail_ahmed', label: 'Ismail Ahmed', group: 'customer' },
    { id: 'db_muhammad_yusuf', label: 'Muhammad Yusuf', group: 'customer' },
    { id: 'db_noor_ahmad', label: 'Noor Ahmad', group: 'customer' },
    { id: 'db_hassan_omar', label: 'Hassan Omar', group: 'customer' },

    // ===================================================================
    // 20-person watchlist collision targets — focal nodes
    // ===================================================================
    { id: 'ofac_ahmad_khan', label: 'Ahmad Khan (SDN)', group: 'watchlist' },
    { id: 'ofac_muhammad_hassan', label: 'Muhammad Hassan (SDN)', group: 'watchlist' },
    { id: 'ofac_ali_ahmad', label: 'Ali Ahmad (SDN)', group: 'watchlist' },
    { id: 'ofac_omar_ibrahim', label: 'Omar Ibrahim (SDN)', group: 'watchlist' },
    { id: 'ofac_abdullah_ahmed', label: 'Abdullah Ahmed (SDN)', group: 'watchlist' },
    { id: 'ofac_hassan_ali', label: 'Hassan Ali (SDN)', group: 'watchlist' },
    { id: 'ofac_ibrahim_mohammed', label: 'Ibrahim Mohammed (SDN)', group: 'watchlist' },
    { id: 'ofac_khalid_rahman', label: 'Khalid Rahman (SDN)', group: 'watchlist' },
    { id: 'ofac_yusuf_ali', label: 'Yusuf Ali (SDN)', group: 'watchlist' },
    { id: 'ofac_saif_ahmad', label: 'Saif Ahmad (SDN)', group: 'watchlist' },
    { id: 'ofac_fatima_hassan', label: 'Fatima Hassan (SDN)', group: 'watchlist' },
    { id: 'ofac_muhammad_ali_af', label: 'Muhammad Ali (SDN)', group: 'watchlist' },
    { id: 'ofac_abdullah_ibrahim', label: 'Abdullah Ibrahim (SDN)', group: 'watchlist' },
    { id: 'ofac_ayman_hassan', label: 'Ayman Hassan (SDN)', group: 'watchlist' },
    { id: 'ofac_omar_hassan', label: 'Omar Hassan (SDN)', group: 'watchlist' },
    { id: 'ofac_khaled_yusuf', label: 'Khaled Yusuf (SDN)', group: 'watchlist' },
    { id: 'ofac_ismail_ahmed', label: 'Ismail Ahmed (SDN)', group: 'watchlist' },
    { id: 'ofac_muhammad_yusuf', label: 'Muhammad Yusuf (SDN)', group: 'watchlist' },
    { id: 'ofac_noor_ahmad', label: 'Noor Ahmad (SDN)', group: 'watchlist' },
    { id: 'ofac_hassan_omar', label: 'Hassan Omar (SDN)', group: 'watchlist' },

    // ===================================================================
    // Customer counterparties — legitimate businesses
    // ===================================================================

    // Employers
    { id: 'emp_shopify', label: 'Shopify Inc.', group: 'customer-neighbor' },
    { id: 'emp_dearborn_schools', label: 'Dearborn Public Schools', group: 'customer-neighbor' },
    { id: 'emp_nhs', label: 'NHS Trust', group: 'customer-neighbor' },
    { id: 'emp_jpmorgan', label: 'JPMorgan Chase', group: 'customer-neighbor' },
    { id: 'emp_pwc', label: 'PwC', group: 'customer-neighbor' },
    { id: 'emp_ford', label: 'Ford Motor Co.', group: 'customer-neighbor' },
    { id: 'emp_bp', label: 'BP', group: 'customer-neighbor' },
    { id: 'emp_ucl', label: 'UCL', group: 'customer-neighbor' },
    { id: 'emp_target', label: 'Target Corp.', group: 'customer-neighbor' },
    { id: 'emp_tyro', label: 'Tyro Health', group: 'customer-neighbor' },
    { id: 'emp_shoppers', label: 'Shoppers Drug Mart', group: 'customer-neighbor' },
    { id: 'emp_sap', label: 'SAP SE', group: 'customer-neighbor' },
    { id: 'emp_govt_canada', label: 'Gov. of Canada', group: 'customer-neighbor' },
    { id: 'emp_spotify', label: 'Spotify AB', group: 'customer-neighbor' },
    { id: 'emp_bnp_cib', label: 'BNP Paribas CIB', group: 'customer-neighbor' },
    { id: 'emp_som', label: 'SOM', group: 'customer-neighbor' },
    { id: 'emp_accenture', label: 'Accenture', group: 'customer-neighbor' },
    { id: 'emp_aecom', label: 'AECOM', group: 'customer-neighbor' },
    { id: 'emp_kings_college', label: "King's College Hospital", group: 'customer-neighbor' },
    { id: 'emp_bbc', label: 'BBC', group: 'customer-neighbor' },

    // Banks
    { id: 'bank_td', label: 'TD Bank', group: 'customer-neighbor' },
    { id: 'bank_barclays', label: 'Barclays', group: 'customer-neighbor' },
    { id: 'bank_chase', label: 'Chase', group: 'customer-neighbor' },
    { id: 'bank_hsbc', label: 'HSBC', group: 'customer-neighbor' },
    { id: 'bank_santander', label: 'Santander', group: 'customer-neighbor' },
    { id: 'bank_wells_fargo', label: 'Wells Fargo', group: 'customer-neighbor' },
    { id: 'bank_rbc', label: 'RBC', group: 'customer-neighbor' },
    { id: 'bank_deutsche', label: 'Deutsche Bank', group: 'customer-neighbor' },
    { id: 'bank_cibc', label: 'CIBC', group: 'customer-neighbor' },
    { id: 'bank_nordea', label: 'Nordea', group: 'customer-neighbor' },
    { id: 'bank_bnp', label: 'BNP Paribas', group: 'customer-neighbor' },
    { id: 'bank_anz', label: 'ANZ', group: 'customer-neighbor' },
    { id: 'bank_emirates_nbd', label: 'Emirates NBD', group: 'customer-neighbor' },
    { id: 'bank_monzo', label: 'Monzo', group: 'customer-neighbor' },

    // Merchants / Retail
    { id: 'merch_tim_hortons', label: 'Tim Hortons', group: 'customer-neighbor' },
    { id: 'merch_kroger', label: 'Kroger', group: 'customer-neighbor' },
    { id: 'merch_tesco', label: 'Tesco', group: 'customer-neighbor' },
    { id: 'merch_walmart', label: 'Walmart', group: 'customer-neighbor' },
    { id: 'merch_sainsburys', label: "Sainsbury's", group: 'customer-neighbor' },
    { id: 'merch_meijer', label: 'Meijer', group: 'customer-neighbor' },
    { id: 'merch_heb', label: 'H-E-B', group: 'customer-neighbor' },
    { id: 'merch_aldi', label: 'Aldi', group: 'customer-neighbor' },
    { id: 'merch_woolworths', label: 'Woolworths', group: 'customer-neighbor' },
    { id: 'merch_loblaws', label: 'Loblaws', group: 'customer-neighbor' },
    { id: 'merch_lidl', label: 'Lidl', group: 'customer-neighbor' },
    { id: 'merch_metro', label: 'Metro', group: 'customer-neighbor' },
    { id: 'merch_asda', label: 'Asda', group: 'customer-neighbor' },
    { id: 'merch_ica', label: 'ICA', group: 'customer-neighbor' },
    { id: 'merch_carrefour', label: 'Carrefour', group: 'customer-neighbor' },
    { id: 'merch_costco', label: 'Costco', group: 'customer-neighbor' },
    { id: 'merch_carrefour_ae', label: 'Carrefour UAE', group: 'customer-neighbor' },
    { id: 'merch_coles', label: 'Coles', group: 'customer-neighbor' },

    // Utilities
    { id: 'util_dte_energy', label: 'DTE Energy', group: 'customer-neighbor' },
    { id: 'util_comed', label: 'ComEd', group: 'customer-neighbor' },
    { id: 'util_british_gas', label: 'British Gas', group: 'customer-neighbor' },
    { id: 'util_centerpoint', label: 'CenterPoint', group: 'customer-neighbor' },
    { id: 'util_thames_water', label: 'Thames Water', group: 'customer-neighbor' },
    { id: 'util_xcel', label: 'Xcel Energy', group: 'customer-neighbor' },
    { id: 'util_agl', label: 'AGL Energy', group: 'customer-neighbor' },
    { id: 'util_enbridge', label: 'Enbridge Gas', group: 'customer-neighbor' },
    { id: 'util_vattenfall', label: 'Vattenfall', group: 'customer-neighbor' },
    { id: 'util_edf', label: 'EDF', group: 'customer-neighbor' },
    { id: 'util_coned', label: 'ConEd', group: 'customer-neighbor' },
    { id: 'util_dewa', label: 'DEWA', group: 'customer-neighbor' },
    { id: 'util_origin', label: 'Origin Energy', group: 'customer-neighbor' },
    { id: 'util_hydro_quebec', label: 'Hydro-Québec', group: 'customer-neighbor' },
    { id: 'util_ottawa_hydro', label: 'Ottawa Hydro', group: 'customer-neighbor' },
    { id: 'merch_bell_canada', label: 'Bell Canada', group: 'customer-neighbor' },

    // Charities
    { id: 'charity_launchgood', label: 'LaunchGood', group: 'customer-neighbor' },
    { id: 'charity_islamic_relief', label: 'Islamic Relief UK', group: 'customer-neighbor' },
    { id: 'charity_muslim_aid', label: 'Muslim Aid', group: 'customer-neighbor' },

    // Scenario 5 extra customer neighbors (deeper graph for stronger disjointness signal)
    { id: 'bank_national', label: 'National Bank of Canada', group: 'customer-neighbor' },
    { id: 'util_videotron', label: 'Vidéotron', group: 'customer-neighbor' },
    { id: 'merch_jean_coutu', label: 'Jean Coutu', group: 'customer-neighbor' },
    { id: 'merch_dollarama', label: 'Dollarama', group: 'customer-neighbor' },

    // ===================================================================
    // Original watchlist natural persons (Scenarios 1–4 + other colliders)
    // — these must also be in the graph so that graph context is available
    // when the 20-person sweep matches against them instead of the new
    // dedicated collision entries.
    // ===================================================================
    { id: 'ofac_muhammad_ahmad', label: 'Muhammad Ahmad (SDN)', group: 'watchlist' },
    { id: 'ofac_abdullah_mohammed', label: 'Abdullah Mohammed (SDN)', group: 'watchlist' },
    { id: 'ofac_hassan_nasrallah', label: 'Hassan Nasrallah (SDN)', group: 'watchlist' },
    { id: 'ofac_ayman_al_zawahiri', label: 'Ayman al-Zawahiri (SDN)', group: 'watchlist' },
    { id: 'ofac_saif_al_adel', label: 'Saif al-Adel (SDN)', group: 'watchlist' },
    { id: 'ofac_ibrahim_hassan_synth', label: 'Ibrahim Hassan (SDN)', group: 'watchlist' },
    { id: 'ofac_khaled_al_ahmad_synth', label: 'Khaled al-Ahmad (SDN)', group: 'watchlist' },
    { id: 'ofac_yusuf_mohammed_synth', label: 'Yusuf Mohammed (SDN)', group: 'watchlist' },
    { id: 'ofac_omar_al_sayyid_synth', label: 'Omar al-Sayyid (SDN)', group: 'watchlist' },

    // ===================================================================
    // Watchlist counterparties — sanctioned organizations and shells
    // ===================================================================
    { id: 'ofac_org_hezbollah', label: 'Hizballah', group: 'watchlist-neighbor' },
    { id: 'ofac_shell_southlebanon_a', label: 'South Lebanon Trading LLC', group: 'watchlist-neighbor' },
    { id: 'ofac_shell_southlebanon_b', label: 'Bekaa Logistics SAL', group: 'watchlist-neighbor' },
    { id: 'ofac_org_aqap', label: 'AQAP', group: 'watchlist-neighbor' },
    { id: 'ofac_shell_yemen_trading', label: 'Yemen General Trading LLC', group: 'watchlist-neighbor' },
    { id: 'ofac_org_ttp', label: 'TTP', group: 'watchlist-neighbor' },
    { id: 'ofac_shell_pk_hawala', label: 'Frontier Exchange Services', group: 'watchlist-neighbor' },
    { id: 'ofac_org_isis', label: 'ISIS', group: 'watchlist-neighbor' },
    { id: 'ofac_shell_iraq_trading', label: 'Mesopotamia Import-Export', group: 'watchlist-neighbor' },
    { id: 'ofac_shell_syria_trading', label: 'Levant Commercial SARL', group: 'watchlist-neighbor' },
    { id: 'ofac_shell_syria_logistics', label: 'Damascus Logistics', group: 'watchlist-neighbor' },
    { id: 'ofac_org_alshabaab', label: 'Al-Shabaab', group: 'watchlist-neighbor' },
    { id: 'ofac_shell_somalia_trading', label: 'Horn of Africa Trading', group: 'watchlist-neighbor' },
    { id: 'ofac_org_alqaeda', label: 'al-Qaeda', group: 'watchlist-neighbor' },
    { id: 'ofac_shell_egypt_front', label: 'Nile Valley Foundation', group: 'watchlist-neighbor' },
    { id: 'ofac_org_taliban', label: 'Taliban', group: 'watchlist-neighbor' },
    { id: 'ofac_shell_af_hawala', label: 'Kabul Money Exchange', group: 'watchlist-neighbor' },
    { id: 'ofac_shell_sa_front', label: 'Arabian Peninsula Relief', group: 'watchlist-neighbor' },

    // Scenario 5 extra watchlist neighbors (deeper graph for stronger disjointness signal)
    { id: 'ofac_shell_tyre_trading', label: 'Tyre Import-Export Co.', group: 'watchlist-neighbor' },
    { id: 'ofac_shell_dahiyeh_exchange', label: 'Dahiyeh Exchange House', group: 'watchlist-neighbor' },
    { id: 'ofac_shell_bekaa_construction', label: 'Bekaa Construction Ltd', group: 'watchlist-neighbor' },
    { id: 'ofac_assoc_iran_quds_proxy', label: 'IRGC-QF Proxy Cell', group: 'watchlist-neighbor' },
    { id: 'ofac_shell_sidon_shipping', label: 'Sidon Maritime Services', group: 'watchlist-neighbor' },
  ],

  edges: [
    // ===================================================================
    // Scenario 5 edges (original demo — preserved)
    // ===================================================================
    { source: 'cust_ali_hassan_montreal', target: 'emp_shopify' },
    { source: 'cust_ali_hassan_montreal', target: 'merch_loblaws' },
    { source: 'cust_ali_hassan_montreal', target: 'util_hydro_quebec' },
    { source: 'cust_ali_hassan_montreal', target: 'merch_bell_canada' },
    { source: 'cust_ali_hassan_montreal', target: 'bank_national' },
    { source: 'cust_ali_hassan_montreal', target: 'util_videotron' },
    { source: 'cust_ali_hassan_montreal', target: 'merch_jean_coutu' },
    { source: 'cust_ali_hassan_montreal', target: 'merch_dollarama' },
    { source: 'ofac_ali_hassan_hezbollah', target: 'ofac_org_hezbollah' },
    { source: 'ofac_ali_hassan_hezbollah', target: 'ofac_shell_southlebanon_a' },
    { source: 'ofac_ali_hassan_hezbollah', target: 'ofac_shell_southlebanon_b' },
    { source: 'ofac_ali_hassan_hezbollah', target: 'ofac_shell_tyre_trading' },
    { source: 'ofac_ali_hassan_hezbollah', target: 'ofac_shell_dahiyeh_exchange' },
    { source: 'ofac_ali_hassan_hezbollah', target: 'ofac_shell_bekaa_construction' },
    { source: 'ofac_ali_hassan_hezbollah', target: 'ofac_assoc_iran_quds_proxy' },
    { source: 'ofac_ali_hassan_hezbollah', target: 'ofac_shell_sidon_shipping' },

    // ===================================================================
    // Customer database → legitimate counterparties
    // ===================================================================

    // 1. Ahmad Khan (Toronto) → Shopify, TD Bank, Tim Hortons, LaunchGood
    { source: 'db_ahmad_khan', target: 'emp_shopify' },
    { source: 'db_ahmad_khan', target: 'bank_td' },
    { source: 'db_ahmad_khan', target: 'merch_tim_hortons' },
    { source: 'db_ahmad_khan', target: 'charity_launchgood' },

    // 2. Muhammad Hassan (Dearborn) → Schools, DTE, Kroger, LaunchGood
    { source: 'db_muhammad_hassan', target: 'emp_dearborn_schools' },
    { source: 'db_muhammad_hassan', target: 'util_dte_energy' },
    { source: 'db_muhammad_hassan', target: 'merch_kroger' },
    { source: 'db_muhammad_hassan', target: 'charity_launchgood' },

    // 3. Ali Ahmad (London) → NHS, Barclays, Tesco, Islamic Relief
    { source: 'db_ali_ahmad', target: 'emp_nhs' },
    { source: 'db_ali_ahmad', target: 'bank_barclays' },
    { source: 'db_ali_ahmad', target: 'merch_tesco' },
    { source: 'db_ali_ahmad', target: 'charity_islamic_relief' },

    // 4. Omar Ibrahim (Chicago) → JPMorgan, Walmart, ComEd, Chase
    { source: 'db_omar_ibrahim', target: 'emp_jpmorgan' },
    { source: 'db_omar_ibrahim', target: 'merch_walmart' },
    { source: 'db_omar_ibrahim', target: 'util_comed' },
    { source: 'db_omar_ibrahim', target: 'bank_chase' },

    // 5. Abdullah Ahmed (Manchester) → PwC, HSBC, Sainsbury's, Muslim Aid
    { source: 'db_abdullah_ahmed', target: 'emp_pwc' },
    { source: 'db_abdullah_ahmed', target: 'bank_hsbc' },
    { source: 'db_abdullah_ahmed', target: 'merch_sainsburys' },
    { source: 'db_abdullah_ahmed', target: 'charity_muslim_aid' },

    // 6. Hassan Ali (Detroit) → Ford, DTE, Meijer, Chase
    { source: 'db_hassan_ali', target: 'emp_ford' },
    { source: 'db_hassan_ali', target: 'util_dte_energy' },
    { source: 'db_hassan_ali', target: 'merch_meijer' },
    { source: 'db_hassan_ali', target: 'bank_chase' },

    // 7. Ibrahim Mohammed (Houston) → BP, Chase, H-E-B, CenterPoint
    { source: 'db_ibrahim_mohammed', target: 'emp_bp' },
    { source: 'db_ibrahim_mohammed', target: 'bank_chase' },
    { source: 'db_ibrahim_mohammed', target: 'merch_heb' },
    { source: 'db_ibrahim_mohammed', target: 'util_centerpoint' },

    // 8. Khalid Rahman (London) → UCL, Santander, Tesco, Thames Water
    { source: 'db_khalid_rahman', target: 'emp_ucl' },
    { source: 'db_khalid_rahman', target: 'bank_santander' },
    { source: 'db_khalid_rahman', target: 'merch_tesco' },
    { source: 'db_khalid_rahman', target: 'util_thames_water' },

    // 9. Yusuf Ali (Minneapolis) → Target, Wells Fargo, Aldi, Xcel
    { source: 'db_yusuf_ali', target: 'emp_target' },
    { source: 'db_yusuf_ali', target: 'bank_wells_fargo' },
    { source: 'db_yusuf_ali', target: 'merch_aldi' },
    { source: 'db_yusuf_ali', target: 'util_xcel' },

    // 10. Saif Ahmad (Sydney) → Tyro Health, Woolworths, AGL, ANZ
    { source: 'db_saif_ahmad', target: 'emp_tyro' },
    { source: 'db_saif_ahmad', target: 'merch_woolworths' },
    { source: 'db_saif_ahmad', target: 'util_agl' },
    { source: 'db_saif_ahmad', target: 'bank_anz' },

    // 11. Fatima Hassan (Toronto) → Shoppers, RBC, Loblaws, Enbridge
    { source: 'db_fatima_hassan', target: 'emp_shoppers' },
    { source: 'db_fatima_hassan', target: 'bank_rbc' },
    { source: 'db_fatima_hassan', target: 'merch_loblaws' },
    { source: 'db_fatima_hassan', target: 'util_enbridge' },

    // 12. Muhammad Ali (Berlin) → SAP, Deutsche Bank, Lidl, Vattenfall
    { source: 'db_muhammad_ali', target: 'emp_sap' },
    { source: 'db_muhammad_ali', target: 'bank_deutsche' },
    { source: 'db_muhammad_ali', target: 'merch_lidl' },
    { source: 'db_muhammad_ali', target: 'util_vattenfall' },

    // 13. Abdullah Ibrahim (Ottawa) → Gov Canada, CIBC, Metro, Ottawa Hydro
    { source: 'db_abdullah_ibrahim', target: 'emp_govt_canada' },
    { source: 'db_abdullah_ibrahim', target: 'bank_cibc' },
    { source: 'db_abdullah_ibrahim', target: 'merch_metro' },
    { source: 'db_abdullah_ibrahim', target: 'util_ottawa_hydro' },

    // 14. Ayman Hassan (Manchester) → BBC, Asda, British Gas, HSBC
    { source: 'db_ayman_hassan', target: 'emp_bbc' },
    { source: 'db_ayman_hassan', target: 'merch_asda' },
    { source: 'db_ayman_hassan', target: 'util_british_gas' },
    { source: 'db_ayman_hassan', target: 'bank_hsbc' },

    // 15. Omar Hassan (Stockholm) → Spotify, ICA, Vattenfall, Nordea
    { source: 'db_omar_hassan', target: 'emp_spotify' },
    { source: 'db_omar_hassan', target: 'merch_ica' },
    { source: 'db_omar_hassan', target: 'util_vattenfall' },
    { source: 'db_omar_hassan', target: 'bank_nordea' },

    // 16. Khaled Yusuf (Paris) → BNP Paribas CIB, Carrefour, EDF, BNP
    { source: 'db_khaled_yusuf', target: 'emp_bnp_cib' },
    { source: 'db_khaled_yusuf', target: 'merch_carrefour' },
    { source: 'db_khaled_yusuf', target: 'util_edf' },
    { source: 'db_khaled_yusuf', target: 'bank_bnp' },

    // 17. Ismail Ahmed (Brooklyn) → SOM, Chase, ConEd, Costco
    { source: 'db_ismail_ahmed', target: 'emp_som' },
    { source: 'db_ismail_ahmed', target: 'bank_chase' },
    { source: 'db_ismail_ahmed', target: 'util_coned' },
    { source: 'db_ismail_ahmed', target: 'merch_costco' },

    // 18. Muhammad Yusuf (Dubai) → Accenture, Emirates NBD, DEWA, Carrefour AE
    { source: 'db_muhammad_yusuf', target: 'emp_accenture' },
    { source: 'db_muhammad_yusuf', target: 'bank_emirates_nbd' },
    { source: 'db_muhammad_yusuf', target: 'util_dewa' },
    { source: 'db_muhammad_yusuf', target: 'merch_carrefour_ae' },

    // 19. Noor Ahmad (Melbourne) → AECOM, ANZ, Coles, Origin
    { source: 'db_noor_ahmad', target: 'emp_aecom' },
    { source: 'db_noor_ahmad', target: 'bank_anz' },
    { source: 'db_noor_ahmad', target: 'merch_coles' },
    { source: 'db_noor_ahmad', target: 'util_origin' },

    // 20. Hassan Omar (London) → Deliveroo, Tesco, Thames Water, Monzo
    { source: 'db_hassan_omar', target: 'emp_deliveroo' },
    { source: 'db_hassan_omar', target: 'merch_tesco' },
    { source: 'db_hassan_omar', target: 'util_thames_water' },
    { source: 'db_hassan_omar', target: 'bank_monzo' },

    // ===================================================================
    // Watchlist entries → sanctioned counterparties
    // ===================================================================

    // Pakistan-linked
    { source: 'ofac_ahmad_khan', target: 'ofac_org_ttp' },
    { source: 'ofac_ahmad_khan', target: 'ofac_shell_pk_hawala' },
    { source: 'ofac_khalid_rahman', target: 'ofac_org_ttp' },
    { source: 'ofac_khalid_rahman', target: 'ofac_shell_pk_hawala' },
    { source: 'ofac_noor_ahmad', target: 'ofac_org_ttp' },
    { source: 'ofac_noor_ahmad', target: 'ofac_shell_pk_hawala' },

    // Yemen-linked
    { source: 'ofac_muhammad_hassan', target: 'ofac_org_aqap' },
    { source: 'ofac_muhammad_hassan', target: 'ofac_shell_yemen_trading' },
    { source: 'ofac_omar_ibrahim', target: 'ofac_org_aqap' },
    { source: 'ofac_omar_ibrahim', target: 'ofac_shell_yemen_trading' },
    { source: 'ofac_omar_hassan', target: 'ofac_org_aqap' },
    { source: 'ofac_omar_hassan', target: 'ofac_shell_yemen_trading' },
    { source: 'ofac_hassan_omar', target: 'ofac_org_aqap' },
    { source: 'ofac_hassan_omar', target: 'ofac_shell_yemen_trading' },

    // Iraq-linked
    { source: 'ofac_ali_ahmad', target: 'ofac_org_isis' },
    { source: 'ofac_ali_ahmad', target: 'ofac_shell_iraq_trading' },
    { source: 'ofac_abdullah_ibrahim', target: 'ofac_org_isis' },
    { source: 'ofac_abdullah_ibrahim', target: 'ofac_shell_iraq_trading' },
    { source: 'ofac_khaled_yusuf', target: 'ofac_org_isis' },
    { source: 'ofac_khaled_yusuf', target: 'ofac_shell_iraq_trading' },

    // Saudi-linked
    { source: 'ofac_abdullah_ahmed', target: 'ofac_org_aqap' },
    { source: 'ofac_abdullah_ahmed', target: 'ofac_shell_sa_front' },

    // Lebanon-linked
    { source: 'ofac_hassan_ali', target: 'ofac_org_hezbollah' },
    { source: 'ofac_hassan_ali', target: 'ofac_shell_southlebanon_a' },

    // Syria-linked
    { source: 'ofac_ibrahim_mohammed', target: 'ofac_shell_syria_trading' },
    { source: 'ofac_ibrahim_mohammed', target: 'ofac_shell_syria_logistics' },
    { source: 'ofac_fatima_hassan', target: 'ofac_shell_syria_trading' },
    { source: 'ofac_fatima_hassan', target: 'ofac_shell_syria_logistics' },

    // Somalia-linked
    { source: 'ofac_yusuf_ali', target: 'ofac_org_alshabaab' },
    { source: 'ofac_yusuf_ali', target: 'ofac_shell_somalia_trading' },
    { source: 'ofac_ismail_ahmed', target: 'ofac_org_alshabaab' },
    { source: 'ofac_ismail_ahmed', target: 'ofac_shell_somalia_trading' },

    // Egypt-linked
    { source: 'ofac_saif_ahmad', target: 'ofac_org_alqaeda' },
    { source: 'ofac_saif_ahmad', target: 'ofac_shell_egypt_front' },
    { source: 'ofac_ayman_hassan', target: 'ofac_org_alqaeda' },
    { source: 'ofac_ayman_hassan', target: 'ofac_shell_egypt_front' },

    // Afghanistan-linked
    { source: 'ofac_muhammad_ali_af', target: 'ofac_org_taliban' },
    { source: 'ofac_muhammad_ali_af', target: 'ofac_shell_af_hawala' },
    { source: 'ofac_muhammad_yusuf', target: 'ofac_org_taliban' },
    { source: 'ofac_muhammad_yusuf', target: 'ofac_shell_af_hawala' },

    // ===================================================================
    // Original watchlist entries → regional sanctioned counterparties
    // (ensures graph context is available when the sweep matches these)
    // ===================================================================
    { source: 'ofac_muhammad_ahmad', target: 'ofac_org_aqap' },
    { source: 'ofac_muhammad_ahmad', target: 'ofac_shell_yemen_trading' },
    { source: 'ofac_abdullah_mohammed', target: 'ofac_shell_sa_front' },
    { source: 'ofac_abdullah_mohammed', target: 'ofac_org_aqap' },
    { source: 'ofac_hassan_nasrallah', target: 'ofac_org_hezbollah' },
    { source: 'ofac_ayman_al_zawahiri', target: 'ofac_org_alqaeda' },
    { source: 'ofac_saif_al_adel', target: 'ofac_org_alqaeda' },
    { source: 'ofac_saif_al_adel', target: 'ofac_shell_egypt_front' },
    { source: 'ofac_ibrahim_hassan_synth', target: 'ofac_shell_syria_trading' },
    { source: 'ofac_khaled_al_ahmad_synth', target: 'ofac_org_isis' },
    { source: 'ofac_khaled_al_ahmad_synth', target: 'ofac_shell_iraq_trading' },
    { source: 'ofac_yusuf_mohammed_synth', target: 'ofac_org_alshabaab' },
    { source: 'ofac_yusuf_mohammed_synth', target: 'ofac_shell_somalia_trading' },
    { source: 'ofac_omar_al_sayyid_synth', target: 'ofac_org_aqap' },
    { source: 'ofac_omar_al_sayyid_synth', target: 'ofac_shell_yemen_trading' },
  ],
};
