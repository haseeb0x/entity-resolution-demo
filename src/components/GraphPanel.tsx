// Static SVG visualization of the two-cluster network for Scenario 5.
//
// We hand-roll the layout instead of running a force simulation: the graph
// has only ~10 nodes arranged in two intentionally disjoint clusters, and
// deliberate positioning communicates the "no overlap" signal more clearly
// than a physics-based layout. This also keeps the bundle small.

import { graphData } from '@/data/graph-data';
import type { GraphResult } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  graphContext: GraphResult;
}

const FOCAL_CUSTOMER = 'cust_ali_hassan_montreal';
const FOCAL_WATCHLIST = 'ofac_ali_hassan_hezbollah';

interface Pos {
  x: number;
  y: number;
}

function buildLayout(): Record<string, Pos> {
  const positions: Record<string, Pos> = {};
  positions[FOCAL_CUSTOMER] = { x: 200, y: 220 };
  positions[FOCAL_WATCHLIST] = { x: 600, y: 220 };

  const customerNeighbors = graphData.edges
    .filter((e) => e.source === FOCAL_CUSTOMER || e.target === FOCAL_CUSTOMER)
    .map((e) => (e.source === FOCAL_CUSTOMER ? e.target : e.source));
  const watchlistNeighbors = graphData.edges
    .filter(
      (e) => e.source === FOCAL_WATCHLIST || e.target === FOCAL_WATCHLIST,
    )
    .map((e) => (e.source === FOCAL_WATCHLIST ? e.target : e.source));

  const radius = 130;
  customerNeighbors.forEach((id, i) => {
    const angle =
      Math.PI / 2 +
      (Math.PI * (i - (customerNeighbors.length - 1) / 2)) /
        customerNeighbors.length;
    positions[id] = {
      x: positions[FOCAL_CUSTOMER]!.x - Math.cos(angle - Math.PI) * radius,
      y: positions[FOCAL_CUSTOMER]!.y - Math.sin(angle - Math.PI) * radius,
    };
  });
  watchlistNeighbors.forEach((id, i) => {
    const angle =
      Math.PI / 2 +
      (Math.PI * (i - (watchlistNeighbors.length - 1) / 2)) /
        watchlistNeighbors.length;
    positions[id] = {
      x: positions[FOCAL_WATCHLIST]!.x + Math.cos(angle - Math.PI) * radius,
      y: positions[FOCAL_WATCHLIST]!.y - Math.sin(angle - Math.PI) * radius,
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

export function GraphPanel({ graphContext }: Props) {
  const positions = buildLayout();
  const sharedCount = graphContext.sharedNeighbors.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Network context</CardTitle>
        <p className="mt-1 text-sm text-stone-600">
          The customer and the sanctioned individual share name, birth year,
          and country — but their counterparty graphs are disjoint.
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <svg
            viewBox="0 0 800 440"
            role="img"
            aria-label="Network graph showing two disjoint clusters"
            className="mx-auto w-full max-w-[760px]"
          >
            {/* Cluster labels */}
            <text
              x={200}
              y={30}
              textAnchor="middle"
              className="fill-stone-700"
              fontSize={13}
              fontWeight={600}
            >
              Customer&apos;s network
            </text>
            <text
              x={600}
              y={30}
              textAnchor="middle"
              className="fill-stone-700"
              fontSize={13}
              fontWeight={600}
            >
              Sanctioned entity&apos;s network
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
            {graphData.edges.map((e, i) => {
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
            {graphData.nodes.map((n) => {
              const p = positions[n.id];
              if (!p) return null;
              const focal =
                n.id === FOCAL_CUSTOMER || n.id === FOCAL_WATCHLIST;
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
                    fontSize={focal ? 12 : 11}
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
        <p className="mt-4 text-sm text-stone-700">
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
      </CardContent>
    </Card>
  );
}
