# إذن | IDHN
## Signature Visual Language & Anti-Template Closure
**Version:** 1.0  
**Date:** 2026-11-26  
**Status:** Canonical visual implementation reference  
**Scope:** Visual grammar, composition rules, interaction language, responsive behavior, and anti-template constraints for frontend implementation.

---

# 0. Binding project references

This document must be interpreted together with the approved project sources, especially:

- `LegalTech_Creative_UI_Direction_and_Design_Rules_v1`
- `IDHN_Production_Product_Architecture_and_User_Flow_v1.0`
- `IDHN_Sitemap_and_Full_Product_Flow_v1.0`
- `IDHN_Complete_Screen_Inventory_and_Mock_Contract_v1.1`
- `IDHN_UI_Composition_and_Screen_Design_Spec_v1.0`
- `IDHN_High_Fidelity_UI_Technical_Direction_v1.0`
- `IDHN_High_Fidelity_Core_Screen_Spec_v1.0`
- `IDHN_High_Fidelity_Remaining_Screen_Spec_v1.0`
- `IDHN_Frontend_Implementation_Handoff_Codex_v1.0`
- `IDHN_Final_Engineering_Design_Audit_v1.0`
- `IDHN_Brand_Source_Package_v1.0`

No functionality is added by this document. It changes only the **visual/compositional language** used to represent already approved functions and data.

---

# 1. External reference audit — principles only

The final refinement used external product references only to study interface principles. These references do **not** add product functionality.

## Linear — interface hierarchy and calm density
Reference: `https://linear.app/now/behind-the-latest-design-refresh`

Take:
- supporting UI should recede behind the task,
- dense information can remain readable without excessive cards,
- structure should be felt more than outlined,
- navigation should not compete with the workspace.

Do not copy:
- Linear’s visual identity,
- dark-mode styling,
- its sidebar structure as a default pattern.

## GitHub Actions — dependency/state graph
Reference: `https://docs.github.com/en/actions/how-tos/monitor-workflows/use-the-visualization-graph`

Take:
- nodes and connecting lines can communicate process dependencies and state,
- state should live on the process object itself,
- the graph should help the user inspect a real process, not decorate the page.

Do not copy:
- GitHub iconography,
- workflow-builder styling,
- CI-specific semantics.

## Sentry — investigation workspace and context-preserving detail
Reference: `https://sentry.io/changelog/improved-breadcrumbs-on-issues/`

Take:
- investigation context remains visible while detail expands,
- event streams/timelines should support inspection,
- detail drawers/panels preserve spatial context.

Do not copy:
- Sentry’s issue taxonomy,
- debugging-only information hierarchy.

## Vercel Tracing — trace-first operational data
Reference: `https://vercel.com/changelog/vercel-tracing-is-now-generally-available`

Take:
- a request/process can be represented as a trace rather than as unrelated cards,
- dense lists, filters, and inspectable traces are appropriate for technical operations.

Do not copy:
- observability-specific metrics,
- spans or fields that IDHN does not actually have.

---

# 2. Core visual principle

The product must read visually as:

```text
RIGHTS VERIFICATION INFRASTRUCTURE
```

not:

```text
GENERIC AI DASHBOARD
```

The interface should still be recognizable as IDHN if the logo is hidden.

The defining geometry comes from the approved symbol:

```text
3 overlapping planes
+ horizontal signal line
+ central verification node
```

These become a reusable visual grammar rather than remaining only a logo.

---

# 3. Canonical signature primitives

## 3.1 Content / Evidence Plane
Use when the product is showing a real source, registered reference, evidence layer, or relationship between content states.

Visual role:
```text
╱ plane
╱ plane
╱ plane
```

Rules:
- soft/light surfaces,
- restrained border,
- never use as decorative glassmorphism,
- each plane must correspond to real product context.

## 3.2 Verification Signal
A thin directed line that communicates causality or system progression.

Examples:
```text
SOURCE ───── MATCH ───── REGISTRY ───── AUTH ───── DECISION
```

Rules:
- purple may represent verification/AI stage,
- warm copper marks the authorization/checkpoint transition,
- semantic color appears at the final state,
- do not use the line as decoration where no process relationship exists.

## 3.3 Verification Checkpoint Node
Derived from the central square in the brand mark.

Use for:
- visual-match checkpoint,
- critical state junction,
- system → human boundary anchor.

Do not replace it with:
- sparkles,
- AI orb,
- brain icon,
- neural-network icon,
- magic-wand icon.

## 3.4 State Rail
Used in traces, queues, and priority sequences.

Example:
```text
●────●────●────●
```

Every state must also have text/context. Color alone is insufficient.

---

# 4. Task-specific composition map

## 01 Public Entry — Open Verification Field
Use:
- open canvas,
- source and registered image as evidence planes,
- overlapping content layers between them,
- visible verification signal,
- headline and CTA beside the field.

Avoid:
- one giant rounded “AI demo card”,
- gradient blob hero,
- chatbot visual.

## 02 Login — Identity Gateway
Use:
```text
IDENTITY
   ↓
RIGHTS CONTEXT
   ↓
WORKSPACE
```

Authentication remains a flexible provider container.

Avoid:
- generic two-card login template,
- unsupported username/password fields,
- unsupported provider logos.

## 03 Rights Holder Overview — Operational Canvas
Dominant object:
```text
Priority verification event
```

Below it:
- recent activity as trace/list,
- protected works as compact records.

Avoid:
- KPI card grid,
- fake charts,
- equal-weight dashboard tiles.

## 04 Protected Works — Registry Ledger
Use dense registry rows:
```text
IMAGE | TITLE | REGISTRATION | REGISTERED | SOURCE | ACTIVITY
```

Rules:
- entire row is the interaction,
- selected/hover state may gain a subtle surface,
- no card per work.

## 05 Work Details — Registry Record Sheet
Use one continuous record composition:
- registered image,
- registry source data,
- authorization relationship,
- recent usage trace.

Avoid:
- metadata card + image card + relationship card + usage card.

## 06 Usage Activity — Verification Trace Log
Each event is a process object:
```text
VRF-2041
REQUEST ─ MATCH ─ REGISTRY ─ AUTH ─ DECISION
```

Avoid:
- rounded event card per record,
- charts that do not help the task.

## 07 Verification Details — Relation-First Evidence Workspace
The strongest visual relationship is:
```text
SOURCE IMAGE ──●── REGISTERED REFERENCE
```

Then:
- AI evidence,
- registry,
- authorization,
- system decision,
- trace.

`0.967` is an annotation/evidence value, not the visual hero.

## 08 Notifications — Operational Event Stream
Use dense chronological rows with read/unread weight.

Avoid:
- large notification cards,
- purple blocks for every notification.

## 09 Review Queue — Operations Queue
Use dense rows with a small priority edge/rail.

Example:
```text
│ CASE-001 | reason | marketplace | time | status
```

Avoid:
- alert cards,
- giant red/orange containers.

## 10 Review Case — Evidence Command Center
Use:
- source and reference comparison,
- true evidence graph,
- separate system assessment,
- separate human review.

Evidence graph visualizes only approved/existing relationships.

Do not use generic workflow-builder styling or hidden reasoning.

## 11 Review Decision — Human Boundary
The visual structure must communicate:

```text
SYSTEM DECISION
      ↓
──── HUMAN BOUNDARY ────
      ↓
HUMAN DECISION
```

No decision is visually preselected solely because of the system recommendation.

## 12 Decision Confirmation — Commit Transaction
Represent the action as a state transition:

```text
CURRENT STATE
pending_review

      ↓

PROPOSED HUMAN DECISION
needs_more_information

      ↓

EFFECT PREVIEW
AUDIT APPEND
```

Avoid generic confirmation-card composition.

---

# 5. Card discipline

Cards are allowed only where containment is functionally meaningful, such as:
- authentication provider area,
- contextual expansion,
- explicit error/permission panel,
- isolated confirmation control when necessary.

Do **not** create a card for every:
- row,
- metric,
- provenance label,
- notification,
- activity event,
- metadata group,
- trace stage.

Prefer:
- open canvas,
- divider/rule,
- ledger,
- trace,
- record sheet,
- graph,
- split view,
- contextual panel.

---

# 6. Pill discipline

Pills are reserved primarily for actual states:

```text
ALLOW
REVIEW
HOLD_FOR_REVIEW
PENDING
IN REVIEW
AUTHORIZED
NOT RECORDED
```

Provenance is not automatically a state.

Prefer micro-labels for:
```text
SOURCE
AI EVIDENCE
REGISTRY
AUTHORIZATION
SYSTEM DECISION
HUMAN REVIEW
```

---

# 7. Purple discipline

Royal Purple is a system signal, not a wallpaper color.

Use purple for:
- active route,
- visual-match stage,
- selected system state,
- focus,
- primary CTA,
- signature motion,
- key verification relationship.

Use graphite/stone for:
- provenance labels,
- secondary metadata,
- structural labels,
- inactive navigation,
- explanatory copy.

Do not color every micro-label purple.

---

# 8. Motion grammar after refinement

## 8.1 Signature sequence
```text
Content In
→ Verification
→ Registry
→ Permission
→ Decision
```

Target total:
```text
~700–760ms
```

Reduced motion:
- no travel/parallax,
- state/text/icon swap only,
- ≤120ms where possible.

## 8.2 Shared-element transitions
Canonical transitions represented in Figma Interaction Lab:

### Work → Work Details
```text
~280ms
```
Thumbnail becomes the main registered-work image.

### Queue → Review Case
```text
~300ms
```
Selected case row expands into case context while preserving identity.

### Decision → Confirmation
```text
~260ms
```
Selected human decision becomes the proposed state in confirmation.

## 8.3 Other interactions
- Technical Inspector expansion: ~280ms
- Notification read state: ~160ms
- Filter/result transition: ~220ms
- Registry loading → unavailable: ~220ms

Avoid repeated fade-up as the main motion system.

---

# 9. Mobile visual language

Mobile is not a compressed desktop.

Use:
- full-width evidence sections,
- rules/dividers,
- vertical traces,
- compact ledgers/lists,
- persistent context header,
- visible primary action where appropriate.

Avoid:
```text
[card]
[card]
[card]
[card]
```

for the full page.

Verification/Review mobile order remains evidence-first and source-compliant.

---

# 10. Responsive rule

Canonical validation widths:
```text
1440
1024
768
390
```

At tablet widths:
- collapse navigation/context,
- preserve evidence comparison when possible,
- convert secondary panels into sequence/contextual disclosure,
- do not convert all relationships into cards.

---

# 11. Codex implementation guardrails

Codex must preserve the visual grammar above.

Reject implementation if:
- all pages become `rounded-xl border bg-white p-*`,
- registry rows become independent cards,
- notifications become cards,
- review queue becomes cards,
- AI score becomes the strongest object in Verification Details,
- source/reference relationship is weakened,
- provenance labels become status pills everywhere,
- purple becomes the default color of every heading/label,
- the logo-derived planes/signal/node disappear from core flows,
- shared-element continuity is replaced only with fade/scale,
- generic AI visuals are introduced.

The frontend must continue to obey the functional boundary:
- no thresholds in UI,
- no authorization logic in UI,
- no legal conclusion in UI,
- no registry truth invented by UI,
- no seller identity trust invented by UI.

---

# 12. Canonical Figma pages after closure

```text
00 — Start Here
02 — High Fidelity v2               12 Desktop screens
03 — Mobile v2                      12 Mobile screens
04 — Design System & Motion
05 — Prototype                       8 frames
06 — States & Edge Cases
07 — Responsive QA                   8 frames (1024 / 768)
08 — Interaction Lab                includes shared-element flows
09 — Engineering Contract
10 — Signature Visual Language      canonical visual grammar
99 — Archive / Initial Public Entry Draft
```

Page `10 — Signature Visual Language` is the primary visual-law reference.

---

# 13. Anti-template rejection gate

Reject and redesign if any of the following is true:

1. Replacing the name/logo makes the product look like a normal CRM/task manager.
2. Most screens share the same `title + filters + rounded cards` composition.
3. Every data object is inside a bordered rounded container.
4. Purple appears on every label regardless of meaning.
5. Pills are used for provenance instead of actual states.
6. AI score dominates the evidence relationship.
7. Review Case looks like an AI workflow builder.
8. Motion is mostly repeated fade-up/hover.
9. Mobile becomes a long stack of cards.
10. A visual flourish weakens evidence readability or legal trust.

---

# 14. Current visual closure

The refined product should be described as:

```text
Legal verification infrastructure
presented as a precise, editorial,
human-centered technical system.
```

Not:

```text
AI dashboard with legal colors.
```

