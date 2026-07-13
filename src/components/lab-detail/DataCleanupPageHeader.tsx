import { Link } from "react-router-dom";
import type { LabDetail } from "../../data/labDetails";

interface Props {
  lab: LabDetail;
}

export function DataCleanupPageHeader({ lab }: Props) {
  return (
    <header className="data-cleanup-header">
      <Link to={`/lab/${lab.id}`} className="data-cleanup-header__back" aria-label="Back to centre details">
        ←
      </Link>
      <h1 className="data-cleanup-header__title">
        #{lab.id} {lab.name}
      </h1>
    </header>
  );
}
