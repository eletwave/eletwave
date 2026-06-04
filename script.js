(function () {
  const year = document.querySelector("#year");
  const topbar = document.querySelector(".topbar");
  const menuButton = document.querySelector(".topbar__menu");
  const navLinks = Array.from(document.querySelectorAll(".topbar__nav a"));
  const langButtons = Array.from(document.querySelectorAll("button[data-lang]"));
  const langSwitchers = Array.from(document.querySelectorAll("[data-lang-switcher]"));
  const i18nNodes = Array.from(document.querySelectorAll("[data-i18n]"));
  const metaDescription = document.querySelector('meta[name="description"]');
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const translations = {
    it: {
      title: "ELETWAVE V3 | Impianti elettrici, fotovoltaico e sicurezza",
      description:
        "ELETWAVE installa impianti elettrici, fotovoltaico, wallbox, sicurezza e reti dati per privati e aziende in Friuli Venezia Giulia e Nord Est.",
      "nav.about": "CHI SIAMO",
      "nav.services": "SERVIZI",
      "nav.area": "TERRITORIO",
      "nav.contact": "CONTATTI",
      "nav.quote": "PREVENTIVO",
      "hero.eyebrow": "ELETWAVE • Smart Energy & Security",
      "hero.title": "Installatori di impianti elettrici, fotovoltaico e sicurezza.",
      "hero.body":
        "Progettazione, installazione e manutenzione di impianti elettrici e soluzioni integrate per privati e aziende in FVG.",
      "cta.quote": "Preventivo online",
      "cta.services": "Scopri i servizi",
      "about.eyebrow": "Chi siamo",
      "about.title": "Un referente tecnico semplice, diretto e affidabile.",
      "about.body":
        "Eletwave progetta, installa e mantiene impianti elettrici e soluzioni integrate per energia, sicurezza, automazioni e connettivita. Lavoriamo con attenzione a sicurezza, materiali e conformita, spiegando ogni passaggio in modo chiaro.",
      "services.eyebrow": "Servizi",
      "service.electrical.kicker": "Impianti",
      "service.electrical.title": "Elettrico",
      "service.electrical.body": "Quadri, linee, adeguamenti, verifiche e manutenzioni.",
      "service.solar.kicker": "Energia",
      "service.solar.title": "Fotovoltaico",
      "service.solar.body": "Impianti FV, accumulo, monitoraggio e gestione carichi.",
      "service.wallbox.kicker": "Mobilita",
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
        "Con sede a Romans d'Isonzo, in provincia di Gorizia. Interventi programmati, sopralluoghi e assistenza tecnica per privati e aziende.",
      "brands.eyebrow": "Materiali",
      "brands.title": "Marchi e componenti affidabili.",
      "brands.body": "Scegliamo materiali adatti al progetto, alla durata e alla manutenzione futura.",
      "contact.eyebrow": "Contatti",
      "contact.title": "Parliamo del tuo impianto.",
      "contact.body":
        "Descrivi il progetto o compila il preventivo guidato: ti ricontattiamo con le prime indicazioni.",
      "contact.quote": "Preventivo online",
    },
    en: {
      title: "ELETWAVE V3 | Electrical, solar and security systems",
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
      "brands.eyebrow": "Materials",
      "brands.title": "Reliable brands and components.",
      "brands.body": "We choose materials suited to the project, durability and future maintenance.",
      "contact.eyebrow": "Contact",
      "contact.title": "Let's talk about your system.",
      "contact.body": "Describe the project or fill in the guided quote: we will get back to you with first indications.",
      "contact.quote": "Online quote",
    },
    sl: {
      title: "ELETWAVE V3 | Elektrika, fotovoltaika in varnost",
      description:
        "ELETWAVE namesca elektricne sisteme, fotovoltaiko, wallboxe, varnost in podatkovna omrezja za domove in podjetja v Furlaniji-Julijski krajini.",
      "nav.about": "O NAS",
      "nav.services": "STORITVE",
      "nav.area": "OBMOCJE",
      "nav.contact": "KONTAKT",
      "nav.quote": "PREDRACUN",
      "hero.eyebrow": "ELETWAVE • Smart Energy & Security",
      "hero.title": "Monterji elektricnih, soncnih in varnostnih sistemov.",
      "hero.body": "Nacrtovanje, montaza in vzdrzevanje elektricnih sistemov ter integriranih resitev za domove in podjetja v Furlaniji-Julijski krajini.",
      "cta.quote": "Zahtevaj predracun",
      "cta.services": "Storitve",
      "about.eyebrow": "O nas",
      "about.title": "Preprost, neposreden in zanesljiv tehnicni partner.",
      "about.body":
        "Eletwave nacrtuje, namesca in vzdrzuje elektricne sisteme ter povezane resitve za energijo, varnost, avtomatiko in povezljivost. Delamo jasno, varno in skladno.",
      "services.eyebrow": "Storitve",
      "service.electrical.kicker": "Sistemi",
      "service.electrical.title": "Elektrika",
      "service.electrical.body": "Omarice, linije, nadgradnje, pregledi in vzdrzevanje.",
      "service.solar.kicker": "Energija",
      "service.solar.title": "Fotovoltaika",
      "service.solar.body": "FV sistemi, hranilniki, nadzor in upravljanje porabe.",
      "service.wallbox.kicker": "Mobilnost",
      "service.wallbox.title": "Wallbox",
      "service.wallbox.body": "Domace in poslovno polnjenje z uravnavanjem obremenitev.",
      "service.security.kicker": "Varnost",
      "service.security.title": "Videonadzor",
      "service.security.body": "Kamere, alarmi, senzorji, obvestila in oddaljen nadzor.",
      "service.network.kicker": "Omrezja",
      "service.network.title": "Podatkovna omrezja",
      "service.network.body": "Strukturirano kabliranje, racki, stikala in profesionalni Wi-Fi.",
      "service.smart.kicker": "Smart",
      "service.smart.title": "Avtomatizacija",
      "service.smart.body": "Domotika, dostopi, vrata in pametno upravljanje porabe.",
      "territory.eyebrow": "Obmocje",
      "territory.title": "Furlanija-Julijska krajina in severovzhod.",
      "territory.body": "S sedezem v Romans d'Isonzo, v pokrajini Gorica. Nacrtovani posegi, ogledi in tehnicna podpora za domove in podjetja.",
      "brands.eyebrow": "Materiali",
      "brands.title": "Zanesljive znamke in komponente.",
      "brands.body": "Materiale izbiramo glede na projekt, trajnost in prihodnje vzdrzevanje.",
      "contact.eyebrow": "Kontakt",
      "contact.title": "Pogovorimo se o vasem sistemu.",
      "contact.body": "Opisite projekt ali izpolnite vodeni predracun: odgovorimo s prvimi informacijami.",
      "contact.quote": "Spletni predracun",
    },
  };

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  function setMenu(open) {
    document.body.classList.toggle("is-menu-open", open);
    topbar?.classList.toggle("is-menu-open", open);
    if (menuButton) {
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Chiudi menu" : "Apri menu");
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
      window.localStorage.setItem("eletwave-v3-lang", lang);
    } catch (error) {
      /* storage unavailable */
    }
  }

  function initialLanguage() {
    try {
      const saved = window.localStorage.getItem("eletwave-v3-lang");
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

  navLinks.forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  langButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setLanguage(button.dataset.lang || "it");
      setMenu(false);
    });
  });

  setLanguage(initialLanguage());

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
