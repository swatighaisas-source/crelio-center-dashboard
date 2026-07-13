# CLIA Profiling POC — Spike Findings

Record results after testing with real CLIA numbers. This document is a template; fill in during validation.

## Environment

| Item | Value |
|------|--------|
| Test date | |
| Tester | |
| App URL | http://localhost:5173/clia-profiling |
| CMS dataset | [Provider of Services — Clinical Laboratories](https://data.cms.gov/provider-characteristics/hospitals-and-other-facilities/provider-of-services-file-clinical-laboratories) |
| Dataset UUID | `d3eb38ac-d8e9-40d3-b7b7-6205d3d1dc16` |

## Open questions

### 1. Does the CMS dataset expose specialty information per lab?

| Answer | Notes |
|--------|--------|
| Yes / No / Partial | |

List specialty-related column names observed:

```
(paste from Screen 2 — Raw response)
```

### 2. Are specialty fields available via API or only downloads?

| Answer | Notes |
|--------|--------|
| API / Download only / Both | |

### 3. Is CLIA number directly searchable?

| Answer | Notes |
|--------|--------|
| Yes / No | Filter field used: `PRVDR_NUM` |

Sample CLIA numbers tested:

| CLIA | Found? | Facility name |
|------|--------|---------------|
| | | |
| | | |

### 4. Can toxicology be reliably identified?

| Answer | Notes |
|--------|--------|
| Yes / No / Sometimes | LC 340 or label: |

### 5. Can reference labs be reliably identified?

| Answer | Notes |
|--------|--------|
| Yes / No | Heuristic (independent + volume) is low confidence |

### 6. Rate limits or access restrictions?

| Observation | Notes |
|-------------|--------|
| HTTP 429 after N requests | |
| Akamai / Access Denied | Use Vite proxy in dev |
| Max rows per request | Default 1000; up to 5000 with `size` |

## Sample lookups

| CLIA | Expected profile (manual) | POC profile | Confidence | Notes |
|------|---------------------------|-------------|------------|-------|
| | POL / Waiver | | | |
| | Hospital lab | | | |
| | Independent / reference | | | |
| | Toxicology | | | |
| | Molecular / genetics | | | |

## Recommendation

- [ ] Continue investment in CLIA-based profiling
- [ ] Use CLIA only for certificate type / address, keep NPI + manual for specialty
- [ ] Do not pursue — insufficient specialty signal

Summary (2–3 sentences):


