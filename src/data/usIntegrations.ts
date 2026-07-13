// Source: livehealth.solutions/api-v3/integration/public/supported-integrations (snapshot 29 May 2026)
// US-tagged integrations prioritized

export interface USIntegration {
  id: number;
  name: string;
  category: string;
  region: string;
  summary: string;
}

export const US_INTEGRATION_CATEGORIES = [
  "EHR",
  "RCM",
  "LIS / HIS",
  "Middleware",
  "Lab Network",
  "Fax",
  "Eligibility",
  "Covid State Reporting",
  "Aggregators",
  "Clinical Tools",
  "Messaging platform",
  "Accounting tool",
  "POS devices and Payment Gateways",
  "Other",
] as const;

export type USIntegrationCategory = (typeof US_INTEGRATION_CATEGORIES)[number];

export const US_INTEGRATIONS: USIntegration[] = [
  // EHR (15 - all US)
  { id: 21, name: "AthenaHealth", category: "EHR", region: "US", summary: "Connect patient demographics, orders, and results with AthenaHealth EHR" },
  { id: 22, name: "Collaborate MD", category: "EHR", region: "US", summary: "Sync orders and results with Collaborate MD practice management" },
  { id: 23, name: "Cure MD", category: "EHR", region: "US", summary: "Automate lab order routing and result delivery with Cure MD" },
  { id: 24, name: "Dr Chrono", category: "EHR", region: "US", summary: "Integrate lab workflows with DrChrono for seamless result delivery" },
  { id: 25, name: "EClinical Works", category: "EHR", region: "US", summary: "Bidirectional interface with eClinicalWorks for orders and results" },
  { id: 26, name: "EmedOn", category: "EHR", region: "US", summary: "Connect with EmedOn for outpatient lab order management" },
  { id: 27, name: "Experity HealthCare", category: "EHR", region: "US", summary: "Integrate urgent-care workflows with Experity EHR" },
  { id: 28, name: "Gomeyra", category: "EHR", region: "US", summary: "Route lab orders and results through Gomeyra practice platform" },
  { id: 29, name: "Lifepoint", category: "EHR", region: "US", summary: "Share patient records and lab results with Lifepoint EHR" },
  { id: 30, name: "Nextgen HealthCare", category: "EHR", region: "US", summary: "Bi-directional integration with NextGen for ambulatory care labs" },
  { id: 31, name: "Prognocis", category: "EHR", region: "US", summary: "Streamline result delivery to Prognocis physician workflows" },
  { id: 32, name: "UDO Test Health", category: "EHR", region: "US", summary: "Connect lab results to UDO Test Health patient portal" },
  { id: 33, name: "eMedPractice", category: "EHR", region: "US", summary: "Automate order-to-result flow with eMedPractice" },
  { id: 34, name: "nAble MD", category: "EHR", region: "US", summary: "Deliver lab results directly into nAble MD physician dashboard" },
  { id: 35, name: "Tribeca Health Care", category: "EHR", region: "US", summary: "Connect with Tribeca Health Care for integrated diagnostic workflows" },

  // RCM (6 US)
  { id: 36, name: "Kareo", category: "RCM", region: "US", summary: "Automatically generate and submit claims to Kareo billing platform" },
  { id: 37, name: "Catalyst Billing", category: "RCM", region: "US", summary: "Streamline lab billing with Catalyst Billing integration" },
  { id: 38, name: "Health Recon Connect", category: "RCM", region: "US", summary: "Automate remittance posting and denial management" },
  { id: 39, name: "Advanced Data Systems Corp.", category: "RCM", region: "US", summary: "Connect with ADS for comprehensive revenue cycle management" },
  { id: 40, name: "PGM billing", category: "RCM", region: "US", summary: "Auto-generate and submit claims from LIMS to PGM billing" },
  { id: 41, name: "Phytest Billing", category: "RCM", region: "US", summary: "Route lab claims directly to Phytest Billing system" },

  // LIS / HIS (4 US)
  { id: 42, name: "Azalea Health", category: "LIS / HIS", region: "US", summary: "Bidirectional interface with Azalea Health HIS" },
  { id: 43, name: "Comp Pro Med", category: "LIS / HIS", region: "US", summary: "Connect with Comp Pro Med for multi-specialty lab workflows" },
  { id: 44, name: "Lumira Analyser", category: "LIS / HIS", region: "US", summary: "Integrate Lumira Analyser for advanced diagnostic data exchange" },
  { id: 45, name: "Precise-Q", category: "LIS / HIS", region: "US", summary: "Share lab results with Precise-Q HIS in real time" },

  // Middleware (2 US)
  { id: 46, name: "Ellkay", category: "Middleware", region: "US", summary: "Connect any EHR through Ellkay middleware for scalable interoperability" },
  { id: 47, name: "Labexchange", category: "Middleware", region: "US", summary: "Route lab orders and results through Labexchange middleware hub" },

  // Lab Network (3 US)
  { id: 48, name: "Clinical Pathology Laboratories", category: "Lab Network", region: "US", summary: "Send-out testing network integration with CPL" },
  { id: 49, name: "Tribal Diagnostics", category: "Lab Network", region: "US", summary: "Connect with Tribal Diagnostics for Native American health programs" },
  { id: 50, name: "Dynix Diagnostix", category: "Lab Network", region: "US", summary: "Expand test menu through Dynix Diagnostix network partnership" },

  // Covid State Reporting (6 US)
  { id: 1, name: "Illinois State", category: "Covid State Reporting", region: "US", summary: "Automatically share COVID patient results to Illinois state reporting system" },
  { id: 2, name: "California State", category: "Covid State Reporting", region: "US", summary: "Auto-report COVID results to California CDPH" },
  { id: 3, name: "Florida State", category: "Covid State Reporting", region: "US", summary: "Submit COVID case data to Florida Department of Health" },
  { id: 4, name: "Louisiana State", category: "Covid State Reporting", region: "US", summary: "Report COVID results to Louisiana state health department" },
  { id: 5, name: "Maryland State", category: "Covid State Reporting", region: "US", summary: "Auto-submit COVID cases to Maryland DoH reporting system" },
  { id: 6, name: "Texas State", category: "Covid State Reporting", region: "US", summary: "Share COVID testing results with Texas DSHS" },

  // Aggregators
  { id: 52, name: "1Health", category: "Aggregators", region: "US", summary: "Connect with 1Health aggregator for consumer lab ordering" },

  // Clinical Tools
  { id: 53, name: "Coriell Life Sciences", category: "Clinical Tools", region: "US", summary: "Pharmacogenomics testing integration with Coriell Life Sciences" },
  { id: 54, name: "Fabric Genomics", category: "Clinical Tools", region: "US", summary: "AI-powered genomic interpretation via Fabric Genomics" },
  { id: 55, name: "Gene by Gene", category: "Clinical Tools", region: "US", summary: "Ancestry and genetic testing integration with Gene by Gene" },
  { id: 56, name: "Medical Database", category: "Clinical Tools", region: "US", summary: "Access comprehensive clinical reference data via Medical Database" },

  // Messaging
  { id: 57, name: "Twilio", category: "Messaging platform", region: "US", summary: "Send SMS result notifications to patients via Twilio" },
  { id: 58, name: "AWS SNS", category: "Messaging platform", region: "US", summary: "Push lab event notifications through AWS SNS" },
  { id: 59, name: "Pinnacle", category: "Messaging platform", region: "US", summary: "Patient communication via Pinnacle messaging platform" },

  // Accounting
  { id: 60, name: "Xero", category: "Accounting tool", region: "US", summary: "Sync lab billing data with Xero accounting" },
  { id: 61, name: "Zoho Books", category: "Accounting tool", region: "US", summary: "Auto-post lab financials to Zoho Books" },

  // POS
  { id: 62, name: "Square", category: "POS devices and Payment Gateways", region: "US", summary: "Accept patient payments at the front desk via Square" },
  { id: 63, name: "Stripe", category: "POS devices and Payment Gateways", region: "US", summary: "Online patient payments and subscription billing via Stripe" },
];

export const US_EHR_INTEGRATIONS: USIntegration[] = US_INTEGRATIONS.filter(
  (i) => i.category === "EHR",
);

/** Fax providers — shown in dedicated section on integrations step */
export const US_FAX_INTEGRATIONS: USIntegration[] = [
  {
    id: 64,
    name: "Ring Central",
    category: "Fax",
    region: "US",
    summary: "Send and receive lab orders and results via RingCentral cloud fax",
  },
  {
    id: 65,
    name: "EtherFax",
    category: "Fax",
    region: "US",
    summary: "Securely fax lab results to physicians via EtherFax cloud platform",
  },
  {
    id: 66,
    name: "SRFAX",
    category: "Fax",
    region: "US",
    summary: "HIPAA-compliant faxing for orders and result delivery through SRFAX",
  },
];

/** Eligibility verification — shown in dedicated section on integrations step */
export const US_ELIGIBILITY_INTEGRATIONS: USIntegration[] = [
  {
    id: 67,
    name: "Waystar",
    category: "Eligibility",
    region: "US",
    summary: "Real-time insurance eligibility and benefits verification with Waystar",
  },
  {
    id: 68,
    name: "PVerify",
    category: "Eligibility",
    region: "US",
    summary: "Automate patient coverage checks and eligibility workflows with pVerify",
  },
];

export const US_DEDICATED_SECTION_INTEGRATIONS: USIntegration[] = [
  ...US_FAX_INTEGRATIONS,
  ...US_ELIGIBILITY_INTEGRATIONS,
];

const DEDICATED_INTEGRATION_NAMES = new Set(
  US_DEDICATED_SECTION_INTEGRATIONS.map((i) => i.name),
);

export const US_SEARCHABLE_INTEGRATIONS: USIntegration[] = US_INTEGRATIONS.filter(
  (i) => !DEDICATED_INTEGRATION_NAMES.has(i.name),
);

export const US_ALL_INTEGRATIONS: USIntegration[] = [
  ...US_INTEGRATIONS,
  ...US_DEDICATED_SECTION_INTEGRATIONS,
];

export function getIntegrationsByCategory(
  integrations: USIntegration[],
  category: string
): USIntegration[] {
  if (category === "All" || category === "Other") return integrations;
  return integrations.filter((i) => i.category === category);
}
