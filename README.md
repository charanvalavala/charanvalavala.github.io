# Charan Teja Valavala

Personal portfolio: https://charanvalavala.github.io/

Static HTML, CSS and JavaScript. Run locally with `python -m http.server 8765` and open http://127.0.0.1:8765.

## Projects

- **Course Copilot:** hybrid retrieval; 78.7% Hit@5 on 300 public SciFact queries across 5,183 abstracts.
- **FormScope:** source-linked SEC financials and filing search; 40 pinned financial values matched across 20 filings.
- **IncidentPilot:** evidence-linked incident classification and approval-gated simulation; separate synthetic model and guardrail evaluations.
- **InspectLab:** visual defect detection; mean image AUROC 0.988 versus 0.841 RGB baseline over three MVTec categories and three seeds. New-image inference runs in the browser.

Each showcase links to its code, demo, measurements and limitations. The first three demos contain recorded outputs and link to separate live services. InspectLab downloads its encoder and normal references, then processes images locally. Its data and model terms are in `demos/inspectlab/NOTICES.md`.

## Structure

`index.html` contains the visible summaries. `project-data.js` supplies project details and architecture steps. `script.js` handles previews, dialogs, navigation and pointer/scroll interactions; `styles.css` contains the responsive layout and motion preferences. `assets/` holds the mark and application screenshots. `demos/` contains the project interfaces.

Keep HTML summaries and project data consistent when updating results. Push `main` to publish through GitHub Pages.

The global resume is `Charan_Teja_Valavala_Resume.pdf`; `resume.pdf` remains an identical alias. It includes InspectLab and both college projects, with no CGPA or graduation year.
