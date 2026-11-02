const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
let reduced = motionPreference.matches;
const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));
const escapeHTML = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );
const arrow =
  '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" stroke-width="1.6"/></svg>';

let previewIndex = 0;
const previewButtons = $$("[data-preview]");
function selectPreview(index) {
  previewIndex = (index + projects.length) % projects.length;
  const project = projects[previewIndex];
  const image = $("#hero-project-image");
  image.src = `assets/${project.id}.jpg`;
  image.alt = `${project.name} actual application interface`;
  $("#hero-project-title").textContent = project.name;
  $("#hero-project-type").textContent = project.category;
  $("#hero-project-number").textContent = `${project.number} / ${String(projects.length).padStart(2, "0")}`;
  $("#hero-project-link").href = `#${project.id}`;
  previewButtons.forEach((button, position) =>
    button.setAttribute("aria-pressed", String(position === previewIndex)),
  );
  const otherProjects = projects.filter(
    (_, position) => position !== previewIndex,
  );
  $(".ghost-mid>span").textContent =
    `${otherProjects[0].number} / ${otherProjects[0].name}`;
  $(".ghost-back>span").textContent =
    `${otherProjects[1].number} / ${otherProjects[1].name}`;
  if (!reduced) {
    image.animate(
      [
        { opacity: 0.3, transform: "scale(1.04)" },
        { opacity: 1, transform: "scale(1)" },
      ],
      { duration: 430, easing: "cubic-bezier(.2,.8,.2,1)" },
    );
    $(".deck-front").animate(
      [
        { transform: "translateZ(35px) rotateY(-7deg)" },
        { transform: "translateZ(35px) rotateY(0deg)" },
      ],
      { duration: 550, easing: "cubic-bezier(.2,.8,.2,1)" },
    );
  }
}
previewButtons.forEach((button, index) => {
  button.addEventListener("click", () => selectPreview(index));
  button.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? projects.length - 1
          : previewIndex + (event.key === "ArrowRight" ? 1 : -1);
    selectPreview(next);
    previewButtons[previewIndex].focus();
  });
});
$(".deck-next").addEventListener("click", () =>
  selectPreview(previewIndex + 1),
);

for (const target of $$("[data-tilt]")) {
  target.addEventListener(
    "pointermove",
    (event) => {
      if (reduced || !finePointer.matches) return;
      const bounds = target.getBoundingClientRect();
      const x = clamp(
        (event.clientX - bounds.left) / bounds.width - 0.5,
        -0.5,
        0.5,
      );
      const y = clamp(
        (event.clientY - bounds.top) / bounds.height - 0.5,
        -0.5,
        0.5,
      );
      target.style.setProperty("--rx", `${-y * 12}deg`);
      target.style.setProperty("--ry", `${x * 14}deg`);
    },
    { passive: true },
  );
  target.addEventListener("pointerleave", () => {
    target.style.removeProperty("--rx");
    target.style.removeProperty("--ry");
  });
}
for (const target of $$("[data-magnetic]")) {
  target.addEventListener(
    "pointermove",
    (event) => {
      if (reduced || !finePointer.matches) return;
      const bounds = target.getBoundingClientRect();
      target.style.setProperty(
        "--mx",
        `${(event.clientX - bounds.left - bounds.width / 2) * 0.13}px`,
      );
      target.style.setProperty(
        "--my",
        `${(event.clientY - bounds.top - bounds.height / 2) * 0.18}px`,
      );
    },
    { passive: true },
  );
  target.addEventListener("pointerleave", () => {
    target.style.removeProperty("--mx");
    target.style.removeProperty("--my");
  });
}
const cursor = $(".cursor-label");
let pointerX = -1000,
  pointerY = -1000,
  pointerFrame = false;
document.addEventListener(
  "pointermove",
  (event) => {
    if (reduced || !finePointer.matches) return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (!pointerFrame) {
      pointerFrame = true;
      requestAnimationFrame(() => {
        pointerFrame = false;
        document.documentElement.style.setProperty(
          "--pointer-x",
          `${pointerX}px`,
        );
        document.documentElement.style.setProperty(
          "--pointer-y",
          `${pointerY}px`,
        );
        cursor.style.setProperty("--cursor-x", `${pointerX + 18}px`);
        cursor.style.setProperty("--cursor-y", `${pointerY + 18}px`);
      });
    }
  },
  { passive: true },
);
for (const target of $$("[data-cursor]")) {
  target.addEventListener("pointerenter", () => {
    if (reduced || !finePointer.matches) return;
    cursor.textContent = target.dataset.cursor + " ↗";
    cursor.classList.add("active");
  });
  target.addEventListener("pointerleave", () =>
    cursor.classList.remove("active"),
  );
}

const nav = $(".desktop-nav");
const navIndicator = $(".nav-indicator");
const navLinks = $$("[data-nav]");
let activeNav = null;
function moveIndicator(link) {
  navIndicator.style.opacity = link ? "1" : "0";
  if (!link) return;
  navIndicator.style.width = `${link.offsetWidth}px`;
  navIndicator.style.transform = `translateX(${link.offsetLeft - 5}px)`;
}
navLinks.forEach((link) =>
  link.addEventListener("pointerenter", () => moveIndicator(link)),
);
nav.addEventListener("pointerleave", () => moveIndicator(activeNav));
const sectionIDs = ["work", "lab", "about", "contact"];
const workCards = $$(".work-card");
let scrolling = false;
function updateScroll() {
  scrolling = false;
  const distance = document.documentElement.scrollHeight - innerHeight;
  document.documentElement.style.setProperty(
    "--scroll",
    String(distance > 0 ? scrollY / distance : 0),
  );
  nav.classList.toggle("fixed", scrollY > 130);
  $(".site-header").classList.toggle("scrolled", scrollY > 130);
  const current = sectionIDs
    .filter(
      (id) =>
        document.getElementById(id).getBoundingClientRect().top <
        innerHeight * 0.4,
    )
    .at(-1);
  const nextNav = navLinks.find((link) => link.dataset.nav === current) || null;
  if (nextNav !== activeNav) {
    activeNav = nextNav;
    navLinks.forEach((link) => {
      if (link === activeNav) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    moveIndicator(activeNav);
  }
  if (!reduced && innerWidth > 850) {
    $(".hero-stage").style.translate = `0 ${Math.min(scrollY * 0.075, 40)}px`;
    workCards.forEach((card, index) => {
      const next = workCards[index + 1];
      if (!next) return;
      const progress = clamp(
        (innerHeight - next.getBoundingClientRect().top) / (innerHeight - 104),
        0,
        1,
      );
      card.style.setProperty("--stack-scale", String(1 - progress * 0.04));
      card.style.setProperty("--stack-brightness", String(1 - progress * 0.17));
    });
  } else {
    $(".hero-stage").style.removeProperty("translate");
    workCards.forEach((card) => {
      card.style.removeProperty("--stack-scale");
      card.style.removeProperty("--stack-brightness");
    });
  }
}
window.addEventListener(
  "scroll",
  () => {
    if (!scrolling) {
      scrolling = true;
      requestAnimationFrame(updateScroll);
    }
  },
  { passive: true },
);
window.addEventListener("resize", () => {
  updateScroll();
  moveIndicator(activeNav);
});
document.fonts?.ready.then(() => moveIndicator(activeNav));
updateScroll();

if ("IntersectionObserver" in window) {
  const reveals = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        if (!reduced)
          entry.target.animate(
            [
              { opacity: 0.3, transform: "translateY(28px)" },
              { opacity: 1, transform: "translateY(0)" },
            ],
            { duration: 800, easing: "cubic-bezier(.2,.8,.2,1)" },
          );
        reveals.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );
  $$(".reveal").forEach((element) => reveals.observe(element));
  const counters = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        const value = Number(element.dataset.count);
        const decimals = Number(element.dataset.decimals || 0);
        const started = performance.now();
        function tick(time) {
          const progress = reduced ? 1 : clamp((time - started) / 900, 0, 1);
          element.textContent = (
            value *
            (1 - Math.pow(1 - progress, 3))
          ).toFixed(decimals);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        counters.unobserve(element);
      });
    },
    { threshold: 0.6 },
  );
  $$("[data-count]").forEach((element) => counters.observe(element));
  const ambient = new IntersectionObserver((entries) =>
    entries.forEach((entry) =>
      entry.target.classList.toggle("motion-paused", !entry.isIntersecting),
    ),
  );
  $$(".ticker,.hero-stage,.pipeline").forEach((element) =>
    ambient.observe(element),
  );
}
if (!reduced) {
  $$(".hero-intro,.hero h1,.hero-description,.hero-actions,.hero-note").forEach(
    (element, index) =>
      element.animate(
        [
          { opacity: 0, transform: "translateY(25px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 850,
          delay: index * 65,
          easing: "cubic-bezier(.2,.8,.2,1)",
          fill: "backwards",
        },
      ),
  );
}
document.addEventListener("visibilitychange", () =>
  document.body.classList.toggle("page-hidden", document.hidden),
);
motionPreference.addEventListener("change", (event) => {
  reduced = event.matches;
  if (reduced) {
    document.getAnimations().forEach((animation) => animation.cancel());
    $$("[data-count]").forEach(
      (element) =>
        (element.textContent = Number(element.dataset.count).toFixed(
          Number(element.dataset.decimals || 0),
        )),
    );
    cursor.classList.remove("active");
  }
  updateScroll();
});

const projectDialog = $(".project-dialog");
const menuDialog = $(".menu-dialog");
const commandDialog = $(".command-dialog");
function lockPage() {
  document.body.style.overflow = $$("dialog[open]").length ? "hidden" : "";
}
function openProject(identifier) {
  const project = projects.find((item) => item.id === identifier);
  if (!project) return;
  const chart = project.bars
    .map(
      ([label, value]) =>
        `<div class="chart-row"><span>${escapeHTML(label)}</span><div class="chart-track"><i style="--bar:${Number(value)}%"></i></div><strong>${project.id === "inspectlab" ? (Number(value) / 100).toFixed(3) : Number(value).toFixed(1) + "%"}</strong></div>`,
    )
    .join("");
  $("#dialog-category").textContent = `${project.number} / ${project.category}`;
  projectDialog.style.setProperty("--project", project.color);
  $("#dialog-content").innerHTML =
    `<div class="dialog-inner"><h2 id="dialog-title">${escapeHTML(project.name)}</h2><p class="dialog-intro">${escapeHTML(project.short)}</p><div class="dialog-columns"><div><h3>Why this approach</h3><p>${escapeHTML(project.decision)}</p><h3>What I measured</h3><p>${escapeHTML(project.result)}</p><p>${escapeHTML(project.secondary)}</p></div><div><h3>The comparison</h3><div class="result-chart">${chart}</div><p class="chart-scope">${escapeHTML(project.barScope)}</p><h3>The path through the system</h3><p>${project.steps.map((step) => escapeHTML(step[1])).join(" → ")}</p><a class="text-action" href="https://github.com/charanvalavala/${project.id}#readme" target="_blank" rel="noopener">Full methodology & reports ↗</a></div></div><div class="dialog-limit"><h3>Known limits</h3><p>${escapeHTML(project.limit)}</p></div><div class="dialog-actions"><a class="button button-blue" href="demos/${project.id}/">${project.id === "inspectlab" ? "Open browser app" : "Open saved demo"} ${arrow}</a><a href="${project.live}" target="_blank" rel="noopener">Live app ↗</a><a href="https://github.com/charanvalavala/${project.id}" target="_blank" rel="noopener">Source code ↗</a></div></div>`;
  projectDialog.showModal();
  projectDialog.scrollTop = 0;
  lockPage();
}
$$("[data-details]").forEach((button) =>
  button.addEventListener("click", (event) => {
    event.preventDefault();
    openProject(button.dataset.details);
  }),
);
$(".dialog-close").addEventListener("click", () => projectDialog.close());
for (const dialog of $$("dialog")) {
  dialog.addEventListener("close", lockPage);
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      dialog.close();
  });
}
$(".menu-open").addEventListener("click", () => {
  menuDialog.showModal();
  $(".menu-open").setAttribute("aria-expanded", "true");
  lockPage();
});
$(".menu-close").addEventListener("click", () => menuDialog.close());
menuDialog.addEventListener("close", () =>
  $(".menu-open").setAttribute("aria-expanded", "false"),
);
$$("a", menuDialog).forEach((link) =>
  link.addEventListener("click", () => menuDialog.close()),
);

let currentLab = 0;
let currentStep = 0;
function selectStep(index, animate = true) {
  currentStep = index;
  const step = projects[currentLab].steps[index];
  $("#pipeline-caption").textContent = `${step[0]} / ${step[1]}`;
  $("#pipeline-title").textContent = step[2];
  $("#pipeline-description").textContent = step[3];
  $$(".pipeline-node").forEach((button, position) =>
    button.setAttribute("aria-pressed", String(position === index)),
  );
  if (animate && !reduced)
    $(".pipeline-info").animate(
      [
        { opacity: 0.25, transform: "translateY(9px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 360, easing: "ease-out" },
    );
}
function selectLab(index) {
  currentLab = index;
  $$("[data-lab]").forEach((button, position) =>
    button.setAttribute("aria-pressed", String(position === index)),
  );
  $("#pipeline-nodes").innerHTML = projects[index].steps
    .map(
      (step, position) =>
        `<button class="pipeline-node" aria-pressed="${position === 0}" data-step="${position}"><span class="node-number">${step[0]}</span><strong>${escapeHTML(step[1])}</strong></button>`,
    )
    .join("");
  $$(".pipeline-node").forEach((button, position) => {
    button.addEventListener("click", () => selectStep(position));
    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      const next =
        (currentStep + (event.key === "ArrowRight" ? 1 : -1) + 3) % 3;
      selectStep(next);
      $$(".pipeline-node")[next].focus();
    });
  });
  selectStep(0, false);
}
$$("[data-lab]").forEach((button, index) =>
  button.addEventListener("click", () => selectLab(index)),
);
$("#lab-details").addEventListener("click", () =>
  openProject(projects[currentLab].id),
);
selectLab(0);

const shortcutLabel = "/";
$$(".quick-open span,.quick-trigger kbd").forEach(
  (element) => (element.textContent = shortcutLabel),
);
const commands = [
  {
    label: "Course Copilot",
    detail: "Document retrieval",
    href: "#course-copilot",
  },
  { label: "FormScope", detail: "Financial data & search", href: "#formscope" },
  {
    label: "IncidentPilot",
    detail: "Applied ML & workflows",
    href: "#incidentpilot",
  },
  { label: "Under the hood", detail: "System architecture", href: "#lab" },
  { label: "About", detail: "Background & experience", href: "#about" },
  {
    label: "Resume PDF",
    detail: "Open resume",
    href: "Charan_Teja_Valavala_Resume.pdf",
    external: true,
  },
  { label: "Contact", detail: "Say hello", href: "#contact" },
  {
    label: "GitHub",
    detail: "Code repositories",
    href: "https://github.com/charanvalavala",
    external: true,
  },
  {
    label: "LinkedIn",
    detail: "Professional profile",
    href: "https://www.linkedin.com/in/valavala-charan-teja-b02815251/",
    external: true,
  },
];
let commandIndex = 0;
function renderCommands() {
  const query = $("#command-input").value.toLowerCase().trim();
  const filtered = commands.filter((item) =>
    (item.label + " " + item.detail).toLowerCase().includes(query),
  );
  commandIndex = 0;
  $("#command-results").innerHTML = filtered.length
    ? filtered
        .map(
          (item, index) =>
            `<a class="${index === 0 ? "selected" : ""}" href="${item.href}" ${item.external ? 'target="_blank" rel="noopener"' : ""}><span>${escapeHTML(item.label)}</span><span aria-hidden="true">↗</span></a>`,
        )
        .join("")
    : '<p class="command-empty">No match. Try a project name or “resume”.</p>';
  $$("#command-results a").forEach((link) =>
    link.addEventListener("click", () => commandDialog.close()),
  );
}
function openCommands() {
  $("#command-input").value = "";
  renderCommands();
  commandDialog.showModal();
  $("#command-input").focus();
  lockPage();
}
$$(".quick-open,.quick-trigger").forEach((button) =>
  button.addEventListener("click", openCommands),
);
$(".command-close").addEventListener("click", () => commandDialog.close());
$("#command-input").addEventListener("input", renderCommands);
$("#command-input").addEventListener("keydown", (event) => {
  const links = $$("#command-results a");
  if (!links.length) return;
  if (["ArrowDown", "ArrowUp"].includes(event.key)) {
    event.preventDefault();
    commandIndex =
      (commandIndex + (event.key === "ArrowDown" ? 1 : -1) + links.length) %
      links.length;
    links.forEach((link, index) =>
      link.classList.toggle("selected", index === commandIndex),
    );
    links[commandIndex].scrollIntoView({ block: "nearest" });
  } else if (event.key === "Enter") {
    event.preventDefault();
    links[commandIndex].click();
  }
});
document.addEventListener("keydown", (event) => {
  const modifierShortcut =
    (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
  const searchShortcut =
    event.key === "/" &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.altKey &&
    !event.target.closest('input,textarea,[contenteditable="true"]');
  if (
    !event.repeat &&
    (modifierShortcut || searchShortcut) &&
    !projectDialog.open &&
    !menuDialog.open
  ) {
    event.preventDefault();
    if (commandDialog.open) commandDialog.close();
    else openCommands();
  }
});

let toastTimer;
function notify(message) {
  const toast = $(".toast");
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 3500);
}
$(".copy-email").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(
      "f20220059@hyderabad.bits-pilani.ac.in",
    );
    notify("Email copied.");
  } catch {
    notify("Copy is unavailable here. Use the email link instead.");
  }
});
