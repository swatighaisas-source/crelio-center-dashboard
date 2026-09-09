import { useEffect, useMemo, useState } from "react";
import type { AoeAnswer, AoeCaptureFrequency } from "../../../data/aoeTypes";
import { getAoeFormForTest } from "../../../data/billTests";
import { useLabAoeConfig } from "../../../context/LabAoeConfigContext";
import {
  buildAoeInstanceQueue,
  formatSectionTitle,
  formatTestHeader,
  getInstanceLabel,
} from "../../../lib/aoe/aoeInstanceQueue";
import {
  buildAoeNavItems,
  getStepsForNavItem,
  type AoeNavItem,
} from "../../../lib/aoe/aoeNavItems";
import { orderServicesToLineItems } from "../../../lib/aoe/orderAoeAdapter";
import {
  getBillAoeAnswers,
  resolveStorageAnchor,
} from "../../../lib/aoe/aoeResponseStore";
import { ensureDemoOrderAoeAnswers } from "../../../lib/aoe/seedOrderAoeDemo";
import { isBillAoeComplete } from "../../../lib/aoe/aoeCompletion";
import type { Order } from "../../../data/inflow/mockOrders";

interface Props {
  labId: number;
  order: Order;
  open: boolean;
  onClose: () => void;
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden className="aoe-responses-nav__check">
      <circle cx="8" cy="8" r="7" fill="currentColor" opacity="0.15" />
      <path
        d="M5 8.2 7 10.2 11 6.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function isNavItemComplete(
  item: AoeNavItem,
  steps: ReturnType<typeof buildAoeInstanceQueue>,
  answers: AoeAnswer[],
  frequency: AoeCaptureFrequency,
  lineItems: ReturnType<typeof orderServicesToLineItems>,
): boolean {
  const instanceSteps = getStepsForNavItem(steps, item);
  const form = getAoeFormForTest(item.testId);
  if (!form) return false;

  const anchor = resolveStorageAnchor(
    item.lineItemId,
    item.instanceIndex,
    item.testId,
    lineItems,
    frequency,
  );

  for (const step of instanceSteps) {
    const section = form.sections[step.sectionIndex];
    if (!section) continue;
    for (const question of section.questions) {
      if (!question.required) continue;
      const value = answers.find(
        (answer) =>
          answer.lineItemId === anchor.lineItemId &&
          (answer.instanceIndex ?? 1) === anchor.instanceIndex &&
          answer.questionId === question.id,
      )?.value;
      if (!value?.trim()) return false;
    }
  }
  return instanceSteps.length > 0;
}

export function AoeResponsesModal({ labId, order, open, onClose }: Props) {
  const { captureFrequency } = useLabAoeConfig(labId);
  const billId = String(order.id);
  const lineItems = useMemo(() => orderServicesToLineItems(order.services), [order.services]);

  const steps = useMemo(
    () => buildAoeInstanceQueue(lineItems, captureFrequency),
    [lineItems, captureFrequency],
  );

  const navItems = useMemo(() => buildAoeNavItems(steps), [steps]);
  const [selectedNavId, setSelectedNavId] = useState<string>("");
  const [answers, setAnswers] = useState<AoeAnswer[]>([]);

  useEffect(() => {
    if (!open) return;
    ensureDemoOrderAoeAnswers(labId, billId, lineItems, captureFrequency);
    setAnswers(getBillAoeAnswers(labId, billId, lineItems));
  }, [open, labId, billId, lineItems, captureFrequency]);

  useEffect(() => {
    if (!open || navItems.length === 0) return;
    setSelectedNavId((current) =>
      navItems.some((item) => item.id === current) ? current : navItems[0].id,
    );
  }, [open, navItems]);

  const selectedNavItem = navItems.find((item) => item.id === selectedNavId) ?? navItems[0];
  const selectedForm = selectedNavItem
    ? getAoeFormForTest(selectedNavItem.testId)
    : undefined;

  const instanceLabel = selectedNavItem
    ? getInstanceLabel(selectedNavItem.instanceNumber, selectedNavItem.instanceTotal)
    : "";

  const storageAnchor = selectedNavItem
    ? resolveStorageAnchor(
        selectedNavItem.lineItemId,
        selectedNavItem.instanceIndex,
        selectedNavItem.testId,
        lineItems,
        captureFrequency,
      )
    : null;

  if (!open) return null;

  const headerTitle = selectedNavItem
    ? formatTestHeader(selectedNavItem.testName, instanceLabel)
    : "AOE Responses";

  return (
    <div className="aoe-responses-overlay" role="presentation" onClick={onClose}>
      <div
        className="aoe-responses-modal"
        role="dialog"
        aria-labelledby="aoe-responses-title"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="aoe-responses-modal__header">
          <h2 id="aoe-responses-title" className="aoe-responses-modal__title">
            AOE Responses
          </h2>
          <button
            type="button"
            className="aoe-responses-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <div className="aoe-responses-modal__body">
          <nav className="aoe-responses-nav" aria-label="AOE test instances">
            {navItems.map((item) => {
              const complete = isNavItemComplete(
                item,
                steps,
                answers,
                captureFrequency,
                lineItems,
              );
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`aoe-responses-nav__item${
                    item.id === selectedNavItem?.id ? " aoe-responses-nav__item--active" : ""
                  }`}
                  onClick={() => setSelectedNavId(item.id)}
                >
                  {complete ? <CheckIcon /> : <span className="aoe-responses-nav__bullet" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <main className="aoe-responses-main">
            {selectedNavItem && selectedForm && storageAnchor ? (
              <>
                <div className="aoe-test-header">
                  <span className="aoe-test-header__icon" aria-hidden>
                    🧪
                  </span>
                  <span>{headerTitle}</span>
                </div>
                <p className="aoe-test-description">{selectedForm.description}</p>

                {selectedForm.sections.map((section, sectionIndex) => (
                  <section key={section.id} className="aoe-responses-section">
                    <h3 className="aoe-section-form__title">
                      {formatSectionTitle(
                        selectedNavItem.testName,
                        instanceLabel,
                        sectionIndex + 1,
                      )}
                    </h3>
                    <div className="aoe-responses-fields">
                      {section.questions.map((question) => {
                        const value =
                          answers.find(
                            (answer) =>
                              answer.lineItemId === storageAnchor.lineItemId &&
                              (answer.instanceIndex ?? 1) === storageAnchor.instanceIndex &&
                              answer.questionId === question.id,
                          )?.value ?? "—";

                        return (
                          <div key={question.id} className="aoe-responses-field">
                            <span className="aoe-field__label">
                              {question.label}
                              {question.required ? (
                                <span className="aoe-field__required"> *</span>
                              ) : null}
                            </span>
                            {question.type === "textarea" ? (
                              <div className="aoe-responses-field__value aoe-responses-field__value--multiline">
                                {value}
                              </div>
                            ) : question.type === "signature" && value && value !== "—" ? (
                              <div className="aoe-signature__pad aoe-responses-signature" aria-hidden>
                                <svg viewBox="0 0 200 60" className="aoe-signature__stroke">
                                  <path
                                    d="M10,40 Q40,10 70,35 T130,25 T190,40"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  />
                                </svg>
                              </div>
                            ) : (
                              <div className="aoe-responses-field__value">{value}</div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </>
            ) : (
              <p className="aoe-empty">No AOE responses for this order.</p>
            )}
          </main>
        </div>

        <footer className="aoe-responses-modal__footer">
          <button type="button" className="aoe-btn aoe-btn--outline" onClick={onClose}>
            Close
          </button>
        </footer>
      </div>
    </div>
  );
}

export function orderShowsAoeComplete(
  labId: number,
  order: Order,
  frequency: AoeCaptureFrequency | ((testId: string) => AoeCaptureFrequency),
): boolean {
  const lineItems = orderServicesToLineItems(order.services);
  const answers = getBillAoeAnswers(labId, String(order.id), lineItems);
  return isBillAoeComplete(lineItems, frequency, answers);
}
