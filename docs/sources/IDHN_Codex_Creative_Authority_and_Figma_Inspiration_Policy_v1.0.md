# IDHN Codex Creative Authority & Figma Inspiration Policy v1.0

## Purpose

This file defines the relationship between **Codex**, **Figma**, and the project **Sources** during frontend implementation.

The goal is **not** to reproduce Figma literally.

The goal is to build the **best possible production-quality frontend** for IDHN / «إذن», using Figma as a strong visual reference while allowing Codex to think, judge, explore, and improve.

---

# 1. Codex is the final implementation decision-maker

Codex is expected to behave as a senior product engineer and design engineer.

It should:

- inspect the full Figma file;
- understand the visual language, screens, interactions, motion, responsive behavior, and design intent;
- understand the project Sources and domain constraints;
- evaluate the quality of the Figma solution critically;
- identify weak, generic, inconsistent, inaccessible, technically awkward, or visually underdeveloped areas;
- improve them when a better browser-native solution exists;
- make implementation decisions based on product quality, usability, engineering quality, accessibility, performance, and originality.

**Do not treat Figma as unquestionable truth.**

Figma may contain:
- imperfect spacing;
- weak compositions;
- temporary placeholders;
- visual inconsistencies;
- prototype compromises;
- implementation-unfriendly structures;
- interactions that can be improved in real code;
- responsive layouts that can be better solved in the browser.

Codex should correct these when appropriate.

---

# 2. Figma is inspiration and evidence of intent — not a pixel-perfect contract

Use Figma to learn:

- the overall visual personality;
- the intended level of polish;
- the product-specific visual grammar;
- the relationship between evidence, registry data, authorization, system decision, and human review;
- the hierarchy of information;
- important screen compositions;
- the use of traces, ledgers, evidence graphs, planes, signal lines, state rails, and human-decision boundaries;
- motion direction and spatial continuity;
- responsive intent;
- component ideas;
- typography, color, spacing, depth, and atmosphere.

But Codex is **not required** to copy:
- exact x/y positions;
- exact widths/heights when they are not optimal in the browser;
- every card/container;
- every spacing value;
- every prototype transition literally;
- every Figma component structure;
- every visual choice if a stronger solution is available.

The implementation should feel like the same product — **not like a screenshot recreation**.

---

# 3. Sources are authoritative for product meaning

The project Sources are the authority for:

- product behavior;
- user flows;
- domain semantics;
- legal and technical boundaries;
- data meaning;
- decision enums;
- authorization semantics;
- registry semantics;
- review semantics;
- backend boundaries;
- API contracts where explicitly defined;
- unresolved decisions;
- what the product is and is not allowed to claim.

Codex must not override source-defined semantics merely because a Figma screen suggests otherwise.

If Figma and Sources conflict:

**Sources win for behavior and meaning.**

Codex may redesign the UI presentation around the correct source behavior.

---

# 4. Codex has creative freedom

Codex is explicitly encouraged to improve the visual implementation.

It may create better:

- layouts;
- information density;
- spacing systems;
- responsive behavior;
- transitions;
- shared-element motion;
- microinteractions;
- loading states;
- error states;
- focus states;
- hover behavior;
- progressive disclosure;
- technical inspectors;
- evidence relationships;
- data visualizations;
- trace presentations;
- navigation transitions;
- depth;
- gradients;
- subtle atmosphere;
- component composition;
- browser-native interaction patterns.

It may use modern browser capabilities when they materially improve the result, such as:

- CSS Grid;
- container queries;
- View Transitions API;
- CSS transforms;
- CSS variables;
- modern responsive typography;
- native dialog/popover patterns where appropriate;
- progressive enhancement.

Do not add technology merely for novelty.

---

# 5. Improve Figma when Figma is weaker than the browser

Examples:

If a Figma transition is visually acceptable but a shared-element transition in code produces better continuity:

**use the better shared-element transition.**

If Figma shows a fixed layout but CSS Grid can adapt more intelligently at intermediate widths:

**use the better responsive implementation.**

If a Figma screen feels too empty:

**improve atmosphere, depth, density, or composition without inventing fake product data.**

If a screen feels too card-heavy:

**replace cards with a stronger task-specific composition.**

If Figma uses a prototype-only workaround:

**implement the real product behavior instead.**

If a motion sequence is represented with a timer in Figma:

**do not fake backend progress with timers in production.**
Use real application state and API events.

---

# 6. Preserve the product's anti-template character

The implementation must not collapse into a generic AI/SaaS dashboard.

Avoid defaulting to:

- sidebar + topbar + KPI cards;
- card for every piece of information;
- pill for every label;
- purple everywhere;
- generic gradient blobs;
- glowing AI orbs;
- sparkles;
- neural-network illustrations;
- robot/brain/circuit visuals;
- chatbot-first UI;
- generic workflow-builder nodes;
- repeated fade-up animations;
- decorative motion with no state meaning.

The product should feel like:

**legal verification infrastructure with a strong visual identity.**

Not:

**an AI dashboard with legal text.**

---

# 7. Important visual principles to understand, not blindly copy

The current Figma explores several product-specific ideas:

- **Planes** for content/evidence layers;
- **Verification Signal** for causal flow;
- **Verification Node** for checkpoints;
- **Registry Ledger** for registered works;
- **Trace Log** for verification activity;
- **Evidence Graph** for real relationships;
- **Human Boundary** between system recommendation and reviewer decision;
- **Commit Transaction** for critical confirmation;
- restrained purple as a signal;
- light-first atmospheric lavender depth;
- operational density rather than decorative whitespace.

These are **design ideas**, not rigid shapes.

Codex may reinterpret them if the result becomes:

- clearer;
- more original;
- more usable;
- more technically elegant;
- more responsive;
- more accessible;
- more performant.

---

# 8. Motion and animation authority

Figma provides motion intent and examples.

Codex should decide the best real implementation.

Priorities:

1. preserve context;
2. show causality;
3. reveal relationships;
4. communicate state changes;
5. reduce cognitive load;
6. never delay user input unnecessarily.

Prefer motion that connects:

- Work → Work Details;
- Queue → Review Case;
- Decision → Confirmation;
- Verification stages;
- Inspector expansion;
- filtering/result changes;
- state transitions.

Avoid motion that exists only to make the page feel "AI".

### Reduced Motion

Support:

`prefers-reduced-motion`

The product must remain fully understandable without motion.

When reduced motion is enabled:
- remove travel/parallax;
- avoid large spatial movement;
- use fast opacity/state/icon changes;
- preserve all information and state meaning.

---

# 9. Codex must review before implementing

Before coding the full frontend:

1. inspect all relevant project Sources;
2. inspect the Figma file using Figma MCP;
3. inspect:
   - Start Here;
   - High Fidelity;
   - Mobile;
   - Design System & Motion;
   - Prototype;
   - States & Edge Cases;
   - Responsive QA;
   - Interaction Lab;
   - Engineering Contract;
   - Signature Visual Language;
4. understand the product;
5. identify places where Figma can be improved;
6. define the implementation approach;
7. then build.

Do not immediately translate frames into JSX.

---

# 10. Quality target

The final browser implementation should be **better than the Figma where possible**.

Figma is the design exploration.

Codex is responsible for the production expression of that design.

The desired standard is:

**Originality × Usability × Trust × Engineering Quality**

The final result should feel:

- intelligent;
- precise;
- editorial;
- human;
- confident;
- fluid;
- technically credible;
- product-specific.

---

# 11. Final authority hierarchy

Use this hierarchy:

### 1. Project Sources
Authority for:
- product truth;
- behavior;
- semantics;
- legal/technical constraints.

### 2. Codex engineering judgment
Authority for:
- implementation;
- browser-native interaction;
- component architecture;
- responsive behavior;
- performance;
- accessibility;
- visual refinement;
- motion implementation.

### 3. Figma
A high-quality visual exploration and inspiration source.

Not a rigid pixel specification.

---

# Final instruction to Codex

**Do not clone Figma. Study it.**

Understand the product, understand the visual intent, understand the interaction language, then build the best version you can.

If you can make an area better than Figma without violating the project Sources, **make it better**.

If Figma is wrong, weak, generic, or technically awkward, **fix it**.

If Figma is strong, preserve the idea — not necessarily the exact pixels.

The objective is not design fidelity for its own sake.

The objective is the strongest possible production-quality frontend for «إذن».
