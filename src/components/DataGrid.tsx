import type { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useLabs } from "../context/LabsContext";
import type { LabRow } from "../data/labs";
import { formatMrr, formatModalitiesList, npsTone } from "../data/labs";
import { computeLabsSummary, lifecycleDisplayLabel } from "../data/labLifecycle";
import type { LabDetail } from "../data/labDetails";
import { ColumnMenuIcon } from "./Icons";

function resolveListFields(row: LabRow, detail?: LabDetail) {
  const nps =
    detail?.feedbackHistory?.[0]?.nps ??
    (row.nps !== undefined && row.nps !== null ? row.nps : null);
  const labType =
    detail?.onboardingSnapshot?.labType?.trim() || row.labType?.trim() || "—";
  const modalities =
    (detail?.onboardingSnapshot?.modalities?.length ?? 0) > 0
      ? detail!.onboardingSnapshot.modalities
      : (row.modalities ?? []);
  return { nps, labType, modalities };
}

function NpsBadge({ score }: { score: number }) {
  const tone = npsTone(score);
  return (
    <span className={`grid-nps grid-nps--${tone}`} title={`NPS ${score}/10`}>
      {score}
      <span className="grid-nps__max">/10</span>
    </span>
  );
}

interface DataGridProps {
  labs: LabRow[];
  /** Show lifecycle state column when viewing all labs (e.g. Integrations tab) */
  showLifecycleColumn?: boolean;
}

export function DataGrid({ labs, showLifecycleColumn = false }: DataGridProps) {
  const navigate = useNavigate();
  const { summary: globalSummary, getLabDetail } = useLabs();
  const summary = showLifecycleColumn ? globalSummary : computeLabsSummary(labs);

  const columns = [
    { key: "checkbox", label: "", className: "col-checkbox" },
    { key: "id", label: "Lab Id", className: "col-lab-id" },
    { key: "name", label: "Lab Name", className: "col-lab-name" },
    ...(showLifecycleColumn
      ? [{ key: "lifecycle", label: "State", className: "col-lifecycle" } as const]
      : []),
    { key: "nps", label: "NPS Score", className: "col-nps" },
    { key: "labType", label: "Lab Type", className: "col-lab-type" },
    { key: "modalities", label: "Modalities", className: "col-modalities" },
    { key: "planned", label: "Planned Live Date", className: "col-planned-date" },
    { key: "days", label: "Days", className: "col-days" },
    { key: "plan", label: "Plan Type", className: "col-plan-type" },
    { key: "currency", label: "Currency", className: "col-currency" },
    {
      key: "mrr",
      label: `MRR (₹ ${summary.totalMrrInr.toLocaleString("en-IN")} / $ ${summary.totalMrrUsd.toLocaleString("en-US")})`,
      className: "col-mrr",
    },
    { key: "manager", label: "Account Manager", className: "col-manager" },
  ] as const;

  const openLab = (id: number) => {
    navigate(`/lab/${id}`);
  };

  const stopNav = (e: MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="grid-container">
      <div className="row-group-bar">Drag here to set row groups</div>
      <div className="data-grid">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={col.className}>
                  {col.key === "checkbox" ? (
                    <input
                      type="checkbox"
                      aria-label="Select all rows"
                      onClick={stopNav}
                    />
                  ) : (
                    <span className="th-inner">
                      <span>{col.label}</span>
                      <ColumnMenuIcon />
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {labs.map((row) => {
              const detail = getLabDetail(row.id);
              const { nps, labType, modalities } = resolveListFields(row, detail);
              const modalitiesLabel = formatModalitiesList(modalities);

              return (
                <tr
                  key={row.id}
                  className="data-grid__row--clickable"
                  onClick={() => openLab(row.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openLab(row.id);
                    }
                  }}
                  tabIndex={0}
                  role="link"
                  aria-label={`Open ${row.name}`}
                >
                  <td className="col-checkbox" onClick={stopNav}>
                    <input
                      type="checkbox"
                      aria-label={`Select lab ${row.id}`}
                      onClick={stopNav}
                    />
                  </td>
                  <td className="col-lab-id">{row.id}</td>
                  <td className="col-lab-name">{row.name}</td>
                  {showLifecycleColumn && (
                    <td className="col-lifecycle">
                      <span
                        className={`grid-lifecycle grid-lifecycle--${row.lifecycleState}`}
                      >
                        {lifecycleDisplayLabel(row.lifecycleState)}
                      </span>
                    </td>
                  )}
                  <td className="col-nps">
                    {nps !== null ? (
                      <NpsBadge score={nps} />
                    ) : (
                      <span className="grid-nps grid-nps--empty">—</span>
                    )}
                  </td>
                  <td className="col-lab-type" title={labType}>
                    {labType}
                  </td>
                  <td className="col-modalities" title={modalities.join(", ") || undefined}>
                    {modalitiesLabel}
                  </td>
                  <td className="col-planned-date">
                    {row.plannedLiveDate}{" "}
                    <span
                      className={
                        row.plannedLiveStatus === "future"
                          ? "planned-date__note--future"
                          : "planned-date__note--past"
                      }
                    >
                      ({row.plannedLiveNote})
                    </span>
                  </td>
                  <td className="col-days">{row.days}</td>
                  <td className="col-plan-type">{row.planType}</td>
                  <td className="col-currency">₹</td>
                  <td className="col-mrr">{formatMrr(row.mrr)}</td>
                  <td className="col-manager">{row.accountManager}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
