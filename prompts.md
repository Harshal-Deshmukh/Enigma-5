# prompts.md

Log of prompts used with Antigravity (Gemini) while building the Enigma 5.0 landing page for the CSI Technical Domain recruitment task.

---

## 1. Initial build

Built the page from the task brief — event name, tracks (FinTech & HealthTech), ₹25,000 prize pool, team-of-4 requirement, timeline, and a registration section. Went with a dark, protocol/cipher-themed aesthetic to match the "Enigma" branding.

## 2. Visual pass

First pass felt flat, so pushed for a stronger visual identity — added the rotating cipher-lock graphic in the hero, gradient accents, and more depth on the cards instead of flat panels.

## 3. Interactive centerpiece

Since this is an entrance task for a tech team, wanted something that demonstrates actual logic, not just layout. Added a working Caesar cipher tool with a live encoder and a slider-based decode challenge — visitors drag the shift value until a hidden message resolves.

## 4. Spacing fixes

Went through a couple of rounds getting section spacing consistent. Root cause was a CSS specificity conflict — a class selector (`.wrap`) was overriding a base element rule (`section`) and zeroing out vertical padding. Fixed by splitting `.wrap`'s padding so horizontal and vertical spacing wouldn't collide.

## 5. Theme refinement

Iterated on the color palette to move off the default purple/blue/cyan combination that's common in AI-generated dark themes, while keeping the same layout, structure, and interactions.

## 6. Registration flow

The original form used a plain text input for track selection and a browser `alert()` for both errors and success — neither felt finished for a real submission. Replaced the track field with a proper selectable card component, added real email/length validation with inline error messages, a brief loading state on submit, and a themed success modal with a generated team code. Added localStorage persistence so submissions aren't lost on refresh.

## 7. Code organization

Split the single index.html (inline styles + script) into `index.html`, `style.css`, and `script.js` for readability and maintainability — no behavior changes, just separation of concerns.

## 8. Known placeholders

- Countdown target date is a placeholder — needs the confirmed event date before go-live.
- Registration form currently persists to localStorage only; not yet wired to a backend/Sheet.
- Contact email and social links are placeholders pending confirmation from the CSI team.

---

*Last updated: 19 July 2026*
