import {
  $,
  safe,
  highlight,
  request,
  sample,
  busy,
  notify,
  jsonPost,
  savedOnly,
  tabs,
} from "./ui.js";
tabs();
let snapshot = savedOnly;
let version = 0;
let lastConnected = 0;
function render(result, question) {
  $("results").innerHTML =
    `<div class="panel"><div class="panel-head"><h2>${result.mode === "abstain" ? "No supporting source" : "Retrieved evidence"}</h2><span class="badge">${safe(result.mode)}</span></div><div class="answer">${safe(result.mode === "evidence-only" ? "Showing ranked source passages below. No generated answer is presented for this run." : result.answer)}</div>${result.fallback_reason ? `<p class="mode-note">Generation: ${safe(result.fallback_reason.replaceAll("_", " "))}. Excerpts are shown directly.</p>` : ""}${result.validation ? `<p class="mode-note">Automated NLI support coverage: ${(result.validation.claim_coverage * 100).toFixed(0)}%. This is a model estimate.</p>` : ""}</div><div class="evidence-grid">${result.evidence.map((item, i) => `<article class="evidence"><div class="source">[${i + 1}] ${safe(item.source)}${item.page ? ` · p. ${item.page}` : ""}</div><p>${highlight(item.text, question)}</p>${item.url ? `<a href="${safe(item.url)}" target="_blank" rel="noopener">Open original source ↗</a>` : ""}<details><summary>Retrieval details</summary><p>RRF score: ${Number(item.rrf_score || 0).toFixed(4)}${item.dense_score != null ? ` · semantic similarity: ${Number(item.dense_score).toFixed(3)}` : ""}</p></details></article>`).join("")}</div>`;
}
function metrics(report) {
  $("metrics").innerHTML = `<div class="metrics">${[
    ["Answerable queries", report.answerable_queries],
    ["Hit@1", report.hit_rate_at_1?.toFixed(3)],
    ["MRR", report.mean_reciprocal_rank?.toFixed(3)],
    ["Correct abstention", report.unanswerable_abstention_accuracy?.toFixed(3)],
  ]
    .map(
      ([label, value]) =>
        `<div class="metric"><span>${label}</span><strong>${safe(value)}</strong></div>`,
    )
    .join("")}</div>`;
}
async function loadSaved() {
  version++;
  snapshot = true;
  const data = await sample();
  $("question").value = data.question;
  render(data.result, data.question);
  $("mode").innerHTML =
    "<strong>Saved example</strong> · Captured sample output, not a live model response. Open the live API to ask new questions.";
  $("health").textContent = "Saved example";
  $("saved").textContent = savedOnly
    ? "Reload saved example"
    : "Return to live mode";
  $("upload-area").hidden = true;
  $("documents").innerHTML = data.documents
    .map(
      (doc) =>
        `<div class="step"><span>${safe(doc.name)}<small class="quiet"> · ${doc.chunks} chunks</small></span></div>`,
    )
    .join("");
  $("doc-count").textContent = `${data.documents.length} sources`;
  if (data.evaluation) metrics(data.evaluation);
  if (data.challenge)
    $("challenge").innerHTML =
      `<pre>${safe(JSON.stringify(data.challenge, null, 2))}</pre>`;
}
async function initialize() {
  const started = Date.now();
  snapshot = false;
  $("saved").textContent = "View saved example ↗";
  $("health").textContent = "Connecting";
  try {
    const config = await request("/api/config", {
      key: "config",
      timeout: 15000,
    });
    const docs = await request("/api/documents", {
      key: "documents",
      timeout: 15000,
    });
    lastConnected = Date.now();
    $("health").textContent = "API online";
    $("mode").textContent = config.read_only
      ? "Live API · sample sources preloaded · uploads disabled"
      : "Live API · add authorized documents in the source library";
    $("upload-area").hidden = config.read_only;
    $("doc-count").textContent = `${docs.length} sources`;
    $("documents").innerHTML = docs
      .map(
        (doc) =>
          `<div class="step"><span>${safe(doc.name)}<small class="quiet"> · ${doc.chunks} chunks</small></span>${config.read_only ? "" : `<button class="small" data-delete="${doc.id}">Remove</button>`}</div>`,
      )
      .join("");
    for (const button of document.querySelectorAll("[data-delete]"))
      button.addEventListener("click", () =>
        busy(button, async () => {
          await request(`/api/documents/${button.dataset.delete}`, {
            method: "DELETE",
          });
          await initialize();
        }),
      );
  } catch (error) {
    if (lastConnected > started || snapshot) return;
    $("health").textContent = "Connection interrupted";
    $("mode").innerHTML =
      `${safe(error.message)} <button class="small" id="retry">Retry connection</button>`;
    $("retry").addEventListener("click", initialize);
  }
}
async function ask() {
  const question = $("question").value.trim();
  if (question.length < 3)
    return notify("Enter a question with at least three characters.", true);
  if (snapshot) {
    const data = await sample();
    const example = (data.examples || []).find(
      (item) => item.question === question,
    );
    if (example) return render(example.result, question);
    return notify(
      "Choose a sample question, or open the live app to ask a new one.",
    );
  }
  const current = ++version;
  await busy($("ask"), async () => {
    $("results").innerHTML =
      '<div class="panel"><span class="busy-indicator"></span> Retrieving passages…</div>';
    let result;
    try {
      result = await request("/api/query", {
        ...jsonPost({ question, top_k: 5 }),
        key: "query",
        timeout: 120000,
      });
    } catch (error) {
      if (current === version) {
        $("results").innerHTML =
          `<div class="panel"><h2>Search interrupted</h2><p class="error">${safe(error.message)}</p><button id="retry-query">Try again</button></div>`;
        $("retry-query").addEventListener("click", ask);
      }
      return;
    }
    if (current !== version) return;
    lastConnected = Date.now();
    $("health").textContent = "API online";
    render(result, question);
  });
}
$("ask").addEventListener("click", ask);
$("question").addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === "Enter") ask();
});
for (const button of document.querySelectorAll("[data-question]"))
  button.addEventListener("click", () => {
    $("question").value = button.dataset.question;
    $("question").focus();
  });
$("saved").addEventListener("click", () =>
  busy($("saved"), async () => {
    if (snapshot && !savedOnly) await initialize();
    else await loadSaved();
  }),
);
$("upload").addEventListener("change", () =>
  busy($("seed"), async () => {
    const file = $("upload").files[0];
    if (!file) return;
    const body = new FormData();
    body.append("file", file);
    const result = await request("/api/documents", {
      method: "POST",
      body,
      key: "upload",
      timeout: 120000,
    });
    notify(
      result.duplicate
        ? "Already indexed."
        : `Indexed ${result.chunks} passages.`,
    );
    await initialize();
  }),
);
$("seed").addEventListener("click", () =>
  busy($("seed"), async () => {
    await request("/api/demo/seed", { method: "POST", timeout: 120000 });
    await initialize();
  }),
);
$("evaluate").addEventListener("click", () =>
  busy($("evaluate"), async () => {
    if (snapshot) {
      const data = await sample();
      return metrics(data.evaluation);
    }
    metrics(
      await request("/api/evaluate/demo?top_k=5", {
        key: "eval",
        timeout: 180000,
      }),
    );
  }),
);
$("custom-eval").addEventListener("click", () =>
  busy($("custom-eval"), async () => {
    if (snapshot) throw new Error("Custom evaluation requires the live API.");
    const file = $("eval-upload").files[0];
    if (!file) throw new Error("Choose a JSONL file first.");
    const cases = (await file.text())
      .split(/\r?\n/)
      .filter((line) => line.trim())
      .map((line) => JSON.parse(line));
    metrics(
      await request("/api/evaluate", {
        ...jsonPost({ cases, top_k: 5 }),
        key: "eval",
        timeout: 180000,
      }),
    );
  }),
);
if (savedOnly) loadSaved().catch((error) => notify(error.message, true));
else initialize();
