const revealItems = document.querySelectorAll("[data-reveal]");

document.documentElement.classList.add("js");

for (const item of revealItems) {
  const delay = Number(item.dataset.delay || 0);
  item.style.setProperty("--reveal-delay", `${delay}ms`);
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, activeObserver) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          activeObserver.unobserve(entry.target);
        }
      }
    },
    { rootMargin: "0px 0px -48px 0px", threshold: 0.12 }
  );

  for (const item of revealItems) revealObserver.observe(item);
} else {
  for (const item of revealItems) item.classList.add("is-visible");
}

const siteNav = document.querySelector(".site-nav");
const sectionLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const linkedSections = sectionLinks
  .map((link) => ({ link, section: document.querySelector(link.getAttribute("href")) }))
  .filter(({ section }) => section);

function setActiveSection(activeLink) {
  if (!activeLink || !siteNav) return;
  for (const link of sectionLinks) {
    if (link === activeLink) {
      link.setAttribute("data-active", "true");
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("data-active");
      link.removeAttribute("aria-current");
    }
  }
  siteNav.style.setProperty("--indicator-x", `${activeLink.offsetLeft}px`);
  siteNav.style.setProperty("--indicator-width", `${activeLink.offsetWidth}px`);
  siteNav.style.setProperty("--indicator-height", `${activeLink.offsetHeight}px`);
  siteNav.classList.add("has-active");
}

if (sectionLinks.length) setActiveSection(sectionLinks[0]);

for (const link of sectionLinks) link.addEventListener("click", () => setActiveSection(link));

if ("IntersectionObserver" in window && linkedSections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
      if (!visible) return;
      const active = linkedSections.find(({ section }) => section === visible.target);
      if (active) setActiveSection(active.link);
    },
    { rootMargin: "-32% 0px -58% 0px", threshold: [0, 0.25, 0.5, 0.75] }
  );

  for (const { section } of linkedSections) sectionObserver.observe(section);
}

window.addEventListener("resize", () => {
  const activeLink = sectionLinks.find((link) => link.dataset.active === "true");
  if (activeLink) setActiveSection(activeLink);
}, { passive: true });

const progressLine = document.querySelector(".page-progress");
let progressFrame = 0;

function updateProgress() {
  progressFrame = 0;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  if (progressLine) progressLine.style.setProperty("--page-progress", String(Math.min(1, Math.max(0, progress))));
}

window.addEventListener("scroll", () => {
  if (!progressFrame) progressFrame = window.requestAnimationFrame(updateProgress);
}, { passive: true });

updateProgress();

const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canHover && !reducedMotion) {
  const hero = document.querySelector(".hero");
  const panel = document.querySelector(".dev-panel");

  if (hero && panel) {
    hero.addEventListener("pointermove", (event) => {
      const bounds = hero.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      hero.style.setProperty("--pointer-x", `${x * 100}%`);
      hero.style.setProperty("--pointer-y", `${y * 100}%`);
      panel.style.setProperty("--panel-tilt-x", `${(x - 0.5) * 3}deg`);
      panel.style.setProperty("--panel-tilt-y", `${(0.5 - y) * 2}deg`);
      hero.classList.add("has-pointer");
    });

    hero.addEventListener("pointerleave", () => {
      hero.classList.remove("has-pointer");
      panel.style.removeProperty("--panel-tilt-x");
      panel.style.removeProperty("--panel-tilt-y");
    });
  }

  for (const card of document.querySelectorAll(".project-card")) {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      card.style.setProperty("--spot-x", `${x * 100}%`);
      card.style.setProperty("--spot-y", `${y * 100}%`);
      card.style.setProperty("--tilt-x", `${(x - 0.5) * 2.2}deg`);
      card.style.setProperty("--tilt-y", `${(0.5 - y) * 2.2}deg`);
      card.classList.add("has-pointer");
    });

    card.addEventListener("pointerleave", () => {
      card.classList.remove("has-pointer");
      card.style.removeProperty("--tilt-x");
      card.style.removeProperty("--tilt-y");
    });
  }
}
