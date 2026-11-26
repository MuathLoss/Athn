# إذن | IDHN
## High-Fidelity Visual QA & Design Closure
**Version:** 1.0  
**Status:** Approved design-closure source candidate  
**Purpose:** إغلاق القرارات البصرية والتنفيذية للـHigh-Fidelity قبل Frontend implementation، وتثبيت معايير القبول والرفض والـQA التي يجب أن يلتزم بها Figma وCodex.

---

# 0. Scope

هذا الملف لا يغيّر وظائف المنتج ولا يضيف شاشات جديدة.

هو يراجع ويجمّد ما تم اعتماده في:

- `LegalTech_Creative_UI_Direction_and_Design_Rules_v1`
- `IDHN_Production_Product_Architecture_and_User_Flow_v1.0`
- `IDHN_Sitemap_and_Full_Product_Flow_v1.0`
- `IDHN_Complete_Screen_Inventory_and_Mock_Contract_v1.1`
- `IDHN_UI_Composition_and_Screen_Design_Spec_v1.0`
- `IDHN_High_Fidelity_UI_Technical_Direction_v1.0`
- `IDHN_High_Fidelity_Core_Screen_Spec_v1.0`
- `IDHN_High_Fidelity_Remaining_Screen_Spec_v1.0`

---

# 1. Design Closure Decision

الهوية النهائية للمنتج يجب أن تُفهم بصريًا على أنها:

> **Legal verification infrastructure presented as a premium human-centered product.**

وليست:
- Legal website
- SaaS dashboard
- AI dashboard
- CRM
- generic admin panel
- cyberpunk AI interface

المنتج يجب أن يُعرف من:
```text
Verification Trace
Evidence Relationship
Registry Context
Authorization State
Decision State
Auditability
```

وليس من الشعار فقط.

---

# 2. Frozen Product Visual Language

## 2.1 Core visual primitives

هذه العناصر أصبحت ثابتة:

```text
Verification Signal Line
Verification Node
Evidence Layers
Decision Trace
Source Labels
Technical IDs
Evidence Pair
Registry Record
Authorization State
Decision State
Technical Inspector
```

## 2.2 Core provenance layers

يجب أن تكون هذه الطبقات قابلة للتمييز دائمًا:

```text
SOURCE
AI EVIDENCE
REGISTRY DATA
AUTHORIZATION
SYSTEM DECISION
HUMAN DECISION
```

أي تنفيذ يدمجها بصريًا في نفس المعالجة يُرفض.

---

# 3. Frozen Screen Roles

## Public Entry
Role:
```text
Explain the system in 5 seconds.
```

Signature:
```text
LIVE VERIFICATION TRACE
```

Not:
```text
marketing sections
feature cards
testimonials
fake metrics
```

---

## Rights Holder Overview
Role:
```text
Rights Control Surface
```

Question:
```text
ما الذي يحتاج انتباهي الآن؟
```

Dominant object:
```text
Priority Verification Event
```

Not:
```text
4 KPI cards
charts
dashboard grid
```

---

## Verification Details
Role:
```text
Verification Workspace
```

Question:
```text
What happened?
Why?
What evidence exists?
What is the current decision?
```

Dominant relationship:
```text
Source Image
↔
Registered Reference
→
Evidence
→
Registry
→
Authorization
→
Decision
```

---

## Review Case
Role:
```text
Evidence Command Center
```

Mandatory distinction:
```text
System Recommendation ≠ Human Decision
```

This is the most technically dense screen.

---

# 4. Frozen Design System Direction

## Canvas
Light-first.

```text
#FFFFFF
#F8F7FC
controlled lavender atmosphere
```

## Brand signal
```text
Royal Purple #6A3DF7
```

Use for:
- AI evidence
- active system signal
- selected state
- product identity

Do not use as:
- full background everywhere
- every heading
- every card border

## Warm Signal
```text
#D69572
```

Use selectively for:
- active verification checkpoint
- signal line moment
- attention transition

Not as a global accent.

## Semantic
```text
Allow  #16835D
Review #B96B00
Hold   #C83C45
Info   #3566C8
```

Color never stands alone.

---

# 5. Typography Closure

## Arabic
```text
Cairo
```

## Arabic long-form / editorial where needed
```text
Markazi Text
```

## Latin
```text
Inter
```

## IDs / technical fields
```text
Monospace
LTR
```

## Rules
- Arabic-first RTL.
- English technical values preserve LTR.
- Never animate Arabic letters individually.
- IDs must be copyable.
- Technical identifiers are visual texture, not decoration.

---

# 6. Layout Diversity Closure

The 12 screens must not share one repeated layout.

| Screen Family | Composition |
|---|---|
| Public Entry | Editorial + live trace |
| Login | Focused auth surface |
| Overview | Editorial control surface |
| Protected Works | Image-led dense library |
| Work Details | Registry record |
| Usage Activity | Process stream |
| Verification Details | Verification workspace |
| Notifications | Event stream |
| Review Queue | Dense operational queue |
| Review Case | Evidence command center |
| Review Decision | Focus mode |
| Confirmation | Critical confirmation |

If two unrelated screens look like the same template with different text, redesign.

---

# 7. Navigation Closure

## No dominant SaaS sidebar.

Internal navigation uses:
```text
Context Rail
```

Characteristics:
- compact
- quiet
- low visual weight
- contextual
- collapsible where useful

The workspace owns the screen.

---

# 8. Motion Closure

Motion is functional.

## Signature sequence
```text
Content In
→ Verification
→ Registry / Permission
→ Decision
```

## Allowed
- anchored reveal
- trace resolution
- contextual expansion
- shared-state transition
- tactile input response

## Rejected
- repeated fade-up everywhere
- infinite decorative animation
- moving gradients behind evidence
- motion required to understand content

## Reduced motion
Everything remains fully understandable.

---

# 9. Engineering Closure

Every visible UI block must map to:

```text
data field
state
navigation
or real action
```

No decorative fake functionality.

Example:

```text
0.967
```

must map to:
```text
verification.similarity_score
```

not hardcoded display content in production.

---

# 10. AI / Legal Trust Closure

## Similarity
Always:
```text
درجة تشابه بصري
```

Never:
```text
احتمال سرقة
احتمال تعدٍ
نسبة انتهاك
```

## Authorization
`not_recorded` means:
```text
لم يظهر إذن مسجل في البيانات المتاحة.
```

It does not mean:
```text
ثبت عدم وجود إذن قانوني.
```

## Registry unavailable
Always distinct from:
```text
No registration
```

## AI
AI provides:
```text
visual evidence
```

It does not independently prove:
```text
ownership
permission
infringement
```

---

# 11. Interaction Closure

## Primary action rule
Each screen:
- one dominant action
- secondary actions quieter
- system state visible

## Sensitive actions
Must include review-before-submit where applicable.

Especially:
```text
Review Decision
→ Decision Confirmation
→ Submit
→ Audit
```

---

# 12. Responsive Closure

## Desktop
Relationships can be visible simultaneously.

## Tablet
Context collapses selectively.

## Mobile
Relationships become ordered sequences.

### Verification mobile order
```text
Request
Source image
Registered reference
Visual evidence
Registry
Authorization
Trace
Decision
```

### Reviewer mobile order
```text
Case
Source
Reference
AI evidence
Registry
Authorization
System assessment
Human decision
```

Never compress desktop tables into unreadable 390px layouts.

---

# 13. RTL Closure

Mandatory checks:

- Arabic page direction is RTL from root.
- Technical IDs remain LTR.
- English words inside Arabic do not reorder incorrectly.
- Decision traces preserve causal direction.
- arrows/icons are directionally correct.
- breadcrumbs/navigation follow RTL logic.
- tables and dense rows remain understandable.
- long Arabic strings do not clip.

---

# 14. Accessibility Closure

Target:
```text
WCAG 2.2 AA
```

Must include:
- visible keyboard focus
- semantic button/input roles
- correct labels
- meaningful alt text for evidence images
- state text in addition to color
- accessible dialogs
- focus restoration
- no hover-only critical information
- reduced-motion support

---

# 15. Performance Closure

Frontend must work:
- without WebGL
- without motion
- on medium devices

Rules:
- lazy load non-critical media
- image optimization
- avoid huge animation libraries unless justified
- animations never block input/search
- no decorative video backgrounds
- evidence image rendering gets priority

---

# 16. Mock / Demo Closure

All demo data must be clearly identifiable as demo/test data where context requires it.

Required scenarios:

```text
allow_no_match
allow_authorized
hold_no_authorization
review_ambiguous_match
review_unknown_authorization
registry_unavailable
backend_error
review_conflict
```

The demo must not only show happy path.

---

# 17. Critical Self-Review

The design direction has three major failure risks.

## Risk 01 — Over-technicalizing the UI

### Problem
Because the product is technical, it is easy to fill every screen with:
- IDs
- traces
- technical labels
- raw statuses

This can turn the product into a developer console.

### Correction
Technical information has three levels:

```text
Primary UI
→ human-readable

Evidence context
→ technical anchors

Technical Inspector
→ raw fields
```

Raw technical content is progressive disclosure, not the default layer.

---

## Risk 02 — Verification Trace becoming decoration

### Problem
The trace could become a visual gimmick repeated on every screen.

### Correction
Use full trace only where workflow causality matters:

```text
Public Entry
Verification Details
Review Case
selected priority activity
```

Other screens use simplified state/relationship indicators.

---

## Risk 03 — Purple becoming the identity instead of the system

### Problem
A purple-heavy interface can quickly look like generic AI SaaS.

### Correction
The product identity is defined by:
```text
Evidence relationships
Verification signal
Source provenance
Decision trace
```

Purple remains a controlled signal.

Default workspace stays neutral.

---

# 18. Anti-Template Gate

Reject implementation if any are true:

- change logo/name and it becomes CRM.
- every page uses same card grid.
- Overview is four KPIs + chart.
- Review Case looks like a dashboard.
- Evidence is secondary to decoration.
- purple dominates the whole screen.
- every block is rounded.
- every interaction uses fade-up.
- AI is represented by robot/brain/sparkles.
- legal context relies on gavel/scales.
- technical values are decorative/fake.
- mobile is compressed desktop.
- user cannot answer “what happened and why?”

---

# 19. Internal Quality Scorecard

Target:
```text
85 / 100 minimum
```

## Originality / product-specific composition
25

## Color / depth / visual control
20

## Workflow clarity / trust
20

## Motion quality
10

## RTL / accessibility / mobile
15

## Engineering realism / performance
10

### Hard rule
A high visual score cannot compensate for:
- misleading evidence
- unreadable Arabic
- fake system states
- unclear decision provenance

---

# 20. Required Visual QA Matrix

Before final visual approval, render and inspect:

## Breakpoints
```text
1440
1024
768
390
```

## Core Screens
```text
01 Public Entry
03 Rights Holder Overview
07 Verification Details
10 Review Case
```

## Remaining Screens
All 8 remaining screens.

## States
At minimum:
```text
default
loading
empty where relevant
error
registry unavailable
review
hold
permission denied where relevant
conflict where relevant
```

---

# 21. Render QA Status

## Completed
- Architecture QA
- Content hierarchy QA
- Screen-role QA
- data-to-UI mapping QA
- legal/AI wording QA
- responsive specification QA
- RTL specification QA
- anti-template QA rules
- motion grammar closure
- accessibility requirements closure

## Still requires actual rendered-screen inspection
- visual spacing
- final font rendering
- real Arabic line breaks
- real contrast against gradients
- image crop/contain behavior
- component density
- mobile tactile spacing
- final screenshot comparison
- browser rendering differences

These checks cannot be truthfully marked complete from specifications alone.

---

# 22. Figma / Render Approval Gate

A screen becomes visually approved only after checking:

```text
[ ] full screenshot
[ ] RTL
[ ] mobile
[ ] typography
[ ] evidence readability
[ ] no clipping
[ ] no overflow
[ ] no generic SaaS composition
[ ] correct semantic states
[ ] correct source/AI/system separation
```

---

# 23. Codex Freeze Rules

When implementation starts, Codex must not independently redesign:

- information architecture
- screen hierarchy
- decision states
- trace stages
- color roles
- provenance layers
- user roles
- routes semantics
- legal wording semantics

Codex may make implementation-level choices for:
- framework primitives
- responsive CSS technique
- component internals
- state management
- test structure

provided they do not change approved product behavior.

---

# 24. Files That Form the Frontend Source of Truth

The frontend implementation must read together:

```text
01 LegalTech_Creative_UI_Direction_and_Design_Rules_v1
02 IDHN_Brand_Source_Package_v1.0
03 IDHN_Production_Product_Architecture_and_User_Flow_v1.0
04 IDHN_Sitemap_and_Full_Product_Flow_v1.0
05 IDHN_Complete_Screen_Inventory_and_Mock_Contract_v1.1
06 IDHN_UI_Composition_and_Screen_Design_Spec_v1.0
07 IDHN_High_Fidelity_UI_Technical_Direction_v1.0
08 IDHN_High_Fidelity_Core_Screen_Spec_v1.0
09 IDHN_High_Fidelity_Remaining_Screen_Spec_v1.0
10 IDHN_High_Fidelity_Visual_QA_and_Design_Closure_v1.0
```

---

# 25. Design Closure Result

## Product specification
**CLOSED**

All 12 screens, roles, content hierarchy, data contracts, composition language, technical visual grammar, responsive strategy, RTL strategy, trust rules, and state semantics are defined.

## Rendered visual QA
**PENDING FINAL SCREENSHOT VERIFICATION**

This status must remain explicit until actual rendered screens are inspected.

---

# 26. Next Stage

## Frontend Implementation Handoff — Codex

Before coding, create one final implementation brief that tells Codex:

- project objective
- mandatory source files
- frontend architecture
- route structure
- component structure
- mock service architecture
- data types
- required scenarios
- responsive rules
- RTL rules
- accessibility rules
- prohibited shortcuts
- Definition of Done

After that brief is approved:
**switch to Codex and start implementation.**
