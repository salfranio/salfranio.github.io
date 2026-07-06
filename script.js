const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

const links = [...document.querySelectorAll(".nav a")];
const sections = links
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const active = `.nav a[href="#${entry.target.id}"]`;
      links.forEach((link) => link.removeAttribute("aria-current"));
      document.querySelector(active)?.setAttribute("aria-current", "page");
    }
  },
  { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 },
);

sections.forEach((section) => observer.observe(section));
