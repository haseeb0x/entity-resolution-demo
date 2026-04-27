// Synthetic customer records used for demonstration only. No real persons
// are described here. The transactions are illustrative and benign.

import type { Customer } from '@/types';

export const customers: Customer[] = [
  // Scenario 1 — Common name collision.
  // A Toronto-based software engineer who happens to share a very common
  // Arabic given-name pair with a sanctioned individual in Yemen.
  {
    id: 'cust_muhammad_toronto',
    fullName: 'Muhammad Ahmad Al-Rashidi',
    givenNames: ['Muhammad', 'Ahmad'],
    familyName: 'Al-Rashidi',
    dob: '1985-03-15',
    country: 'CA',
    nationality: 'CA',
    entityType: 'natural_person',
    isSynthetic: true,
    transactionDescription: 'Salary deposit from Shopify Inc. (Toronto)',
    transactionAmount: 7250,
    counterparties: ['emp_shopify', 'merch_loblaws', 'util_hydro_quebec'],
    employer: 'emp_shopify',
    geography: ['Toronto', 'Ontario'],
  },

  // Scenario 2 — Vessel-vs-person.
  // A Mexican retail customer named Carmela whose given name collides with
  // an Iranian-flagged sanctioned vessel.
  {
    id: 'cust_carmela_hernandez',
    fullName: 'Carmela Hernandez',
    givenNames: ['Carmela'],
    familyName: 'Hernandez',
    dob: '1990-07-22',
    country: 'MX',
    nationality: 'MX',
    entityType: 'natural_person',
    isSynthetic: true,
    transactionDescription: 'Card payment to Mercado Libre (Mexico City)',
    transactionAmount: 480,
  },

  // Scenario 3 — Transliteration variants.
  // A Saudi customer whose ID is romanized as "Abdallah Muhammad" — the
  // same Arabic name as the watchlist entry "Abdullah Mohammed", written
  // with a different English transliteration. The patronymic is stored in
  // the family-name slot, which is how most KYC forms capture it when
  // there's no separate family name.
  {
    id: 'cust_abdallah_riyadh',
    fullName: 'Abdallah bin Muhammad',
    givenNames: ['Abdallah'],
    familyName: 'Muhammad',
    arabicName: 'عبدالله بن محمد',
    dob: '1980',
    country: 'SA',
    nationality: 'SA',
    entityType: 'natural_person',
    isSynthetic: true,
    transactionDescription: 'International wire from Riyadh',
    transactionAmount: 12500,
  },

  // Scenario 4 — True positive.
  // A "customer" record that is, in effect, a duplicate of the listed
  // entity (Yevgeny Prigozhin). Demonstrates the entity-resolution system
  // catches genuine matches, not just dismisses noise.
  {
    id: 'cust_prigozhin_dup',
    fullName: 'Yevgeny V. Prigozhin',
    givenNames: ['Yevgeny', 'Viktorovich'],
    familyName: 'Prigozhin',
    dob: '1961-06-01',
    country: 'RU',
    nationality: 'RU',
    entityType: 'natural_person',
    passportNumber: '722314822',
    isSynthetic: true,
    transactionDescription: 'Outbound wire to Concord Management & Consulting',
    transactionAmount: 1500000,
  },

  // Scenario 5 — Graph disambiguation.
  // A Lebanese-Canadian software engineer with the same name and birth
  // year as a Hezbollah-linked individual. The two share the name + DOB
  // + country, but their counterparty networks are entirely disjoint.
  {
    id: 'cust_ali_hassan_montreal',
    fullName: 'Ali Hassan',
    givenNames: ['Ali'],
    familyName: 'Hassan',
    dob: '1978',
    country: 'LB',
    nationality: 'CA',
    entityType: 'natural_person',
    isSynthetic: true,
    transactionDescription: 'Salary deposit from Shopify Inc. (Montreal)',
    transactionAmount: 6800,
    counterparties: [
      'emp_shopify',
      'merch_loblaws',
      'util_hydro_quebec',
      'merch_bell_canada',
    ],
    employer: 'emp_shopify',
    geography: ['Montreal', 'Quebec'],
  },
];

export function findCustomer(id: string): Customer | undefined {
  return customers.find((c) => c.id === id);
}
