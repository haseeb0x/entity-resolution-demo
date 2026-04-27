import type { Customer } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  customer: Customer;
}

const formatAmount = (n?: number) =>
  n === undefined ? '—' : `$${n.toLocaleString('en-US')}`;

export function TransactionContext({ customer }: Props) {
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-baseline justify-between">
          <p className="text-xs uppercase tracking-wide text-stone-500">
            Synthetic customer record
          </p>
          <p className="text-xs text-stone-500">for demonstration only</p>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
          {customer.employer && (
            <Field label="Employer" value={customer.employer} />
          )}
        </div>
        <div className="mt-5 border-t border-soft pt-4">
          <p className="text-xs uppercase tracking-wide text-stone-500">
            Transaction
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
