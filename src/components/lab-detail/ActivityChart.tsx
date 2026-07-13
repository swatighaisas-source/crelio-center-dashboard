import { CHART_DATA } from "../../data/labDetails";

const W = 420;
const H = 130;
const PAD = { top: 12, right: 8, bottom: 24, left: 28 };
const MAX = 8;

export function ActivityChart() {
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const step = innerW / (CHART_DATA.length - 1);

  const toY = (v: number) => PAD.top + innerH - (v / MAX) * innerH;
  const toX = (i: number) => PAD.left + i * step;

  const billsPath = CHART_DATA.map((d, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(d.bills)}`).join(" ");
  const reportsPath = CHART_DATA.map((d, i) => `${i === 0 ? "M" : "L"}${toX(i)},${toY(d.reports)}`).join(" ");

  return (
    <svg className="activity-chart" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet">
      {[0, 2, 4, 6, 8].map((v) => (
        <g key={v}>
          <line
            x1={PAD.left}
            y1={toY(v)}
            x2={W - PAD.right}
            y2={toY(v)}
            stroke="#f0f0f0"
          />
          <text x={PAD.left - 6} y={toY(v) + 4} textAnchor="end" fontSize="9" fill="#999">
            {v}
          </text>
        </g>
      ))}
      <path d={billsPath} fill="none" stroke="#722ed1" strokeWidth="2" />
      <path d={reportsPath} fill="none" stroke="#52c41a" strokeWidth="2" />
      {CHART_DATA.map((d, i) => (
        <g key={d.day}>
          <circle cx={toX(i)} cy={toY(d.bills)} r="3" fill="#722ed1" />
          <circle cx={toX(i)} cy={toY(d.reports)} r="3" fill="#52c41a" />
          <text x={toX(i)} y={H - 6} textAnchor="middle" fontSize="9" fill="#999">
            {d.day}
          </text>
        </g>
      ))}
    </svg>
  );
}
