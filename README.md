# CrelioHealth Centre Dashboard

Local replica of the Centre Dashboard **Onboarding → On-going** view for UI development and flow prototyping.

## Task Manager Inflow (merged)

The [task-manager-end-to-end-flow](https://github.com/HusainLiveHealth/task-manager-end-to-end-flow) prototype is merged into this repo:

- **Engine:** `src/context/InflowContext.tsx`, `src/data/inflow/`, `src/lib/inflow/`
- **Screens:** Order History, Sample List, Waiting List, Pending Collection under module routes
- **Inbox:** Live actions/notifications on `/lab/:id/actions` and `/lab/:id/notifications`
- **Admin:** Rollout Configuration at `/lab/:id/center/rollout-config`

See `docs/inflow-merge-inventory.md` for the file mapping.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build
npm run preview
```

## Create Centre

Click **Create Centre** in the top nav to open a **full-page** flow:

1. **Benefits overview** (`/create-centre`) — CrelioHealth benefits + 15-min onboarding, **Get Started**
2. **Tell us who you are** — step 2/4
3. **Tell Us About Your Business** — step 3/4 (services checkboxes, **Create Account**)
4. **Account ready** — step 4/4 (success + **Login**)
5. **Setup Your Diagnostic Center** — step 1/5 (configuration type)
6. **Select Report Template** — step 2/5 (templates, letterhead yes/no)
7. **Upload Letterheads** — step 3/5 (if letterhead = Yes)
8. **Enter your Signing Dr. Details** — step 4/5
9. Select laboratory type → centre details → lab details (optional GST/PAN)
3. Success → optional setup checklist (tests, pricing, staff, reports)

The new centre is added to the onboarding table after lab details. Stats update automatically.

## CLIA Profiling POC

Exploratory spike to validate CMS CLIA data for lab onboarding profiles. **Not wired to production onboarding.**

1. Run `npm run dev` and open [http://localhost:5173/clia-profiling](http://localhost:5173/clia-profiling) (or use **CLIA POC** in the top nav).
2. Enter a CLIA certificate number and click **Fetch Data**.
3. Review raw JSON, detected signals, and suggested lab profile.

Data source: [CMS Provider of Services File — Clinical Laboratories](https://data.cms.gov/provider-characteristics/hospitals-and-other-facilities/provider-of-services-file-clinical-laboratories) via `data.cms.gov` API (dataset `d3eb38ac-d8e9-40d3-b7b7-6205d3d1dc16`). Dev server proxies `/api/cms` → `data.cms.gov` to reduce CORS / edge blocks.

Record spike outcomes in [`docs/clia-poc-findings.md`](docs/clia-poc-findings.md).

## Navigation

- **Dashboard** (`/`) — onboarding grid; click any row to open that lab.
- **CLIA Profiling POC** (`/clia-profiling`) — CMS CLIA lookup spike
- **Lab detail** (`/lab/:id`) — opens **Centre Details** by default.
- **Plan Details** (`/lab/:id/plan`)
- **Configurations** (`/lab/:id/configurations`)

## Structure

- `src/pages/` — dashboard and lab detail routes
- `src/components/lab-detail/` — header, tabs, and tab content
- `src/data/` — list rows and per-lab detail data
- `src/styles/` — dashboard and lab-detail CSS

Share additional screens or flows to extend this app.
