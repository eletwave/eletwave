(function () {
  const year = document.querySelector("#year");
  const topbar = document.querySelector(".topbar");
  const menuButton = document.querySelector(".topbar__menu");
  const navLinks = Array.from(document.querySelectorAll(".topbar__nav a"));
  const langButtons = Array.from(document.querySelectorAll("button[data-lang]"));
  const langSwitchers = Array.from(document.querySelectorAll("[data-lang-switcher]"));
  const i18nNodes = Array.from(document.querySelectorAll("[data-i18n]"));
  const metaDescription = document.querySelector('meta[name="description"]');
  const mobileMenu = window.matchMedia("(max-width: 860px)");
  const pageRegions = Array.from(document.querySelectorAll("main, footer"));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const translations = {
    it: {
      title: "ELETWAVE | Impianti elettrici, fotovoltaico e sicurezza",
      description:
        "ELETWAVE installa impianti elettrici, fotovoltaico, wallbox, sicurezza e reti dati per privati e aziende in Friuli Venezia Giulia e Nord Est.",
      "nav.about": "CHI SIAMO",
      "nav.services": "SERVIZI",
      "nav.area": "TERRITORIO",
      "nav.contact": "CONTATTI",
      "nav.quote": "PREVENTIVO",
      "hero.eyebrow": "ELETWAVE • Smart Energy & Security",
      "hero.title": "Installazioni di impianti elettrici, fotovoltaico e sicurezza.",
      "hero.body":
        "Progettazione, installazione e manutenzione per privati e aziende in FVG.",
      "cta.quote": "Preventivo online",
      "cta.services": "Scopri i servizi",
      "about.eyebrow": "Chi siamo",
      "about.title": "Un referente tecnico semplice, diretto e affidabile.",
      "about.body":
        "Eletwave è una realtà giovane che lavora nel settore elettrico con un approccio pratico e preciso. Seguiamo interventi su impianti elettrici, fotovoltaico, sicurezza, automazioni e tecnologie per la casa e le attività, cercando sempre la soluzione più adatta al contesto. Il nostro modo di lavorare è semplice: capire bene il lavoro, spiegare cosa conviene fare e realizzarlo in modo ordinato, sicuro e professionale.",
      "services.eyebrow": "Servizi",
      "service.electrical.kicker": "Impianti",
      "service.electrical.title": "Elettrico",
      "service.electrical.body": "Quadri, linee, adeguamenti, verifiche e manutenzioni.",
      "service.solar.kicker": "Energia",
      "service.solar.title": "Fotovoltaico",
      "service.solar.body": "Impianti FV, accumulo, monitoraggio e gestione carichi.",
      "service.wallbox.kicker": "Mobilità",
      "service.wallbox.title": "Wallbox",
      "service.wallbox.body": "Ricarica domestica e aziendale con bilanciamento dei carichi.",
      "service.security.kicker": "Sicurezza",
      "service.security.title": "Videosorveglianza",
      "service.security.body": "Telecamere, antifurti, sensori, notifiche e controllo remoto.",
      "service.network.kicker": "Reti",
      "service.network.title": "Reti dati",
      "service.network.body": "Cablaggio strutturato, rack, switch e Wi-Fi professionale.",
      "service.smart.kicker": "Smart",
      "service.smart.title": "Automazioni",
      "service.smart.body": "Domotica, accessi, cancelli e gestione intelligente dei consumi.",
      "territory.eyebrow": "Territorio",
      "territory.title": "Friuli Venezia Giulia e Nord Est.",
      "territory.body":
        "Con sede a Romans d'Isonzo, in provincia di Gorizia. Operiamo principalmente in Friuli Venezia Giulia. Per interventi strutturati, installazioni complete o lavori programmati, valutiamo anche spostamenti fuori zona in base alle esigenze del cliente e al tipo di lavoro richiesto.",
      "brands.eyebrow": "In good company",
      "brands.title": "Brand e materiali che utilizziamo nei nostri progetti.",
      "brands.body": "Selezioniamo marchi affidabili per impianti elettrici, sicurezza, energia e connettività, così ogni installazione parte da una base solida.",
      "contact.eyebrow": "Contatti",
      "contact.title": "Parliamo del tuo impianto.",
      "contact.body":
        "Descrivi il progetto o compila il preventivo guidato: ti ricontattiamo con le prime indicazioni.",
      "contact.quote": "Preventivo online",
      "footer.location": "Sede a Romans d’Isonzo (GO)",
      "footer.tax": "P. IVA / C.F. 01287600314 · REA GO-217192",
      "footer.privacy": "Privacy Policy",
      "footer.cookie": "Cookie Policy",
    },
    en: {
      title: "ELETWAVE | Electrical, solar and security systems",
      description:
        "ELETWAVE installs electrical systems, solar, wallboxes, security and data networks for homes and businesses in Friuli Venezia Giulia and North East Italy.",
      "nav.about": "ABOUT US",
      "nav.services": "SERVICES",
      "nav.area": "AREA",
      "nav.contact": "CONTACT",
      "nav.quote": "QUOTE",
      "hero.eyebrow": "ELETWAVE • Smart Energy & Security",
      "hero.title": "Electrical, solar and security system installers.",
      "hero.body": "Design, installation and maintenance of electrical systems and integrated solutions for homes and businesses across Friuli Venezia Giulia.",
      "cta.quote": "Request a quote",
      "cta.services": "See services",
      "about.eyebrow": "About",
      "about.title": "A simple, direct and reliable technical contact.",
      "about.body":
        "Eletwave designs, installs and maintains electrical systems and integrated solutions for energy, security, automation and connectivity. We focus on safety, materials and compliance, explaining every step clearly.",
      "services.eyebrow": "Services",
      "service.electrical.kicker": "Systems",
      "service.electrical.title": "Electrical",
      "service.electrical.body": "Panels, lines, upgrades, checks and maintenance.",
      "service.solar.kicker": "Energy",
      "service.solar.title": "Solar",
      "service.solar.body": "PV systems, storage, monitoring and load management.",
      "service.wallbox.kicker": "Mobility",
      "service.wallbox.title": "Wallbox",
      "service.wallbox.body": "Home and business charging with load balancing.",
      "service.security.kicker": "Security",
      "service.security.title": "CCTV",
      "service.security.body": "Cameras, alarms, sensors, notifications and remote control.",
      "service.network.kicker": "Networks",
      "service.network.title": "Data networks",
      "service.network.body": "Structured cabling, racks, switches and professional Wi-Fi.",
      "service.smart.kicker": "Smart",
      "service.smart.title": "Automation",
      "service.smart.body": "Home automation, access, gates and intelligent consumption control.",
      "territory.eyebrow": "Area",
      "territory.title": "Friuli Venezia Giulia and North East Italy.",
      "territory.body": "Based in Romans d'Isonzo, in the province of Gorizia. Scheduled work, site surveys and technical support for homes and businesses.",
      "brands.eyebrow": "In good company",
      "brands.title": "Brands and materials we use in our projects.",
      "brands.body": "We select reliable brands for electrical systems, security, energy and connectivity, giving every installation a solid foundation.",
      "contact.eyebrow": "Contact",
      "contact.title": "Let's talk about your system.",
      "contact.body": "Describe the project or fill in the guided quote: we will get back to you with first indications.",
      "contact.quote": "Online quote",
      "footer.location": "Based in Romans d’Isonzo (GO), Italy",
      "footer.tax": "VAT / Tax ID 01287600314 · REA GO-217192",
      "footer.privacy": "Privacy Policy",
      "footer.cookie": "Cookie Policy",
    },
    sl: {
      title: "ELETWAVE | Elektrika, fotovoltaika in varnost",
      description:
        "ELETWAVE namešča električne sisteme, fotovoltaiko, wallboxe, varnost in podatkovna omrežja za domove in podjetja v Furlaniji-Julijski krajini.",
      "nav.about": "O NAS",
      "nav.services": "STORITVE",
      "nav.area": "OBMOČJE",
      "nav.contact": "KONTAKT",
      "nav.quote": "PREDRAČUN",
      "hero.eyebrow": "ELETWAVE • Smart Energy & Security",
      "hero.title": "Monterji električnih, sončnih in varnostnih sistemov.",
      "hero.body": "Načrtovanje, montaža in vzdrževanje električnih sistemov ter integriranih rešitev za domove in podjetja v Furlaniji-Julijski krajini.",
      "cta.quote": "Zahtevaj predračun",
      "cta.services": "Storitve",
      "about.eyebrow": "O nas",
      "about.title": "Preprost, neposreden in zanesljiv tehnični partner.",
      "about.body":
        "Eletwave načrtuje, namešča in vzdržuje električne sisteme ter povezane rešitve za energijo, varnost, avtomatiko in povezljivost. Delamo jasno, varno in skladno.",
      "services.eyebrow": "Storitve",
      "service.electrical.kicker": "Sistemi",
      "service.electrical.title": "Elektrika",
      "service.electrical.body": "Omarice, linije, nadgradnje, pregledi in vzdrževanje.",
      "service.solar.kicker": "Energija",
      "service.solar.title": "Fotovoltaika",
      "service.solar.body": "FV sistemi, hranilniki, nadzor in upravljanje porabe.",
      "service.wallbox.kicker": "Mobilnost",
      "service.wallbox.title": "Wallbox",
      "service.wallbox.body": "Domače in poslovno polnjenje z uravnavanjem obremenitev.",
      "service.security.kicker": "Varnost",
      "service.security.title": "Videonadzor",
      "service.security.body": "Kamere, alarmi, senzorji, obvestila in oddaljen nadzor.",
      "service.network.kicker": "Omrežja",
      "service.network.title": "Podatkovna omrežja",
      "service.network.body": "Strukturirano kabliranje, racki, stikala in profesionalni Wi-Fi.",
      "service.smart.kicker": "Smart",
      "service.smart.title": "Avtomatizacija",
      "service.smart.body": "Domotika, dostopi, vrata in pametno upravljanje porabe.",
      "territory.eyebrow": "Območje",
      "territory.title": "Furlanija-Julijska krajina in severovzhod.",
      "territory.body": "S sedežem v Romans d'Isonzo, v pokrajini Gorica. Načrtovani posegi, ogledi in tehnična podpora za domove in podjetja.",
      "brands.eyebrow": "In good company",
      "brands.title": "Znamke in materiali, ki jih uporabljamo pri naših projektih.",
      "brands.body": "Izbiramo zanesljive znamke za električne sisteme, varnost, energijo in povezljivost, da ima vsaka namestitev trdne temelje.",
      "contact.eyebrow": "Kontakt",
      "contact.title": "Pogovorimo se o vašem sistemu.",
      "contact.body": "Opišite projekt ali izpolnite vodeni predračun: odgovorimo s prvimi informacijami.",
      "contact.quote": "Spletni predračun",
      "footer.location": "Sedež v Romans d’Isonzo (GO), Italija",
      "footer.tax": "ID za DDV / davčna št. 01287600314 · REA GO-217192",
      "footer.privacy": "Pravilnik o zasebnosti",
      "footer.cookie": "Pravilnik o piškotkih",
    },
  };

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  function setMenu(open) {
    const shouldOpen = Boolean(open && mobileMenu.matches);
    document.body.classList.toggle("is-menu-open", shouldOpen);
    topbar?.classList.toggle("is-menu-open", shouldOpen);
    document.querySelector("#topbar-nav")?.toggleAttribute("inert", mobileMenu.matches && !shouldOpen);
    pageRegions.forEach((region) => region.toggleAttribute("inert", shouldOpen));
    if (menuButton) {
      menuButton.setAttribute("aria-expanded", String(shouldOpen));
      menuButton.setAttribute("aria-label", shouldOpen ? "Chiudi menu" : "Apri menu");
    }
  }

  function setLanguage(lang) {
    const dictionary = translations[lang] || translations.it;

    document.documentElement.lang = lang;
    document.title = dictionary.title;

    if (metaDescription) {
      metaDescription.setAttribute("content", dictionary.description);
    }

    i18nNodes.forEach((node) => {
      const key = node.dataset.i18n;
      if (dictionary[key]) {
        node.textContent = dictionary[key];
      }
    });

    langSwitchers.forEach((switcher) => {
      const order = ["it", "en", "sl"];
      switcher.style.setProperty("--lang-index", String(Math.max(order.indexOf(lang), 0)));
    });

    langButtons.forEach((button) => {
      const active = button.dataset.lang === lang;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    try {
      window.localStorage.setItem("eletwave-lang", lang);
    } catch (error) {
      /* storage unavailable */
    }
  }

  function initialLanguage() {
    try {
      const saved =
        window.localStorage.getItem("eletwave-lang") ||
        window.localStorage.getItem("eletwave-v3-lang");
      if (saved && translations[saved]) {
        return saved;
      }
    } catch (error) {
      /* storage unavailable */
    }
    return "it";
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

  navLinks.forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  langButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setLanguage(button.dataset.lang || "it");
      setMenu(false);
    });
  });

  setMenu(false);
  if (i18nNodes.length > 0) {
    setLanguage(initialLanguage());
  }

  const revealItems = document.querySelectorAll(".reveal");

  if (reducedMotion) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14,
      rootMargin: "0px 0px -32px 0px",
    },
  );

  revealItems.forEach((item) => observer.observe(item));
})();
