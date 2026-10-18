const scenarios = {
  latency: {
    name: "API latency after release",
    summary: "p95 latency rose after a rollout while database saturation stayed normal.",
    logs: [
      ["14:05", "ERROR · checkout-api", "Upstream inventory request exceeded 2500 ms timeout"],
      ["14:06", "WARN · checkout-api", "Retry budget exhausted for inventory client"],
      ["14:07", "INFO · deploy-controller", "Release checkout-api 8f2c completed at 14:02"]
    ],
    metrics: [["checkout API p95", "2140 ms · baseline 180 ms"], ["inventory p95", "1820 ms · baseline 140 ms"], ["database CPU", "49% · baseline 52%"]],
    diagnosis: "The seeded fixture attributes the checkout delay to a slow inventory dependency after the latest release.",
    action: "Simulated rollback of checkout-api release 8f2c"
  },
  pool: {
    name: "Payment database pool exhausted",
    summary: "Payment requests fail while active connections reach the configured pool cap.",
    logs: [
      ["09:12", "ERROR · payment-api", "Connection acquire timeout after 3000 ms"],
      ["09:13", "WARN · payment-api", "Active connection count reached max pool size 80"],
      ["09:13", "ERROR · payment-api", "Request handler waiting for database connection"]
    ],
    metrics: [["active connections", "80 · pool cap 80"], ["pool waiters", "124 requests"], ["API error rate", "22% · baseline 0.4%"]],
    diagnosis: "The seeded fixture attributes payment failures to a saturated database connection pool.",
    action: "Simulated payment queue backpressure"
  }
};

const selector = document.querySelector("#scenario");
const summary = document.querySelector("#scenario-summary");
const signals = document.querySelector("#signals");
const diagnosis = document.querySelector("#diagnosis");
const trace = document.querySelector("#trace");
const decision = document.querySelector("#decision");
let selected = scenarios.latency;
let events = [];

function addEvent(message) {
  const time = new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date());
  events = [...events, [time, message]];
  renderTrace();
}

function renderTrace() {
  trace.replaceChildren();
  for (const [time, message] of events) {
    const item = document.createElement("li");
    const stamp = document.createElement("time");
    stamp.textContent = time;
    const text = document.createElement("span");
    text.textContent = message;
    item.append(stamp, text);
    trace.append(item);
  }
}

function renderScenario(key) {
  selected = scenarios[key];
  summary.textContent = selected.summary;
  diagnosis.textContent = selected.diagnosis;
  decision.textContent = "No decision recorded.";
  signals.replaceChildren();

  const logHeading = document.createElement("h3");
  logHeading.textContent = "Logs";
  const logs = document.createElement("dl");
  for (const [time, service, message] of selected.logs) {
    const row = document.createElement("div");
    const term = document.createElement("dt");
    term.textContent = `${time} · ${service}`;
    const value = document.createElement("dd");
    value.textContent = message;
    row.append(term, value);
    logs.append(row);
  }

  const metricHeading = document.createElement("h3");
  metricHeading.textContent = "Metrics";
  const metrics = document.createElement("dl");
  for (const [name, value] of selected.metrics) {
    const row = document.createElement("div");
    const term = document.createElement("dt");
    term.textContent = name;
    const metric = document.createElement("dd");
    metric.textContent = value;
    row.append(term, metric);
    metrics.append(row);
  }

  signals.append(logHeading, logs, metricHeading, metrics);
  events = [];
  addEvent(`Loaded seeded scenario: ${selected.name}`);
  addEvent("Displayed fixture logs and metrics; no external tools called");
}

selector.addEventListener("change", () => renderScenario(selector.value));

document.querySelector("#approve").addEventListener("click", () => {
  decision.textContent = `Approved in this browser only. Recorded: ${selected.action}. No operational system changed.`;
  addEvent(`Simulated approval recorded: ${selected.action}`);
});

document.querySelector("#reject").addEventListener("click", () => {
  decision.textContent = "Rejected in this browser only. No action was recorded or executed.";
  addEvent("Simulated approval rejected; no action recorded");
});

renderScenario("latency");
