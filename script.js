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
