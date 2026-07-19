# Enigma 5.0 — The Enigma Protocol

Landing page for **Enigma 5.0**, the flagship hackathon by SIES CSI. Built as part of the Technical Domain recruitment task for CSI.

🔗 **Live demo:** [add deployed link here]

---

## About the event

- **Tracks:** FinTech & HealthTech
- **Team size:** 4 (undergraduate students)
- **Prize pool:** ₹25,000
- **Format:** Single-elimination protocol-style hackathon — registration, kickoff, build phase, submissions, judging

## Features

- Boot-sequence style intro loader
- Animated hero with a decrypt/scramble title effect and live countdown timer
- Interactive Caesar cipher tool — live encoder plus a slider-based decode challenge with a hidden message
- Glass-panel track cards with mouse-tracked tilt and spotlight effects
- Scroll-triggered vertical timeline with active-node highlighting
- Animated prize counter
- Registration form with inline validation, a loading state, and a themed success modal that generates a team access code
- Fully responsive layout

## Tech stack

- HTML5, CSS3 (custom properties, no framework)
- Vanilla JavaScript — no build step, no dependencies
- Canvas API for the background particle network
- `IntersectionObserver` for scroll-based animations

## Running locally

No build step required. Clone the repo and open `index.html` in a browser, or serve it with any static server:

```bash
npx serve .
```

## Known limitations

- Countdown timer uses a placeholder target date — update `EVENT_DATE` in `script.js` before launch
- Registration form persists submissions to `localStorage` for demo purposes; not yet connected to a backend
- Contact email and social links are placeholders

## Credits

Built by Harshal Deshmukh-SE-C for the SIES CSI Technical Domain recruitment process, 2026.

## Project structure
