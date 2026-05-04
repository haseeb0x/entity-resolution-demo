// Dynamic SVG visualization of the two-cluster network.
//
// Accepts any customer × watchlist pair and extracts the relevant subgraph
// from graphData, then lays it out in the same two-column style as the
// original Scenario 5 visualization. This generalizes across all 20 customer
// database profiles and the fixed Scenario 5.

import { graphData } from '@/data/graph-data';
import type { GraphResult } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  graphContext: GraphResult;
  customerId?: string;
  watchlistEntryId?: string;
  customerLabel?: string;
  watchlistLabel?: string;
}

interface Pos {
  x: number;
  y: number;
}

// Defaults for backward compatibility with Scenario 5.
const DEFAULT_CUSTOMER = 'cust_ali_hassan_montreal';
const DEFAULT_WATCHLIST = 'ofac_ali_hassan_hezbollah';

function getNeighborIds(focalId: string): string[] {
  const out: string[] = [];
  for (const e of graphData.edges) {
    if (e.source === focalId) out.push(e.target);
    else if (e.target === focalId) out.push(e.source);
  }
  return out;
}

function buildLayout(
  focalCustomer: string,
  focalWatchlist: string,
): Record<string, Pos> {
  const positions: Record<string, Pos> = {};
  positions[focalCustomer] = { x: 200, y: 220 };
  positions[focalWatchlist] = { x: 600, y: 220 };

  const customerNeighbors = getNeighborIds(focalCustomer);
  const watchlistNeighbors = getNeighborIds(focalWatchlist);

  const radius = 130;
  customerNeighbors.forEach((id, i) => {
    const angle =
      Math.PI / 2 +
      (Math.PI * (i - (customerNeighbors.length - 1) / 2)) /
        Math.max(customerNeighbors.length, 1);
    positions[id] = {
      x: positions[focalCustomer]!.x - Math.cos(angle - Math.PI) * radius,
      y: positions[focalCustomer]!.y - Math.sin(angle - Math.PI) * radius,
    };
  });
  watchlistNeighbors.forEach((id, i) => {
    const angle =
      Math.PI / 2 +
      (Math.PI * (i - (watchlistNeighbors.length - 1) / 2)) /
        Math.max(watchlistNeighbors.length, 1);
    positions[id] = {
      x: positions[focalWatchlist]!.x + Math.cos(angle - Math.PI) * radius,
      y: positions[focalWatchlist]!.y - Math.sin(angle - Math.PI) * radius,
    };
  });

  return positions;
}

const COLORS = {
  customer: '#1C1917',
  'customer-neighbor': '#57534E',
  watchlist: '#B91C1C',
  'watchlist-neighbor': '#9F1239',
};

export function GraphPanel({
  graphContext,
  customerId,
  watchlistEntryId,
  customerLabel,
  watchlistLabel,
}: Props) {
  const focalCustomer = customerId ?? DEFAULT_CUSTOMER;
  const focalWatchlist = watchlistEntryId ?? DEFAULT_WATCHLIST;
  const positions = buildLayout(focalCustomer, focalWatchlist);
  const sharedCount = graphContext.sharedNeighbors.length;

  // Build the subgraph: only edges/nodes relevant to these two focal nodes.
  const relevantNodeIds = new Set(Object.keys(positions));
  const relevantEdges = graphData.edges.filter(
    (e) => relevantNodeIds.has(e.source) && relevantNodeIds.has(e.target),
  );
  const relevantNodes = graphData.nodes.filter((n) => relevantNodeIds.has(n.id));

  const leftLabel = customerLabel ?? 'Customer\'s network';
  const rightLabel = watchlistLabel ?? 'Sanctioned entity\'s network';

  return (
    <Card>
      <CardHeader>
        <CardTitle>Network context</CardTitle>
        <p className="mt-1 text-sm text-stone-600">
          Transaction counterparties and connected entities for each side.
          The customer&apos;s graph is built from employer payroll, retail
          purchases, utility payments, and verified KYC — the data a financial
          institution accumulates over time.
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <svg
            viewBox="0 0 800 440"
            role="img"
            aria-label="Network graph showing two clusters of counterparties"
            className="mx-auto w-full max-w-[760px]"
          >
            {/* Cluster labels */}
            <text
              x={200}
              y={30}
              textAnchor="middle"
              className="fill-stone-700"
              fontSize={12}
              fontWeight={600}
            >
              {leftLabel.length > 28
                ? leftLabel.slice(0, 26) + '…'
                : leftLabel}
            </text>
            <text
              x={600}
              y={30}
              textAnchor="middle"
              className="fill-stone-700"
              fontSize={12}
              fontWeight={600}
            >
              {rightLabel.length > 28
                ? rightLabel.slice(0, 26) + '…'
                : rightLabel}
            </text>
            {/* Cluster background tint */}
            <rect
              x={20}
              y={50}
              width={360}
              height={370}
              fill="#F5F5F4"
              rx={8}
            />
            <rect
              x={420}
              y={50}
              width={360}
              height={370}
              fill="#FEF2F2"
              rx={8}
            />
            {/* Edges */}
            {relevantEdges.map((e, i) => {
              const a = positions[e.source];
              const b = positions[e.target];
              if (!a || !b) return null;
              return (
                <line
                  key={i}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  stroke="#A8A29E"
                  strokeWidth={1.25}
                />
              );
            })}
            {/* Nodes */}
            {relevantNodes.map((n) => {
              const p = positions[n.id];
              if (!p) return null;
              const focal =
                n.id === focalCustomer || n.id === focalWatchlist;
              const r = focal ? 11 : 7;
              const fill = COLORS[n.group as keyof typeof COLORS] ?? '#57534E';
              const labelOffset = focal ? 22 : 16;
              return (
                <g key={n.id}>
                  <circle cx={p.x} cy={p.y} r={r} fill={fill} />
                  <text
                    x={p.x}
                    y={p.y + labelOffset}
                    textAnchor="middle"
                    fontSize={focal ? 12 : 10}
                    fontWeight={focal ? 600 : 400}
                    className="fill-stone-700"
                  >
                    {n.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="mt-4 space-y-2">
          <p className="text-sm text-stone-700">
            Shared neighbors: <span className="font-semibold">{sharedCount}</span>
            {'.  '}Graph contribution to log-odds:{' '}
            <span
              className={`mono ${graphContext.contextScore >= 0 ? 'text-clear' : 'text-flag'}`}
            >
              {graphContext.contextScore >= 0 ? '+' : ''}
              {graphContext.contextScore.toFixed(2)}
            </span>
            .
          </p>
          <p className="text-xs text-stone-500">
            This graph grows over time as the financial institution receives more
            transactions with this entity as a counterparty. More edges strengthen
            the disambiguation signal.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
