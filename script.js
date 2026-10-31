const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const buttons = [...document.querySelectorAll("[data-preview]")];
for (const [index, button] of buttons.entries()) {
  button.addEventListener("click", () => {
    for (const item of buttons)
      item.setAttribute("aria-pressed", String(item === button));
    const id = button.dataset.preview;
    const image = document.getElementById("preview-image");
    image.src = `assets/${id}.png`;
    image.alt = `${button.textContent.replace(/^\d+/, "").trim()} actual application interface`;
    document.getElementById("preview-link").href = `demos/${id}/`;
    document.getElementById("preview-count").textContent = `0${index + 1} / 03`;
    if (!reduced)
      image.animate(
        [
          { opacity: 0.35, transform: "translateY(6px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        { duration: 300, easing: "ease-out" },
      );
  });
}
let pending = false;
function update() {
  pending = false;
  const total = document.documentElement.scrollHeight - innerHeight;
  document.documentElement.style.setProperty(
    "--scroll",
    String(total > 0 ? scrollY / total : 0),
  );
  const sections = ["work", "background", "contact"];
  const current = sections
    .filter(
      (id) =>
        document.getElementById(id).getBoundingClientRect().top <
        innerHeight * 0.4,
    )
    .at(-1);
  for (const link of document.querySelectorAll(
    '.site-header nav a[href^="#"]',
  )) {
    if (link.hash === `#${current}`)
      link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
}
window.addEventListener(
  "scroll",
  () => {
    if (!pending) {
      pending = true;
      requestAnimationFrame(update);
    }
  },
  { passive: true },
);
update();
if (!reduced && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("enter");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.08 },
  );
  for (const item of document.querySelectorAll(
    ".project-copy,.experience,.toolkit",
  ))
    observer.observe(item);
}
