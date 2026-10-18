const filingSamples = [
  {
    title: "Supply chain and manufacturing footprint",
    terms: "supply chain supplier manufacturing assembly global facilities",
    text: "Apple describes a large and complex global supply chain. It says that most supplier facilities used for manufacturing and assembly are located outside the United States, creating exposure to disruptions across regions and partners."
  },
  {
    title: "International business exposure",
    terms: "international sales operations economic conditions global business",
    text: "Apple reports that a majority of its net sales come from outside the United States and notes that changes in international economic conditions can affect business results."
  },
  {
    title: "Risk factors and operations",
    terms: "risk factors operations disruption suppliers dependencies financial",
    text: "The filing describes risks that could affect operations, including reliance on a broad supplier network and external conditions that may disrupt production or demand. This summary is a navigation aid; read the filed risk-factor section for the complete disclosure."
  }
];

const ignored = new Set(["about", "after", "also", "and", "are", "does", "for", "from", "how", "into", "is", "its", "of", "on", "the", "their", "this", "to", "what", "when", "with"]);
const form = document.querySelector("#search-form");
const input = document.querySelector("#question");
const results = document.querySelector("#results");
const resultCount = document.querySelector("#result-count");
const filingUrl = "https://www.sec.gov/Archives/edgar/data/320193/000032019325000079/aapl-20250927.htm";

function terms(value) {
  return value.toLowerCase().match(/[a-z0-9]+/g)?.filter((term) => term.length > 2 && !ignored.has(term)) ?? [];
}

function render(query) {
  const queryTerms = [...new Set(terms(query))];
  const ranked = filingSamples.map((sample) => {
    const sampleTerms = new Set(terms(`${sample.terms} ${sample.title} ${sample.text}`));
    const matched = queryTerms.filter((term) => sampleTerms.has(term));
    return { sample, matched };
  }).filter((item) => item.matched.length >= Math.min(2, queryTerms.length) && queryTerms.length > 0)
    .sort((first, second) => second.matched.length - first.matched.length);

  results.replaceChildren();
  resultCount.textContent = `${ranked.length} sample section${ranked.length === 1 ? "" : "s"} matched`;

  if (!ranked.length) {
    const empty = document.createElement("div");
    empty.className = "empty-state";
    empty.textContent = "No fixed sample section has enough matching terms. The full app searches downloaded filing text.";
    results.append(empty);
    return;
  }

  for (const item of ranked) {
    const card = document.createElement("article");
    card.className = "result-card";
    const meta = document.createElement("div");
    meta.className = "result-meta";
    meta.textContent = `ILLUSTRATIVE SUMMARY · ${item.matched.length} query terms matched`;
    const heading = document.createElement("h3");
    heading.textContent = item.sample.title;
    const passage = document.createElement("p");
    passage.textContent = item.sample.text;
    const link = document.createElement("a");
    link.href = filingUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Open SEC filing source ↗";
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
