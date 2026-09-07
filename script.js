(function () {
  const year = document.querySelector("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  const topbar = document.querySelector(".topbar");
  const menuButton = document.querySelector(".topbar__menu");
  const nav = document.querySelector("#topbar-nav");
  const mobileMenu = window.matchMedia("(max-width: 1080px)");
  const pageRegions = Array.from(document.querySelectorAll("main, footer"));
  const labels = {
    it: ["Apri menu", "Chiudi menu"],
    en: ["Open menu", "Close menu"],
    sl: ["Odpri meni", "Zapri meni"],
  }[document.documentElement.lang] || ["Apri menu", "Chiudi menu"];

  function setMenu(open) {
    const shouldOpen = Boolean(open && mobileMenu.matches && menuButton);
    document.body.classList.toggle("is-menu-open", shouldOpen);
    topbar?.classList.toggle("is-menu-open", shouldOpen);
    nav?.toggleAttribute("inert", mobileMenu.matches && !shouldOpen);
    pageRegions.forEach((region) => region.toggleAttribute("inert", shouldOpen));
    menuButton?.setAttribute("aria-expanded", String(shouldOpen));
    menuButton?.setAttribute("aria-label", labels[Number(shouldOpen)]);
  }

  menuButton?.addEventListener("click", () => {
    setMenu(!document.body.classList.contains("is-menu-open"));
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.body.classList.contains("is-menu-open")) {
      setMenu(false);
      menuButton?.focus();
    }
  });
  mobileMenu.addEventListener("change", () => setMenu(false));
  nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      setMenu(false);
      if (link.hash && link.pathname === location.pathname) {
        const section = document.getElementById(link.hash.slice(1));
        if (section) {
          section.tabIndex = -1;
          section.focus({ preventScroll: true });
        }
      }
    });
  });
  document.querySelectorAll("[data-lang]").forEach((link) => {
    link.addEventListener("click", () => {
      if (location.hash) link.hash = location.hash;
    });
  });
  setMenu(false);

  const revealItems = document.querySelectorAll(".reveal");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion || !("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-in-view", entry.isIntersecting);
      if (entry.isIntersecting) {
        entry.target.classList.remove("is-pending");
        entry.target.classList.add("is-visible");
        if (!entry.target.classList.contains("brands-orbit")) observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  revealItems.forEach((item) => {
    if (item.getBoundingClientRect().top > window.innerHeight) item.classList.add("is-pending");
    observer.observe(item);
  });
})();
