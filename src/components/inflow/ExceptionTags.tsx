import type { PropagatedExceptions } from "../../data/inflow/exceptionTypes";
import { exceptionLabels } from "../../data/inflow/mockOrders";

type Props = {
  exceptions: PropagatedExceptions;
};

export function ExceptionTags({ exceptions }: Props) {
  const directKeys = exceptions.directActive.map((exception) => exception.exceptionKey);
  const inheritedKeys = exceptions.inheritedActive
    .map((exception) => exception.exceptionKey)
    .filter((key) => !directKeys.includes(key));
  const relatedCount = exceptions.relatedActive.length;

  if (!directKeys.length && !inheritedKeys.length && !relatedCount) {
    return null;
  }

  return (
    <div className="list-exception-tags">
      {directKeys.map((key) => (
        <span className="list-exception-tag direct" key={`direct-${key}`}>
          {exceptionLabels[key]}
        </span>
      ))}
      {inheritedKeys.map((key) => (
        <span className="list-exception-tag inherited" key={`inherited-${key}`}>
          {exceptionLabels[key]}
        </span>
      ))}
      {relatedCount ? (
        <span className="list-exception-tag related">
          {relatedCount === 1 ? "Related Exception" : `${relatedCount} Related Exceptions`}
        </span>
      ) : null}
    </div>
  );
}
