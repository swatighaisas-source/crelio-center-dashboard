import type { BillLineItem } from "../../data/aoeTypes";
import type { Order, ServiceLine } from "../../data/inflow/mockOrders";
import { findCatalogTest } from "../../data/billTests";

const SERVICE_TEST_IDS: Record<string, string> = {
  Ammonia: "test-ammonia",
  "Dengue NS1": "test-dengue-ns1",
};

function resolveTestId(service: ServiceLine): string | undefined {
  if (service.testId) return service.testId;
  const byName = SERVICE_TEST_IDS[service.name];
  if (byName) return byName;
  if (service.code.includes("BIOC012")) return "test-ammonia";
  if (service.code.includes("SERO045")) return "test-dengue-ns1";
  return undefined;
}

/** Map order service lines to bill line items for AOE queue/responses. */
export function orderServicesToLineItems(services: ServiceLine[]): BillLineItem[] {
  return services.map((service, sortIndex) => {
    const testId = resolveTestId(service);
    const catalog = testId ? findCatalogTest(testId) : undefined;
    const hasAoe = service.hasAoe ?? catalog?.hasAoe ?? false;

    return {
      id: service.id,
      testId: testId ?? service.id,
      testName: service.name,
      testCode: service.code,
      qty: Math.max(1, service.qty ?? 1),
      price: service.price,
      concession: service.concession,
      hasAoe,
      sortIndex,
    };
  });
}

export function orderHasAoeServices(services: ServiceLine[]): boolean {
  return orderServicesToLineItems(services).some((item) => item.hasAoe);
}

function formatOrderDate(date = new Date()): string {
  const day = date.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";
  const month = date.toLocaleString("en-GB", { month: "short" });
  const year = date.getFullYear();
  const time = date
    .toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })
    .toLowerCase();
  return `${day}${suffix} ${month}, ${year} ${time}`;
}

/** Build an Order History row from a confirmed registration bill. */
export function buildOrderFromBillLineItems(input: {
  orderId: number;
  lineItems: BillLineItem[];
  patientName: string;
  patientMeta: string;
  provider: string;
  source: string;
  account: string;
}): Order {
  const amount = input.lineItems.reduce(
    (sum, item) => sum + item.price * item.qty - item.concession,
    0,
  );
  const orderDate = formatOrderDate();

  return {
    id: input.orderId,
    patient: input.patientName,
    patientMeta: input.patientMeta,
    provider: input.provider,
    source: input.source,
    account: input.account,
    orderDate,
    sampleDate: orderDate,
    amount,
    due: amount,
    status: "Pending",
    orderNumber: `IpId-${input.orderId}`,
    comments: "Created from Registration Bill Patient.",
    services: input.lineItems.map((item) => ({
      // Keep bill line item ids so saved AOE answers resolve correctly.
      id: item.id,
      name: item.testName,
      code: item.testCode,
      testId: item.testId,
      qty: item.qty,
      hasAoe: item.hasAoe,
      status: "Not Collected" as const,
      price: item.price,
      concession: item.concession,
    })),
    bills: [
      {
        id: input.orderId,
        date: orderDate,
        source: input.source,
        paid: false,
      },
    ],
    paymentHistory: [],
    exceptions: { active: [], activity: [] },
  };
}

export function nextOrderId(existingOrders: { id: number }[]): number {
  const maxId = existingOrders.reduce((max, order) => Math.max(max, order.id), 922639);
  return maxId + 1;
}
