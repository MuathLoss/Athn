# إذن / ITHN — Visual Identity & Product Design System
## Version 1.0 — Approved Source Edition

## 1. Brand idea
«إذن» is not represented by a legal cliché. Its identity comes from the product mechanism itself.

**Symbol logic**
- The first gateway/layer represents the incoming content/image.
- The layered middle/front forms represent the verification layer and registry context.
- The horizontal trace represents the verification path.
- The central node represents the decision point: allow, review, or hold.

**Core expression:** `Content → Verification → Permission → Decision`.

## 2. Art direction
**Intelligent / Precise / Editorial / Human / Confident / Fluid.**

The product must feel engineered specifically for copyright verification. It must not look like a renamed CRM, generic task manager, or template SaaS dashboard.

## 3. Color system — approved
| Role | Token | HEX | Use |
|---|---|---:|---|
| Deep content | Obsidian | `#0B0B10` | primary text, high-contrast moments |
| Secondary ink | Charcoal | `#1A1B22` | secondary dark surfaces/content |
| Primary brand | Royal Purple | `#6A3DF7` | primary actions, verification emphasis, brand signal |
| Supporting | Stone Purple | `#A89BC8` | soft layers, data relationships, ambient accents |
| Neutral | Soft Stone | `#E7E5ED` | separators, disabled/quiet surfaces |
| Base | White | `#FFFFFF` / `#F6F5F8` | light-first canvas/surface |
| Signature signal | Warm signal | `#D69572` | verification line/node only; use sparingly |

### Light-first background
Default canvas is white. Lavender is atmospheric, not a painted page.
Recommended canvas gradient: `#FFFFFF → #FBFAFE → #F1ECFF`.
Aim for roughly **90% neutral/light + 10% lavender atmosphere** in long-working screens.

### Semantic colors
Use semantic colors independently from brand color. A state is never communicated by color alone.
- Authorized: `#16835D`
- Needs review: `#B96B00`
- Unauthorized / held: `#C83C45`
- Informational: `#3566C8`

## 4. Typography
The system is Arabic-first and must be composed RTL from the beginning.

- **Arabic UI / headings:** Cairo — Regular / Medium / SemiBold / Bold.
- **Arabic long-form evidence:** Markazi Text — Regular / Medium / SemiBold.
- **Latin UI:** Inter — Regular / Medium / SemiBold / Bold.
- **Technical identifiers / JSON / scores:** system monospace stack.

Hierarchy uses size, weight, spacing and contrast — not a different color for every heading.
Do not animate Arabic letters individually. Reveal whole words/lines/masks so joining and diacritics remain intact.

## 5. Signature visual language
### Verification Wave
A controlled soft wave/flow used to imply processing/transition. Never a random decorative blob.

### Content Layers
Offset translucent layers derived from the logo gateways. Used for evidence stacks, source relationships, transitions and ambient framing.

### Decision Trace
A fine horizontal or directed trace with a single emphasized node. Used to show how content progresses toward a result.

**Rule:** these three motifs are enough. Do not invent a new decorative motif on every screen.

## 6. Motion signature
**Content In → Verification → Permission Check → Decision.**

Recommended timing:
- tactile input response: 120–160ms
- workspace state change: 180–350ms
- contextual panel expansion: ~260–320ms
- signature sequence: ~600–900ms only when it does not block work

Motion must explain state, causality, relationship or progress. Repeated fade-up everywhere is not a motion system.
Support `prefers-reduced-motion`; the product must remain fully usable with motion disabled.

## 7. Layout & composition
Start from the task, not from a component library.
Preferred patterns when the task calls for them:
- Verification Workspace / task canvas
- Evidence split view
- Verification trace / timeline
- Editorial overview
- Dense data mode
- Focus mode

Do not use “sidebar + topbar + four KPI cards + chart + rounded cards” as a default skeleton.
Do not make every screen the same composition with different titles.

## 8. Verification Workspace primitive
The core product primitive is **Verification Trace**, not “Card”.
A strong verification screen should allow the user to understand:
1. What was submitted?
2. What registered reference was found, if any?
3. What similarity evidence exists?
4. What registry/authorization information is relevant?
5. What decision/state was produced?
6. What is the next user action?

The visual structure should reveal these relationships directly.

## 9. Trust by Design
Always distinguish between:
- source/original information,
- AI-derived evidence,
- system recommendation,
- user/final decision.

Use explicit labels such as “Needs review”. Never let a confidence/similarity score visually masquerade as legal proof.
Show origin/context/date/limitations when relevant. Sensitive data must not leak into generic previews or notifications.

## 10. Product states
Design, implement and QA at minimum:
`Empty / Loading / Error / Permission denied / Pending review / Success / Conflict / Offline`.
For the demo also support:
`no-match / authorized / unauthorized / needs-review`.

## 11. Anti-template gate
Reject/rework if any of these are true:
- swapping name/logo makes the product a CRM/task manager;
- every page uses the same layout;
- a card/chart/sidebar cannot be justified by the task;
- brand color is either monotonously two-color or randomly distributed;
- no visual moment is tied to the verification mechanism;
- motion explains nothing;
- visual beauty weakens evidence readability;
- the demo cannot answer “what did the user do, and what happened next?”.

## 12. Accessibility / responsive / performance
- Real mobile composition; do not compress desktop into 390px.
- Keyboard navigation, visible focus, semantic labels and dialog focus management.
- Target WCAG 2.2 AA where possible.
- Product must work without motion and without WebGL.
- Lazy-load media; animations must never delay upload/search/review.
- Test RTL, zoom, text scaling, reduced motion, Chrome + Safari, and a real mobile device.

## 13. Engineering quality
Every visible button needs a real action. Every component needs meaningful states. Mock/demo data must be labeled clearly. Tokens must align between design and code. Components should be reusable without forcing every page into the same composition.

## 14. Logo usage
Preferred lockups:
- symbol only
- horizontal bilingual lockup
- stacked bilingual lockup
- app icon
- monochrome variant for restricted production contexts

Do not stretch, recolor arbitrarily, add glows, place inside random badges, change the central node, replace the gateway layers, or add legal clichés to the mark.
Keep clear space around the mark equal to at least the central-node width.
For small sizes use symbol-only rather than forcing the wordmark to become unreadable.

## 15. descriptor
`AI Copyright Verification` may be used as explanatory copy in presentations/landing pages. It is **not** locked into every logo application.
