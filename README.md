# Charan Teja Valavala — Portfolio

Personal portfolio published at https://charanvalavala.github.io/. Static HTML, CSS and JavaScript; no build step or package installation is required.

```bash
python -m http.server 8765
```

Open http://127.0.0.1:8765.

## Structure

- `index.html`: identity, project summaries, direct demo/code/resume links, background and contact. Essential project content is present without JavaScript.
- `styles.css`: typography, responsive layouts, layered project sections, pointer depth, navigation, dialogs and motion preferences.
- `project-data.js`: project details, measured comparisons, preview metadata and architecture steps.
- `script.js`: project switching, pointer interactions, scroll composition, project dialogs, architecture navigation, quick search and email-copy feedback.
- `assets/`: original mark and actual application screenshots. The share preview is a screenshot of this portfolio. Images use extensions matching their JPEG payloads.
- `demos/`: the existing saved project walkthroughs, explicitly labeled as recorded output and linked separately from live apps.

Project summaries in HTML and the richer project data should be updated together when the facts change. Keep the checked-in source readable; no minifier or animation framework is needed.

## Interaction

The opening browser-card stack switches between the three projects. Desktop pointer movement tilts the previews and shifts magnetic controls. Project sections form a layered stack on larger screens and use normal document flow on phones. Build notes open native dialogs with measured comparisons and full methodology links. Their underlying links also work without JavaScript.

The architecture section exposes three stages per project. Its animated connections illustrate flow, not live inference or activity. The floating navigation follows the current section; the full-screen menu works on small screens. Press `/` to open quick navigation, type to filter, then use arrow keys and Enter. Escape closes dialogs, with native focus restoration. Email copying reports success or failure inline.

Motion uses CSS and the Web Animations API. The implementation checks the visitor's reduced-motion preference. Decorative loops pause when offscreen or when the page is hidden. No intro blocks access to the work.

## Project evidence

- Course Copilot: public BEIR SciFact test, 300 queries over 5,183 abstracts. Hybrid Hit@5 78.7%, lexical 76.0%, dense 69.7%. Fixed retrieval settings; document relevance does not measure generated-answer correctness.
- FormScope: the updated deployed API matched 40 pinned revenue/net-income values from 20 filings. This is a fixed-reference comparison, not a fresh source-filing audit. Its separate semantic-search set contains selected cropped excerpts and has selection bias.
- IncidentPilot: classifier 8/8 and local Qwen scoring 4/8 on eight synthetic stress cases, with twenty separate synthetic training cases and four known cause classes. Neither score establishes real-world operational reliability.

Reports and reproduction steps live in the project repositories. The site preserves the internship's verified scope and describes DataForge as a concept-stage venture. The two earlier coursework projects remain available in the background section. The updated resume is available at `Charan_Teja_Valavala_Resume.pdf`; `resume.pdf` is kept as an identical alias for existing links. The B.E. entry states current enrollment without a graduation year.

## Verification and publishing

Checked browser flows include project previews, project dialogs, modal focus restoration, architecture switching, full-screen navigation and filtered keyboard search. Phone, tablet, laptop and desktop layouts were inspected without horizontal overflow. Project metrics were checked against saved reports; local files, anchors, resume and JavaScript syntax were verified. Reduced-motion behavior was reviewed in CSS and JavaScript; the system preference was not changed during QA.

Push to the existing `main` branch to publish through GitHub Pages. The three application services and their repositories are separate from this static portfolio.
