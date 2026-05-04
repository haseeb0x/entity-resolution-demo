import type { Customer } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  customer: Customer;
}

const formatAmount = (n?: number) =>
  n === undefined ? '—' : `$${n.toLocaleString('en-US')}`;

// Map employer IDs to display names for customers that have string IDs.
const employerLabels: Record<string, string> = {
  emp_shopify: 'Shopify Inc.',
  emp_dearborn_schools: 'Dearborn Public Schools',
  emp_nhs: 'NHS Trust',
  emp_jpmorgan: 'JPMorgan Chase',
  emp_pwc: 'PwC',
  emp_ford: 'Ford Motor Company',
  emp_bp: 'BP',
  emp_ucl: 'University College London',
  emp_target: 'Target Corporation',
  emp_own_practice: 'Own practice',
  emp_shoppers: 'Shoppers Drug Mart',
  emp_sap: 'SAP SE',
  emp_govt_canada: 'Government of Canada',
  emp_bbc: 'BBC',
  emp_spotify: 'Spotify AB',
  emp_bnp_cib: 'BNP Paribas CIB',
  emp_som: 'Skidmore, Owings & Merrill',
  emp_accenture: 'Accenture',
  emp_aecom: 'AECOM',
  emp_kings_college: "King's College Hospital",
  emp_tyro: 'Tyro Health',
};

function resolveEmployer(employer?: string): string | undefined {
  if (!employer) return undefined;
  return employerLabels[employer] ?? employer;
}

export function TransactionContext({ customer }: Props) {
  const hasProfileFields =
    customer.occupation || customer.city || customer.kycVerification;

  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-baseline justify-between">
          <p className="text-xs uppercase tracking-wide text-stone-500">
            Customer record
          </p>
          <p className="text-xs text-stone-500">synthetic · for demonstration only</p>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field label="Name" value={customer.fullName} />
          <Field label="DOB" value={customer.dob ?? '—'} />
          <Field label="Country" value={customer.country} />
          <Field
            label="Entity type"
            value={customer.entityType.replace('_', ' ')}
          />
          {customer.passportNumber && (
            <Field label="Passport" value={customer.passportNumber} />
          )}
          {customer.occupation && (
            <Field label="Occupation" value={customer.occupation} />
          )}
          {customer.city && <Field label="City" value={customer.city} />}
          {resolveEmployer(customer.employer) && (
            <Field label="Employer" value={resolveEmployer(customer.employer)!} />
          )}
        </div>

        {hasProfileFields && (
          <div className="mt-4 grid grid-cols-2 gap-4 border-t border-soft pt-4 sm:grid-cols-3">
            {customer.kycVerification && (
              <Field label="KYC verification" value={customer.kycVerification} />
            )}
            {customer.accountAge && (
              <Field label="Account age" value={customer.accountAge} />
            )}
            {customer.nationality && customer.nationality !== customer.country && (
              <Field label="Nationality" value={customer.nationality} />
            )}
          </div>
        )}

        <div className="mt-4 border-t border-soft pt-4">
          <p className="text-xs uppercase tracking-wide text-stone-500">
            Recent transaction
          </p>
          <p className="mt-1 text-stone-800">
            {customer.transactionDescription}
            {customer.transactionAmount !== undefined && (
              <span className="ml-2 text-stone-500">
                · {formatAmount(customer.transactionAmount)}
              </span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-stone-500">{label}</p>
      <p className="mt-0.5 font-medium text-stone-900">{value}</p>
    </div>
  );
}
