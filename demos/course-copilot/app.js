const sourceNotes = [
  {
    title: "Semester II start dates in 2025–26",
    text: "In the official BITS Pilani academic calendar for 2025–26, Semester II student registration is listed for January 5, 2026. Semester II classwork is listed as beginning January 6, 2026. Confirm campus and programme-specific details in the official calendar.",
    url: "https://academic.bits-pilani.ac.in/Downloads/New_Admissions_Data/Academic_Calendar_AY_2025_2026_26_August_2025.pdf"
  },
  {
    title: "Course registration permission",
    text: "The Academic Bulletin 2025–26 states that registration in a course requires prior permission under the Academic Regulations. Consult the current regulations for the precise registration rule.",
    url: "https://academic.bits-pilani.ac.in/Downloads/Bulletin_2025-26.pdf"
  },
  {
    title: "Regular semesters and summer term",
    text: "The Academic Bulletin 2025–26 describes two regular semesters in the academic calendar. A summer term is not part of the regular academic calendar unless a specific programme provision says otherwise.",
    url: "https://academic.bits-pilani.ac.in/Downloads/Bulletin_2025-26.pdf"
  }
];

const ignored = new Set(["about", "after", "also", "and", "are", "does", "for", "from", "how", "in", "is", "it", "of", "the", "to", "what", "when", "which", "with"]);
const form = document.querySelector("#search-form");
const input = document.querySelector("#question");
const results = document.querySelector("#results");
const resultCount = document.querySelector("#result-count");

function terms(value) {
  return value.toLowerCase().match(/[a-z0-9]+/g)?.filter((term) => term.length > 2 && !ignored.has(term)) ?? [];
}

function render(query) {
  const queryTerms = [...new Set(terms(query))];
  const ranked = sourceNotes.map((note) => {
    const noteTerms = new Set(terms(`${note.title} ${note.text}`));
    const matched = queryTerms.filter((term) => noteTerms.has(term));
    return { note, matched };
  }).filter((item) => item.matched.length >= Math.min(2, queryTerms.length) && queryTerms.length > 0)
    .sort((first, second) => second.matched.length - first.matched.length);

  results.replaceChildren();
  resultCount.textContent = `${ranked.length} note${ranked.length === 1 ? "" : "s"} matched`;

  if (!ranked.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No sample note has enough matching terms. The full project should abstain when its corpus does not support a question.";
    results.append(empty);
    return;
  }

  for (const item of ranked) {
    const card = document.createElement("article");
    card.className = "result-card";
    const meta = document.createElement("div");
    meta.className = "result-meta";
    meta.textContent = `SOURCE NOTE · ${item.matched.length} query terms matched`;
    const heading = document.createElement("h3");
    heading.textContent = item.note.title;
    const passage = document.createElement("p");
    passage.textContent = item.note.text;
    const link = document.createElement("a");
    link.href = item.note.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Open the official source ↗";
    card.append(meta, heading, passage, link);
    results.append(card);
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  render(input.value.trim());
});

for (const button of document.querySelectorAll("[data-query]")) {
  button.addEventListener("click", () => {
    input.value = button.dataset.query;
    render(input.value);
  });
}
