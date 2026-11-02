const projects = [
  {
    id: "course-copilot",
    name: "Course Copilot",
    number: "01",
    category: "Retrieval systems",
    color: "#6b8aff",
    short: "Document search you can inspect.",
    description:
      "Search documents by meaning and by keyword. Inspect the passage behind every result, then measure what retrieval actually gets right.",
    stack: ["Python", "FastAPI", "MiniLM", "SQLite"],
    metric: "78.7",
    suffix: "%",
    decimals: 1,
    metricLabel: "Hit@5 · public SciFact test",
    scope:
      "300 published queries · 5,183 abstracts. Lexical baseline: 76.0%. Document relevance, not answer accuracy.",
    caption: "Recorded academic document search",
    live: "https://charan-course-copilot.onrender.com/?v=20261101",
    decision:
      "Keyword search was a strong baseline. I kept it, added MiniLM embeddings, and combined the rankings with fixed 2:1 reciprocal-rank fusion.",
    limit:
      "The public app shows source excerpts. Generated answers need a configured Ollama server and pass an automated NLI support check. That check can reject correct text or miss unsupported claims.",
    result:
      "Hybrid found a relevant abstract in the top five for 236/300 public SciFact queries, versus 228/300 for lexical search. The settings were not tuned on SciFact.",
    secondary:
      "A separate fictional-handbook check reached passage Hit@1 of 34/36 and correctly abstained on 8/8 out-of-scope prompts. These manually authored checks are reported separately from the public benchmark.",
    bars: [
      ["Lexical", 76],
      ["Dense", 69.7],
      ["Hybrid", 78.7],
    ],
    barScope: "Hit@5 on the same 300 public SciFact queries.",
    steps: [
      [
        "01",
        "Index",
        "PDF / TXT / Markdown",
        "Documents become bounded, overlapping chunks with file and page provenance. Content hashes prevent duplicate indexing.",
      ],
      [
        "02",
        "Retrieve",
        "BM25 + MiniLM → RRF",
        "Lexical and embedding candidates are merged with fixed 2:1 rank-fusion weights. The full source passage stays visible.",
      ],
      [
        "03",
        "Check",
        "Citations + NLI support",
        "Optional generated text is checked claim by claim. Missing or unsupported answers fall back to source excerpts; missing evidence triggers abstention.",
      ],
    ],
  },
  {
    id: "formscope",
    name: "FormScope",
    number: "02",
    category: "Financial data & search",
    color: "#f5b298",
    short: "Read the filing. Check the numbers.",
    description:
      "Explore company financials and search annual filings. Keep reporting periods, source facts, and the arithmetic close enough to inspect.",
    stack: ["Python", "ONNX", "SEC EDGAR", "FastAPI"],
    metric: "40",
    suffix: "/40",
    decimals: 0,
    metricLabel: "Pinned financial values matched",
    scope:
      "Updated API vs revenue and net-income references from 20 filings. A fixed-reference comparison, not a fresh filing audit.",
    caption: "Recorded SEC financial snapshot",
    live: "https://charan-formscope.onrender.com/?v=20261101",
    decision:
      "Financial facts only become comparable when the full periods and units match. The extraction joins exact periods, handles concept fallbacks, and retains the fact accession.",
    limit:
      "The search benchmark contains 20 cropped excerpts from ten issuers, selected through lexical results. The selection biases the scores. This is retrieval and arithmetic, not an LLM financial adviser.",
    result:
      "The updated deployed API matched all 40 pinned revenue and net-income values from 20 issuer filings, with zero request errors. The original reference filings were not downloaded again for that comparison.",
    secondary:
      "On 30 manually authored filing questions, hybrid search ranked the labeled excerpt first on 30/30, compared with 27/30 lexical and 28/30 semantic. Quantized MiniLM runs through ONNX on a CPU.",
    bars: [
      ["Lexical", 90],
      ["Dense", 93.3],
      ["Hybrid", 100],
    ],
    barScope:
      "Hit@1 on 30 questions over selected excerpts; a small, biased set.",
    steps: [
      [
        "01",
        "Fetch",
        "SEC facts + filings",
        "Resolve a ticker and fetch reported XBRL facts and annual filings. Source links remain attached to the displayed company data.",
      ],
      [
        "02",
        "Align",
        "Full period + unit checks",
        "Join revenue and income by the same start date, end date and unit. Omit ratios when the reporting periods do not line up.",
      ],
      [
        "03",
        "Search",
        "Quantized MiniLM + lexical",
        "Fuse semantic and lexical passage ranks. Return original excerpts and filing links, with an explicit warning if semantic inference falls back.",
      ],
    ],
  },
  {
    id: "incidentpilot",
    name: "IncidentPilot",
    number: "03",
    category: "Applied ML & workflows",
    color: "#c3a8fa",
    short: "Follow the evidence trail.",
    description:
      "Classify an incident from logs and metrics, collect more evidence when needed, and review a proposed response before recording a simulated decision.",
    stack: ["scikit-learn", "Qwen", "FastAPI", "SQLite"],
    metric: "8",
    suffix: " cases",
    decimals: 0,
    metricLabel: "Separate synthetic stress set",
    scope:
      "Classifier: 8/8 · local Qwen scoring: 4/8. Twenty synthetic training cases, four known causes; not real-world reliability.",
    caption: "Recorded classifier investigation",
    live: "https://charan-incidentpilot.onrender.com/?v=20261101",
    decision:
      "I compared a small language model with a supervised classifier instead of assuming the LLM would win. The classifier is the public CPU path; Qwen remains an optional local backend.",
    limit:
      "Only four predefined causes and synthetic evidence are supported. Evidence-reference validity checks IDs, not causality. Reviewer names are unverified labels. Every action is a simulation.",
    result:
      "On eight separate synthetic stress cases, the classifier got 8/8 correct and Qwen candidate scoring got 4/8. The set includes misleading old notes and prompt-like runbook instructions, but remains very small.",
    secondary:
      "The failed unconstrained Qwen JSON run is retained. The workflow gathers remaining tools when evidence is weak, checks diagnosis/action consistency, and persists versioned traces and review decisions.",
    bars: [
      ["Local Qwen", 50],
      ["Classifier", 100],
    ],
    barScope:
      "Accuracy on the same eight synthetic stress cases. Four known cause classes.",
    steps: [
      [
        "01",
        "Observe",
        "Allowlisted read tools",
        "Collect bundled logs, metrics and runbooks. An optional model planner can choose tools; weak evidence triggers another collection step.",
      ],
      [
        "02",
        "Diagnose",
        "Classifier / local Qwen",
        "Predict a cause from observed evidence, validate reference IDs, then compare the diagnosis with consistency rules. Conflicts escalate for review.",
      ],
      [
        "03",
        "Review",
        "Human gate + versioned trace",
        "Record approval or rejection with optimistic version checks. The trace shows evidence, diagnosis and proposal; no production system is changed.",
      ],
    ],
  },
{
  "id": "inspectlab",
  "name": "InspectLab",
  "number": "04",
  "category": "Computer vision & transformers",
  "color": "#eab58e",
  "short": "Compare normal. Find unusual.",
  "description": "Few-reference visual defect detection with a frozen vision transformer, patch heatmaps and nearest-normal comparisons.",
  "stack": [
    "Python",
    "DINOv2",
    "ONNX",
    "WebAssembly"
  ],
  "metric": "0.988",
  "suffix": "",
  "decimals": 3,
  "metricLabel": "Mean image AUROC · 16 references",
  "scope": "349 test images, three categories and three seeds. RGB baseline: 0.841. AUROC measures ranking, not threshold accuracy.",
  "caption": "Actual browser inference",
  "live": "https://charanvalavala.github.io/demos/inspectlab/",
  "decision": "Keep the pretrained encoder frozen and compare local patches with normal examples. Hold out normal training images for threshold calibration instead of tuning on defects in the test set.",
  "limit": "Three selected MVTec categories, not the full benchmark. The demo's zipper threshold misses 10/119 defects and flags 6/32 normal images. Blur and compression cause many false alarms; the heatmap is a feature-distance map, not a causal explanation.",
  "result": "At 16 references, transformer features reached mean image AUROC 0.988 ± 0.002 versus 0.841 ± 0.017 for RGB patches. Pixel AUROC was 0.945 at 56 × 56. Category averages are weighted equally across three seeds.",
  "secondary": "The same 25 MB INT8 ONNX encoder is used in 27 transformer benchmark runs and in the browser; 27 separate runs measure the RGB baseline. Nine additional corruption checks use a fixed clean-image threshold. Model weights are pretrained, not newly trained here.",
  "bars": [
    [
      "RGB patches",
      84.1
    ],
    [
      "DINOv2 patches",
      98.8
    ]
  ],
  "barScope": "Mean image AUROC, three categories and three seeds, 16 references per category.",
  "steps": [
    [
      "01",
      "Reference",
      "Normal images → patch bank",
      "Select 1, 4 or 16 normal examples. Keep a separate normal subset for calibration; never draw references from test images."
    ],
    [
      "02",
      "Compare",
      "Frozen ViT → cosine distance",
      "Resize to 224 × 224, extract 256 patch vectors, and find each patch's nearest normal match using the quantized encoder."
    ],
    [
      "03",
      "Inspect",
      "Heatmap + calibrated threshold",
      "Display unusual regions and the matching normal patch. Report the distance score beside its threshold, with measured failure cases."
    ]
  ]
},
];
