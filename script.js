const revealItems = document.querySelectorAll("[data-reveal]");

document.documentElement.classList.add("js");

for (const item of revealItems) {
  const delay = Number(item.dataset.delay || 0);
  item.style.setProperty("--reveal-delay", `${delay}ms`);
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
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

  for (const item of revealItems) {
    observer.observe(item);
  }
} else {
  for (const item of revealItems) {
    item.classList.add("is-visible");
  }
}

const sectionLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
const linkedSections = sectionLinks
  .map((link) => ({ link, section: document.querySelector(link.getAttribute("href")) }))
  .filter(({ section }) => section);

for (const { link } of linkedSections) {
  link.addEventListener("click", () => {
    for (const item of sectionLinks) item.removeAttribute("data-active");
    link.setAttribute("data-active", "true");
  });
}

if ("IntersectionObserver" in window && linkedSections.length) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
      if (!visible) return;
      for (const { link, section } of linkedSections) {
        if (section === visible.target) {
          link.setAttribute("data-active", "true");
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("data-active");
          link.removeAttribute("aria-current");
        }
      }
    },
    { rootMargin: "-32% 0px -58% 0px", threshold: [0, 0.25, 0.5, 0.75] }
  );

  for (const { section } of linkedSections) sectionObserver.observe(section);
}
