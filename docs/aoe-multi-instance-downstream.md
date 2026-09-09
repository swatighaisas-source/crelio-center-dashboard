# Multi-instance AOE — production downstream touchpoints

This prototype stores AOE answers keyed by **`billId + lineItemId + questionId`**. When integrating with the production LIMS backend, the following areas must accept and propagate `lineItemId` (bill test instance identity).

## Configuration

| Touchpoint | Change |
|------------|--------|
| Lab / organisation settings API | Expose `aoeCaptureFrequency`: `ONCE_PER_TEST` \| `ONCE_PER_TEST_INSTANCE` (default: `ONCE_PER_TEST`) |
| Registration settings UI | Already prototyped in Advance Settings |
| Server-side validation | Must run the same queue builder as the client; never trust client-only completion |

## Billing and orders

| Touchpoint | Change |
|------------|--------|
| Bill line item model | Stable `lineItemId` per row; preserved on reorder |
| Bill create / edit APIs | Return `lineItemId` for each test row |
| AOE response CRUD | Key answers by `lineItemId`, not `testId + questionId` |
| Bill AOE status endpoint | Aggregate mandatory completion across all required instances |
| Add duplicate test row | Create pending AOE instance only when `ONCE_PER_TEST_INSTANCE` |
| Remove test row | Delete/archive answers for that `lineItemId` only |
| Copy / rebill / clone | **Policy:** new line item IDs; do not copy AOE answers (reset pending state) |
| Bill cancellation | Archive or purge draft AOE answers for the bill |

## Quantity semantics (documented decision)

- **Each bill row = one test occurrence** for AOE purposes.
- **Qty is pricing/count only** and does **not** create additional AOE instances.
- Enforcement: `buildAoeInstanceQueue()` in `src/lib/aoe/aoeInstanceQueue.ts`.

## Result entry and operations

| Touchpoint | Change |
|------------|--------|
| Test worklists | Display AOE context per line item when duplicates exist |
| Result entry screens | Load AOE answers for the specific `lineItemId` |
| Sample / accession linkage | Map samples to `lineItemId` when multiple instances of same test exist |

## Integrations and exports

| Touchpoint | Change |
|------------|--------|
| LIS / HL7 outbound | Include `lineItemId` or equivalent placer group when sending orders |
| Print / PDF / report views | Show instance label `(Instance X of Y)` only when Y > 1 |
| Audit history | Log `lineItemId` on AOE create/update/delete events |

## Security and compatibility

| Touchpoint | Change |
|------------|--------|
| Role / permission checks | Apply existing AOE edit permissions per bill, scoped by line item |
| Historical bills | Lazy migration: legacy answers without `lineItemId` attach to first row for that `testId` |
| API contracts | See plan: `GET/PUT/DELETE /bills/{billId}/aoe-responses`, `GET /bills/{billId}/aoe-status` |

## Reference implementation (this repo)

| Module | Purpose |
|--------|---------|
| `src/data/aoeTypes.ts` | Types and `AoeCaptureFrequency` enum |
| `src/lib/aoe/aoeInstanceQueue.ts` | Instance queue and label formatting |
| `src/lib/aoe/aoeResponseStore.ts` | Persistence keyed by `lineItemId` |
| `src/lib/aoe/aoeValidation.ts` | Bill-level and instance-level validation |
| `src/components/registration/aoe/*` | AOE For Bill UI flow |
