# IDHN — Codex Final Motion, Animation & Navigation Handoff

**Version:** 1.1  
**Status:** FINAL / EXPLORATORY FIGMA HANDOFF FOR CODEX  
**Product:** إذن  
**Purpose:** Give Codex a high-quality visual and motion reference to study, explore, and improve in the browser — without treating Figma as a pixel-perfect implementation contract.  

---

## 0. Source-of-Truth Order

Codex must follow this order:

1. **Project Sources** — product behavior, data contracts, semantics, legal/technical boundaries. These are binding.
2. **Figma** — visual exploration reference: composition ideas, states, motion studies, responsive experiments, interaction continuity, and product-specific visual grammar. Study it deeply, but do **not** clone it pixel-for-pixel.
3. **This file** — motion/navigation guidance and guardrails. Timings are reference baselines, not immutable values.
4. **Implementation judgment** — Codex may improve the visual composition, interaction model, browser-native motion, responsive behavior, component structure, and microinteractions when the result is demonstrably clearer, more distinctive, more accessible, or more technically robust.

The rule is:

```text
Sources define truth.
Figma demonstrates intent.
Codex is allowed to discover a better implementation.
```

Do not redesign the product semantics. You may redesign the **presentation** if the new result is better.

Final Figma:

https://www.figma.com/design/ZNSe3Qhnh5jtyBH2oncRcz

Canonical Figma pages:

```text
00 — Start Here
02 — High Fidelity v2
03 — Mobile v2
04 — Design System & Motion
05 — Prototype
06 — States & Edge Cases
07 — Responsive QA
08 — Interaction Lab
09 — Engineering Contract
10 — Signature Visual Language
99 — Archive / Initial Public Entry Draft
```

**Page 10 is the strongest visual exploration reference, not a pixel-lock.** Understand the intent behind the planes, signal, node, ledger, trace, evidence graph, and human boundary; improve or recompose them if a browser-native solution is better.

## 0.1 Exploration Mandate

Codex should **enter Figma, inspect it, and discover**, not simply reproduce coordinates.

Expected behavior:

```text
LOOK → UNDERSTAND → TEST → IMPROVE → IMPLEMENT
```

Codex is explicitly allowed to improve:

- composition and spacing,
- visual depth,
- shape language,
- responsive restructuring,
- CSS architecture,
- browser-native View Transitions,
- shared-element behavior,
- microinteractions,
- hover/focus/pressed states,
- loading and async-state presentation,
- information density,
- progressive disclosure,
- motion timing/easing,
- accessibility behavior,
- performance-aware animation strategy.

Codex is **not** allowed to improvise:

- legal meaning,
- decision semantics,
- authorization truth,
- registry truth,
- AI confidence meaning,
- backend thresholds,
- reviewer permissions,
- notification truth,
- seller identity trust,
- unsupported product features.

### Quality bar

If the coded version is merely a literal copy of Figma, that is acceptable only if it is also the best browser implementation.

If Codex can create a version that is:

```text
clearer
+ more distinctive
+ more technically elegant
+ more responsive
+ more accessible
+ smoother
+ less template-like
```

then Codex should prefer the improved version.

The final browser experience may be **better than Figma**. That is desirable.

---

# 1. Motion Principle

Motion in IDHN is not decoration.

Every motion must explain at least one of:

```text
state
causality
progress
relationship
spatial continuity
```

If a motion does not explain one of those, remove it.

Never use animation to imply a legal conclusion, confidence, authorization, notification delivery, or backend state that the data does not support.

---

# 2. Signature Motion

Reference sequence:

```text
Content In
→ Verification
→ Registry
→ Permission
→ Decision
```

Visual meaning:

```text
SOURCE CONTENT
      ↓
CONTENT / EVIDENCE PLANES
      ↓
VISUAL MATCH CHECKPOINT
      ↓
REGISTRY ANCHOR
      ↓
AUTHORIZATION CHECKPOINT
      ↓
SYSTEM DECISION
```

Figma prototype target total:

```text
~700–760ms
```

Current Figma prototype implementation:

```text
4 transitions
60ms pause + 130ms Smart Animate each
≈ 760ms total
```

Easing:

```css
--motion-enter: cubic-bezier(.16, 1, .3, 1);
```

### Critical runtime rule

The Figma timeout sequence is a **presentation prototype**, not a fake backend timeline.

In production code:

- do not delay a real backend result just to play the sequence,
- do not claim a registry step completed before the backend says it did,
- do not animate downstream steps after an upstream failure,
- if the backend returns the full result at once, a one-time progressive visual reveal may present the resolved trace,
- if future backend streaming exposes real step events, drive the trace directly from those events.

The UI state must always be data-driven.

---

# 3. Reference Motion Tokens

Use shared tokens, not one-off numbers scattered through components. These values are the current reference baseline; Codex may tune them within the same motion character when real browser behavior, performance, or usability testing supports a better value.

```css
--motion-instant: 120ms;
--motion-micro: 160ms;
--motion-local: 220ms;
--motion-workspace: 260ms;
--motion-shared: 280ms;
--motion-panel: 320ms;
--motion-signature: 700ms;

--ease-standard: cubic-bezier(.2, .8, .2, 1);
--ease-enter: cubic-bezier(.16, 1, .3, 1);
--ease-exit: cubic-bezier(.4, 0, 1, 1);
```

The Figma variables include motion tokens and WEB code syntax. Use them as a starting point, then refine only when there is a clear implementation reason.

---

# 4. Final Navigation Graph

## 4.1 Public / Rights Holder Flow

```text
Public Entry
   ↓ 280ms
Login
   ↓ 320ms
Rights Holder Overview
   ├─ Protected Works
   │    ↓ 280ms shared transition
   │  Work Details
   │    ↓ 240ms
   │  Usage Activity
   │    ↓ 260ms
   │  Verification Details
   │
   ├─ Usage Activity
   │    ↓
   │  Verification Details
   │
   └─ Notifications
        ↓ 240ms
      Verification Details
```

## 4.2 Reviewer Flow

```text
Review Queue
   ↓ 300ms shared transition
Review Case
   ↓ 260ms
Review Decision
   ↓ 260ms shared/state transition
Decision Confirmation
   ↓ 220ms
Decision Success
   ↓ 260ms
Review Queue or Updated Case
```

## 4.3 Back / Correction Flow

```text
Decision Confirmation
   ↓ 220ms
Review Decision
```

Do not lose the selected human decision or note when returning for editing unless product policy explicitly resets them.

---

# 5. Reference Transition Baselines

| Transition | Duration | Type | Easing | Purpose |
|---|---:|---|---|---|
| Public → Login | 280ms | workspace / Smart Animate equivalent | enter | enter authenticated context |
| Login → Overview | 320ms | workspace | enter | move from identity gateway to workspace |
| Overview → Verification | 280ms | contextual | standard | preserve priority-event context |
| Work row → Work Details | 280ms | shared element | standard | thumbnail becomes registered image |
| Work Details → Activity | 240ms | local route | standard | move from record to activity trace |
| Activity → Verification | 260ms | contextual | standard | event becomes detailed verification |
| Notification → Verification | 240ms | contextual | standard | event opens its verification object |
| Review Queue → Review Case | 300ms | shared element | standard | case row becomes evidence context |
| Review Case → Decision | 260ms | focus transition | standard | remove evidence noise and enter human decision mode |
| Decision → Confirmation | 260ms | shared state | standard | selected decision becomes proposed state |
| Confirmation → Success | 220ms | state resolution | standard | commit result becomes resolved operational state |
| Success → Queue / Updated Case | 260ms | workspace | standard | return to reviewer workflow |
| Confirmation → Edit | 220ms | reverse contextual | standard | preserve selected decision context |

---

# 6. Shared-Element Transitions

These are strongly recommended reference interactions represented in Figma Interaction Lab. Preserve **spatial continuity**, but Codex may use a better browser-native transition if it communicates identity and causality more clearly.

## 6.1 Work → Work Details

Duration:

```text
~280ms
```

Behavior:

```text
Registry Ledger thumbnail
→ same protected-work identity
→ main registered-work image
```

Implementation goal:

- preserve entity identity,
- avoid a full-page fade,
- image should feel like the same object changing context,
- metadata should settle around it, not appear as an unrelated page.

If the framework/browser supports native view transitions, use a stable entity-based transition name such as:

```text
work-image-DEMO-001
```

Otherwise use a local shared-element implementation or a restrained fallback.

## 6.2 Review Queue → Review Case

Duration:

```text
~300ms
```

Behavior:

```text
CASE-001 row
→ same case identity remains anchored
→ Evidence Command Center expands around it
```

The case identity must not visually disappear and then reappear.

## 6.3 Decision → Confirmation

Duration:

```text
~260ms
```

Behavior:

```text
selected human decision
→ proposed human decision
→ effect preview
```

The confirmation page must feel like continuation of the same decision, not a new unrelated page.

---

# 7. Interaction Lab Reference

Current reference interactions:

```text
Technical Inspector expand/collapse   ~280ms
Notification unread → read            ~160ms
Filter/result transition              ~220ms
Registry loading → unavailable        ~220ms visual state transition
Work → Work Details                   ~280ms
Queue → Review Case                   ~300ms
Decision → Confirmation               ~260ms
```

## Technical Inspector

Use contextual expansion.

Do not:

- open a generic full-screen modal,
- lose the verification context,
- animate every individual field separately.

## Notification read state

Read-state animation changes hierarchy only.

Do not remove the event or flash the whole row.

## Filter result

The list updates while the active filter remains visually anchored.

Do not replay entry animations for every result.

## Registry loading → unavailable

Important:

The Figma timeout only demonstrates the state change.

Production must transition when the request actually resolves/fails.

```text
Loading
→ Connected
or
→ Unavailable
or
→ Error
```

Never:

```text
Registry unavailable
→ No registration
```

---

# 8. Decision Success State

After successful confirmation:

```text
تم تسجيل القرار.
```

Then show concise operational context:

```text
CASE-001
review_status = resolved
```

Then navigate to:

```text
updated case
or
review queue
```

No confetti.
No fireworks.
No large success illustration.
No green full-screen celebration.

Success is an auditable system state.

If backend confirmation fails:

- do not show success,
- keep user context,
- present the error,
- prevent duplicate submit,
- allow safe retry according to backend/service contract.

---

# 9. Human Boundary Animation

The separation below is a semantic requirement; its exact visual composition may be improved:

```text
SYSTEM DECISION
      ↓
────────●────────
      ↓
HUMAN DECISION
```

The copper/signal node marks the handoff.

Rules:

- no automatic preselection based only on system suggestion,
- system recommendation and human action remain visually different,
- transition into human decision mode should reduce surrounding noise,
- the human control area becomes the focus surface,
- do not animate system recommendation into the human choice as if they are the same thing.

---

# 10. Verification Trace Animation

Required semantic stages:

```text
REQUEST
VISUAL MATCH
REGISTRY
AUTHORIZATION
DECISION
```

Trace semantics:

```text
complete
active
pending
failed
```

Rules:

- direction must remain causal,
- authorization checkpoint may visually pause/anchor,
- registry failure stops the trace,
- downstream decision must not animate if it does not exist,
- final semantic color is strongest at the final state,
- AI purple is not the final legal/decision color.

Do not animate the numeric score as a dramatic counter.

`0.967` is evidence annotation, not the hero animation.

---

# 11. Button / Input Microinteractions

These should feel crisp, not playful.

Recommended implementation:

## Hover

```text
~120ms
```

- subtle surface/border change,
- no large lift,
- no glow.

## Pressed

```text
~80–120ms
```

- tiny tactile compression or 1px positional response,
- never bounce.

## Focus

- visible `:focus-visible` ring,
- must not depend on animation,
- no disappearing focus ring during route transitions.

## Loading

- label/state change,
- optional restrained spinner/progress indicator,
- no fake percentage,
- prevent double action.

---

# 12. Reduced Motion

Must support:

```css
@media (prefers-reduced-motion: reduce)
```

Reduced-motion behavior:

- remove travel,
- remove parallax,
- remove spatial morph dependency,
- use direct state/text/icon swap,
- target `<=120ms` where transition feedback is still useful,
- all information remains present and understandable.

Example:

```text
Default:
Source image travels / relation resolves / node anchors / decision appears

Reduced:
Source + reference are already positioned
→ labels/states update
→ decision appears immediately
```

Motion can disappear; meaning cannot.

---

# 13. Performance Contract

Animations must not block:

```text
input
search
navigation
API interaction
keyboard focus
```

Prefer animating:

```text
transform
opacity
```

Avoid continuous animation of:

```text
blur
box-shadow
large filters
large gradients
layout-heavy width/height across many nodes
```

No WebGL requirement.
No background video requirement.
No permanent animated gradient.
No infinite trace animation.

Do not add a heavy animation library only for basic transitions.

Use the smallest approach appropriate to the selected frontend stack.

---

# 14. Route / Focus Accessibility

On route navigation:

- move focus to the new page heading or main landmark when appropriate,
- preserve focus context for contextual drawers/panels,
- on close, return focus to the trigger,
- do not rely on hover-only actions,
- keyboard users must reach every critical action,
- do not animate focus away from the user.

Mobile and desktop must use the same semantic state model even when the composition changes.

---

# 15. Navigation Must Be Domain-Driven

Do not encode business rules inside animation handlers.

Bad:

```ts
if (score > 0.9) {
  animateToHold();
}
```

Correct:

```ts
switch (verification.decision) {
  case "allow":
  case "review":
  case "hold_for_review":
    renderDecisionState(verification.decision)
}
```

Backend/domain state decides the result.
Animation only presents the result.

---

# 16. Suggested Motion Architecture

Keep animation concerns separate from domain logic.

Suggested structure:

```text
src/
  motion/
    tokens
    reduced-motion
    route-transitions
    shared-elements
    trace-transitions

  components/
    verification-trace/
    evidence-graph/
    technical-inspector/
    decision-boundary/

  domain/
  services/
  adapters/
  routes/
```

Do not scatter raw timings through JSX/templates.

---

# 17. Visual Language Guardrails During Animation

Codex must preserve the signature language while animating:

```text
Plane
Signal Line
Verification Node
State Rail
Registry Ledger
Trace Log
Evidence Graph
Human Boundary
Commit Transition
```

Do not replace them with:

- generic animated cards,
- AI sparkles,
- glowing orbs,
- neural-network graphics,
- chatbot-first animations,
- floating gradient blobs,
- decorative workflow-builder nodes,
- repeated fade-up sections.

Purple is a system signal, not an animation wallpaper.

---

# 18. Mobile Motion

Mobile must not replay desktop motion at smaller scale.

Use:

```text
sequence
state reveal
vertical trace
section continuity
```

Avoid:

```text
large horizontal travel
multi-column morphs
long parallax
hover-dependent states
```

On mobile:

- source/reference may change from horizontal comparison to vertical evidence sequence,
- trace causality must remain readable,
- decision/action remains reachable without animation,
- sticky/context elements must not cover evidence.

---

# 19. Final Figma Motion Coverage

Final Figma contains:

```text
12 final Desktop screens
12 final Mobile screens
9 main Prototype frames including Decision Success
8 Responsive QA frames
15 Interaction Lab frames
Signature Visual Language page
Engineering Contract page
States & Edge Cases matrix
```

Final desktop navigation is wired for the major task flows, including:

```text
Public → Login
Login → Overview
Overview → Verification
Work → Work Details
Work Details → Activity
Activity → Verification
Notification → Verification
Queue → Review Case
Review Case → Decision
Decision → Confirmation
Confirmation → Edit
Confirmation → Success
Success → Review Queue
```

---

# 20. Implementation Acceptance Checklist

Do not mark frontend motion complete until all items pass.

## Signature
- [ ] Signature sequence is one-time and functional.
- [ ] Runtime state is not faked with fixed timers.
- [ ] Registry failure stops downstream trace.
- [ ] No looping animation.

## Navigation
- [ ] Public → Login works.
- [ ] Login → Overview works.
- [ ] Work → Work Details preserves entity identity.
- [ ] Queue → Review Case preserves case identity.
- [ ] Decision → Confirmation preserves selected human decision.
- [ ] Confirmation success only appears after backend success.
- [ ] Back/edit transitions preserve form context.

## Interaction
- [ ] Inspector expansion preserves context.
- [ ] Notifications read state is subtle.
- [ ] Filters do not replay excessive motion.
- [ ] Loading/error states are event-driven.

## Accessibility
- [ ] `prefers-reduced-motion` supported.
- [ ] App remains understandable with motion disabled.
- [ ] Visible keyboard focus.
- [ ] Focus restoration works.
- [ ] No hover-only critical content.

## Performance
- [ ] Motion does not block input/search.
- [ ] No heavy animation dependency without justification.
- [ ] No continuous decorative animation.
- [ ] Route transitions remain smooth on mid-range devices.

## Visual Integrity
- [ ] No generic AI motion clichés.
- [ ] Purple is restrained.
- [ ] Evidence relation remains stronger than AI score.
- [ ] Pills remain states, not provenance decoration.
- [ ] Page 10 Signature Visual Language remains visually recognizable in code.

---

# 21. Final Rule for Codex

**Do not redesign IDHN.**

Implement the product represented by:

```text
Project Sources
+ Figma final file
+ Page 10 Signature Visual Language
+ Page 08 Interaction Lab
+ this Motion/Navigation handoff
```

The implementation should feel like a real rights-verification infrastructure product, not an animated AI dashboard.

Final target:

> Technical, calm, precise, causal, auditable, and recognizably IDHN.



---

# 18. Anti-Clone Rule

Do not interpret Figma measurements as a requirement to reproduce every pixel, radius, gap, or frame boundary.

Before implementing a Figma composition, ask:

1. What job is this shape doing?
2. What relationship is this motion explaining?
3. Is this containment necessary?
4. Can the browser express the same idea more naturally?
5. Can we reduce UI chrome without losing meaning?
6. Can CSS Grid, subgrid, sticky positioning, container queries, View Transitions, or progressive disclosure improve it?
7. Does the result still feel uniquely like IDHN rather than a generic AI/SaaS dashboard?

Use Figma as a **design laboratory and intent map**.
Use the browser as the final medium.
