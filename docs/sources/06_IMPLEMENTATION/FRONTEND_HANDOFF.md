# Frontend Handoff Contract — IDHN

## Direction
- Root app: `dir="rtl"`, Arabic-first.
- English technical fragments use `dir="ltr"` locally.
- Do not flip icons that have semantic direction unless intended.

## Core demo states
`idle → uploading → analyzing → result`
Result variants: `no-match | authorized | needs-review | unauthorized | error`.

## Verification result hierarchy
1. Uploaded image / source.
2. Best registered reference candidate.
3. Similarity score (label as similarity, not theft probability).
4. Registry metadata.
5. Authorization status.
6. Decision + reason + next action.
7. Optional technical inspector: API JSON / model trace.

## AI boundary copy
Preferred phrasing: “تشابه بصري” / “مرجع مطابق محتمل” / “بحاجة إلى مراجعة”.
Avoid: “سرقة مؤكدة” / “نسبة السرقة” / “الذكاء الاصطناعي أثبت التعدي”.

## Suggested component primitives
- `VerificationCanvas`
- `EvidencePair`
- `VerificationTrace`
- `RegistryRecord`
- `AuthorizationNode`
- `DecisionState`
- `TechnicalInspector`
- `ContextPanel`

Build them as flexible primitives, not a universal card template.
