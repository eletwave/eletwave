(function () {
  const revealItems = document.querySelectorAll(".reveal");
  const topbar = document.querySelector(".topbar");
  const metaDescription = document.querySelector('meta[name="description"]');
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const yearNode = document.querySelector("#year");
  const topbarNav = document.querySelector(".topbar__nav");
  const navLinks = Array.from(document.querySelectorAll(".topbar__nav a"));
  const topbarMenuButton = document.querySelector(".topbar__menu");
  const languageOrder = ["it", "en", "sl"];
  const langSwitchers = Array.from(document.querySelectorAll(".topbar__lang"));
  const langButtons = Array.from(
    document.querySelectorAll(".topbar__lang-code"),
  );
  const menuLangButtons = Array.from(
    document.querySelectorAll(".topbar__lang--menu .topbar__lang-code"),
  );
  const heroEyebrow = document.querySelector(".hero__eyebrow");
  const heroTitle = document.querySelector(".hero h1");
  const heroDescription = document.querySelector(
    ".hero__content > p:not(.hero__eyebrow)",
  );
  const manifestoEyebrow = document.querySelector("#chi-siamo .eyebrow");
  const manifestoTitle = document.querySelector("#chi-siamo h2");
  const manifestoLead = document.querySelector(".manifesto__lead");
  const whyEyebrow = document.querySelector("#perche-noi .eyebrow");
  const whyTitle = document.querySelector("#perche-noi h2");
  const whyImage = document.querySelector("#perche-noi img");
  const whySection = document.querySelector("#perche-noi");
  const whyItems = Array.from(
    document.querySelectorAll("#perche-noi .why-item"),
  ).map((item) => ({
    el: item,
    title: item.querySelector("h3"),
    body: item.querySelector("p"),
  }));
  const servicesEyebrow = document.querySelector(
    "#servizi .section-head .eyebrow",
  );
  const servicesTitle = document.querySelector("#servizi .section-head h2");
  const serviceCards = Array.from(
    document.querySelectorAll("#servizi .service-feature"),
  ).map((item) => ({
    title: item.querySelector("h3"),
    body: item.querySelector(".service-feature__body > p"),
    bullets: Array.from(item.querySelectorAll(".service-feature__list li")),
  }));
  const coverageAreasTitle = document.querySelector(
    "#dove-operiamo .coverage-areas__title",
  );
  const coverageVisual = document.querySelector(
    "#dove-operiamo .coverage__visual",
  );
  const brandsEyebrow = document.querySelector(
    "#brands .brands-orbit__content .eyebrow",
  );
  const brandsTitle = document.querySelector(
    "#brands .brands-orbit__content h2",
  );
  const brandsBody = document.querySelector(
    "#brands .brands-orbit__content > p:not(.eyebrow):not(.sr-only)",
  );
  const brandsSrOnly = document.querySelector("#brands .sr-only");
  const brandsGrid = document.querySelector(".brands-grid");
  const contactEyebrow = document.querySelector("#contatti .eyebrow");
  const contactTitle = document.querySelector("#contatti h2");
  const contactBody = document.querySelector(
    ".contact__info > p:not(.eyebrow)",
  );
  const contactList = document.querySelector(".contact__info ul");
  const contactSocials = Array.from(
    document.querySelectorAll(".contact__socials a"),
  );
  const floatingWhatsapp = document.querySelector(".floating-wa");
  const footerTagline = document.querySelector(".site-footer p");
  const themedSections = [
    {
      el: document.querySelector("#hero"),
      theme: {
        a: "rgba(255, 47, 94, 0.18)",
        b: "rgba(8, 12, 24, 0.82)",
        c: "rgba(35, 198, 255, 0.16)",
        line: "rgba(255, 255, 255, 0.12)",
      },
    },
    {
      el: document.querySelector("#chi-siamo"),
      theme: {
        a: "rgba(111, 61, 255, 0.16)",
        b: "rgba(15, 20, 34, 0.84)",
        c: "rgba(35, 198, 255, 0.1)",
        line: "rgba(195, 210, 255, 0.12)",
      },
    },
    {
      el: document.querySelector("#perche-noi"),
      theme: {
        a: "rgba(35, 198, 255, 0.16)",
        b: "rgba(9, 14, 24, 0.84)",
        c: "rgba(255, 47, 94, 0.08)",
        line: "rgba(163, 212, 255, 0.12)",
      },
    },
    {
      el: document.querySelector("#servizi"),
      theme: {
        a: "rgba(251, 221, 175, 0.18)",
        b: "rgba(8, 22, 20, 0.86)",
        c: "rgba(109, 87, 50, 0.16)",
        line: "rgba(251, 221, 175, 0.18)",
      },
    },
    {
      el: document.querySelector("#dove-operiamo"),
      theme: {
        a: "rgba(35, 198, 255, 0.16)",
        b: "rgba(8, 12, 22, 0.9)",
        c: "rgba(111, 61, 255, 0.14)",
        line: "rgba(196, 224, 255, 0.14)",
      },
    },
    {
      el: document.querySelector("#brands"),
      theme: {
        a: "rgba(109, 87, 50, 0.18)",
        b: "rgba(8, 15, 15, 0.88)",
        c: "rgba(30, 59, 56, 0.22)",
        line: "rgba(227, 198, 144, 0.18)",
      },
    },
    {
      el: document.querySelector("#contatti"),
      theme: {
        a: "rgba(35, 198, 255, 0.12)",
        b: "rgba(10, 15, 25, 0.86)",
        c: "rgba(111, 61, 255, 0.14)",
        line: "rgba(180, 198, 236, 0.12)",
      },
    },
  ].filter((item) => item.el);
  const translations = {
    it: {
      title:
        "ELETWAVE | Installatori di impianti elettrici, fotovoltaico e sicurezza",
      description:
        "ELETWAVE installa impianti elettrici, fotovoltaico, wallbox, videosorveglianza e reti dati per privati e aziende in FVG.",
      navAria: "Navigazione principale",
      langAria: "Lingua sito",
      langOptions: {
        it: "Italiano",
        en: "English",
        sl: "Sloveno",
      },
      menu: {
        open: "Apri menu",
        close: "Chiudi menu",
      },
      nav: ["HOME", "CHI SIAMO", "PERCHE NOI", "SERVIZI", "CONTATTI"],
      hero: {
        eyebrow: "ELETWAVE • Smart Energy & Security",
        title: "Installatori di impianti elettrici, fotovoltaico e sicurezza.",
        body: "Progettazione, installazione e manutenzione di impianti elettrici e soluzioni integrate per privati e aziende in FVG.",
      },
      manifesto: {
        eyebrow: "Chi siamo",
        title:
          "Competenza tecnica, rapidita di intervento e supporto costante per privati e aziende.",
        lead: "Eletwave è un’impresa artigiana del Friuli Venezia Giulia specializzata in impianti elettrici e soluzioni tecnologiche integrate per privati e aziende. Progettiamo, realizziamo e manteniamo impianti elettrici civili e industriali, impianti fotovoltaici, sistemi di domotica, sicurezza, automazioni e soluzioni per l’efficientamento energetico. Seguiamo ogni cliente in modo diretto e trasparente, dalla consulenza iniziale alla progettazione, fino all’installazione e all’assistenza post-vendita. Ogni intervento è realizzato con attenzione alla sicurezza, alla qualità dei materiali e alla conformità normativa. Operiamo su tutto il territorio del Friuli Venezia Giulia, garantendo professionalità, rapidità di intervento e un rapporto chiaro e affidabile. Eletwave: energia, tecnologia e sicurezza al servizio dei tuoi spazi.",
      },
      why: {
        eyebrow: "Perche noi",
        title: "Un unico partner tecnico per energia, impianti e sicurezza.",
        imageAlt: "Logo Eletwave",
        items: [
          {
            title: "Approccio completo",
            body: "Dalla progettazione al collaudo fino alla manutenzione programmata.",
          },
          {
            title: "Standard elevati",
            body: "Soluzioni a norma, materiali selezionati e attenzione ai dettagli esecutivi.",
          },
          {
            title: "Interventi rapidi",
            body: "Tempi ridotti di attivazione e supporto diretto su guasti e anomalie.",
          },
          {
            title: "Visione smart",
            body: "Integrazione tra fotovoltaico, wallbox, domotica e controllo intelligente.",
          },
        ],
      },
      servicesHead: {
        eyebrow: "Servizi",
        title: "Soluzioni su misura per case, aziende e impianti complessi.",
      },
      services: [
        {
          title: "Impianti elettrici",
          body: "Progettiamo e realizziamo impianti civili e industriali con quadri, linee dedicate e verifiche strumentali per consegne sicure, pulite e gia pronte all'uso.",
          bullets: [
            "Impianti civili, industriali e quadri elettrici",
            "Adeguamenti normativi, collaudi e verifiche a norma",
            "Ricerca guasti, manutenzioni e ampliamenti impianto",
          ],
        },
        {
          title: "FV e accumulo",
          body: "Realizziamo sistemi fotovoltaici completi con batterie e monitoraggio per aumentare l'autoconsumo, ridurre i prelievi e gestire meglio l'energia prodotta.",
          bullets: [
            "Impianti fotovoltaici per casa, azienda e attivita",
            "Sistemi di accumulo e gestione intelligente dei carichi",
            "Monitoraggio produzione e ottimizzazione consumi",
          ],
        },
        {
          title: "Wallbox",
          body: "Installiamo wallbox domestiche e aziendali integrate con l'impianto elettrico e, se presente, con fotovoltaico e accumulo per una ricarica piu efficiente.",
          bullets: [
            "Wallbox AC smart per casa, ufficio e azienda",
            "Bilanciamento carichi e priorita energetica",
            "Configurazione app, accessi e monitoraggio consumi",
          ],
        },
        {
          title: "Videosorveglianza e antifurti",
          body: "Proteggiamo abitazioni, uffici e attivita con telecamere, sensori e centrali antifurto pensate per controllo locale e remoto in tempo reale.",
          bullets: [
            "Telecamere IP, NVR e accesso remoto da app",
            "Antifurti volumetrici, perimetrali e notifiche istantanee",
            "Sirene, sensori e copertura completa degli accessi",
          ],
        },
        {
          title: "Reti",
          body: "Realizziamo infrastrutture dati affidabili per uffici, aziende e abitazioni smart, con cablaggi ordinati e copertura stabile per ogni apparato connesso.",
          bullets: [
            "Cablaggi strutturati, armadi rack e patch panel",
            "Switch, Wi-Fi professionale e segmentazione rete",
            "Reti per videosorveglianza, uffici e sistemi smart",
          ],
        },
      ],
      coverage: {
        areasTitle: "Operativi a",
        mapAria:
          "Mappa del Nord Est Italia con area operativa Eletwave lungo il confine sloveno.",
      },
      brands: {
        eyebrow: "IN GOOD COMPANY",
        title: "Brand e materiali che utilizziamo nei nostri progetti.",
        body: "Selezioniamo marchi affidabili per impianti elettrici, sicurezza, energia e connettivita, cosi ogni installazione parte da una base solida.",
        srOnly:
          "Marchi utilizzati: ABB, BTicino, Eaton, Hikvision, Dahua, Axis, Huawei, BYD, Tesla, Fronius, SMA e SolarEdge.",
        gridAria: "Marchi utilizzati nei progetti Eletwave",
      },
      contact: {
        eyebrow: "Contatti",
        title: "Parliamo del tuo progetto.",
        body: "Operativi in FVG su impianti elettrici, fotovoltaico, automazioni e sicurezza. Risposta rapida via telefono, email o WhatsApp.",
        labels: {
          phone: "Telefono",
          email: "Email",
          area: "Zona operativa",
          vat: "P.IVA",
        },
        areaValue: "FVG",
        socials: ["WhatsApp", "Instagram"],
        floatingWhatsapp: "Apri chat WhatsApp",
      },
      footer: "ELETWAVE. smart energy & security solutions",
    },
    en: {
      title: "ELETWAVE | Electrical, solar and security system installers",
      description:
        "ELETWAVE installs electrical systems, photovoltaic, wallboxes, video surveillance and data networks for homes and businesses across Friuli Venezia Giulia.",
      navAria: "Main navigation",
      langAria: "Site language",
      langOptions: {
        it: "Italian",
        en: "English",
        sl: "Slovenian",
      },
      menu: {
        open: "Open menu",
        close: "Close menu",
      },
      nav: ["HOME", "ABOUT US", "WHY US", "SERVICES", "CONTACT"],
      hero: {
        eyebrow: "ELETWAVE • Smart Energy & Security",
        title: "Electrical, solar and security system installers.",
        body: "Design, installation and maintenance of electrical systems and integrated solutions for homes and businesses across Friuli Venezia Giulia.",
      },
      manifesto: {
        eyebrow: "About us",
        title:
          "Technical expertise, fast response and reliable support for homes and businesses.",
        lead: "Eletwave is a dynamic company specialized in the design, installation and maintenance of electrical systems and integrated technology solutions for homes and businesses. Based in Friuli Venezia Giulia and operating across a wide area, we provide complete services ranging from residential and industrial electrical systems to home automation, security, automation and renewable energy, supporting the client through every stage of the project, from needs assessment to post-installation assistance.",
      },
      why: {
        eyebrow: "Why us",
        title: "One technical partner for energy, systems and security.",
        imageAlt: "Eletwave logo",
        items: [
          {
            title: "Complete approach",
            body: "From design and testing to scheduled maintenance.",
          },
          {
            title: "High standards",
            body: "Compliant solutions, selected materials and attention to execution details.",
          },
          {
            title: "Fast response",
            body: "Short activation times and direct support for faults and anomalies.",
          },
          {
            title: "Smart vision",
            body: "Integration between photovoltaic, wallbox, automation and intelligent control.",
          },
        ],
      },
      servicesHead: {
        eyebrow: "Services",
        title: "Tailored solutions for homes, businesses and complex systems.",
      },
      services: [
        {
          title: "Electrical systems",
          body: "We design and install residential and industrial electrical systems with panels, dedicated lines and instrument testing for safe, clean and ready-to-use delivery.",
          bullets: [
            "Residential, industrial systems and electrical panels",
            "Compliance upgrades, testing and code checks",
            "Fault finding, maintenance and system expansions",
          ],
        },
        {
          title: "PV and storage",
          body: "We build complete photovoltaic systems with batteries and monitoring to increase self-consumption, reduce grid draw and manage produced energy more efficiently.",
          bullets: [
            "Photovoltaic systems for homes, businesses and commercial sites",
            "Battery storage and smart load management",
            "Production monitoring and consumption optimization",
          ],
        },
        {
          title: "Wallbox",
          body: "We install residential and commercial wallboxes integrated with the electrical system and, where available, with photovoltaic and storage for more efficient charging.",
          bullets: [
            "Smart AC wallboxes for homes, offices and businesses",
            "Load balancing and energy priority logic",
            "App setup, access control and consumption monitoring",
          ],
        },
        {
          title: "Video surveillance and alarms",
          body: "We protect homes, offices and businesses with cameras, sensors and alarm panels designed for real-time local and remote control.",
          bullets: [
            "IP cameras, NVRs and remote app access",
            "Volumetric and perimeter alarms with instant alerts",
            "Sirens, sensors and full access-point coverage",
          ],
        },
        {
          title: "Networks",
          body: "We build reliable data infrastructure for offices, businesses and smart homes, with neat cabling and stable coverage for every connected device.",
          bullets: [
            "Structured cabling, racks and patch panels",
            "Switches, professional Wi-Fi and network segmentation",
            "Networks for CCTV, offices and smart systems",
          ],
        },
      ],
      coverage: {
        areasTitle: "Operating in",
        mapAria:
          "Map of North Eastern Italy with Eletwave operational area along the Slovenian border.",
      },
      brands: {
        eyebrow: "IN GOOD COMPANY",
        title: "Brands and materials we use in our projects.",
        body: "We select reliable brands for electrical systems, security, energy and connectivity, so every installation starts from a solid foundation.",
        srOnly:
          "Brands used: ABB, BTicino, Eaton, Hikvision, Dahua, Axis, Huawei, BYD, Tesla, Fronius, SMA and SolarEdge.",
        gridAria: "Brands used in Eletwave projects",
      },
      contact: {
        eyebrow: "Contact",
        title: "Let's talk about your project.",
        body: "Operating across Friuli Venezia Giulia for electrical systems, photovoltaic, automation and security. Fast response by phone, email or WhatsApp.",
        labels: {
          phone: "Phone",
          email: "Email",
          area: "Service area",
          vat: "VAT no.",
        },
        areaValue: "Friuli Venezia Giulia",
        socials: ["WhatsApp", "Instagram"],
        floatingWhatsapp: "Open WhatsApp chat",
      },
      footer: "ELETWAVE. smart energy & security solutions",
    },
  };
  translations.sl = {
    title: "ELETWAVE | Monterji elektricnih, soncnih in varnostnih sistemov",
    description:
      "ELETWAVE namesca elektricne sisteme, fotovoltaiko, wallboxe, videonadzor in podatkovna omrezja za domove in podjetja v Furlaniji-Julijski krajini.",
    navAria: "Glavna navigacija",
    langAria: "Jezik strani",
    langOptions: {
      it: "Italijanscina",
      en: "Anglescina",
      sl: "Slovenscina",
    },
    menu: {
      open: "Odpri meni",
      close: "Zapri meni",
    },
    nav: ["DOMOV", "O NAS", "ZAKAJ MI", "STORITVE", "KONTAKTI"],
    hero: {
      eyebrow: "ELETWAVE • Smart Energy & Security",
      title: "Monterji elektricnih, soncnih in varnostnih sistemov.",
      body: "Nacrtovanje, montaza in vzdrezevanje elektricnih sistemov ter integriranih resitev za zasebnike in podjetja v Furlaniji-Julijski krajini.",
    },
    manifesto: {
      eyebrow: "O nas",
      title:
        "Tehnicna strokovnost, hitri posegi in zanesljiva podpora za zasebnike in podjetja.",
      lead: "Eletwave je dinamicno podjetje, specializirano za nacrtovanje, izvedbo in vzdrezevanje elektricnih sistemov ter integriranih tehnoloskih resitev za zasebnike in podjetja. S sedezem v Furlaniji-Julijski krajini in delovanjem na sirsem obmocju nudimo celovite storitve, od civilnih in industrijskih elektricnih instalacij do varnosti, avtomatizacije in obnovljivih virov, ter spremljamo narocnika v vseh fazah projekta, od analize potreb do podpore po izvedbi.",
    },
    why: {
      eyebrow: "Zakaj mi",
      title: "En sam tehnicni partner za energijo, instalacije in varnost.",
      imageAlt: "Logotip Eletwave",
      items: [
        {
          title: "Celovit pristop",
          body: "Od nacrtovanja in preizkusov do rednega vzdrezevanja.",
        },
        {
          title: "Visoki standardi",
          body: "Skladne resitve, izbrani materiali in pozornost do izvedbenih podrobnosti.",
        },
        {
          title: "Hitri posegi",
          body: "Kratki odzivni casi in neposredna podpora pri napakah in nepravilnostih.",
        },
        {
          title: "Pametna vizija",
          body: "Povezovanje fotovoltaike, wallboxa, avtomatizacije in inteligentnega nadzora.",
        },
      ],
    },
    servicesHead: {
      eyebrow: "Storitve",
      title: "Prilagojene resitve za domove, podjetja in zahtevne sisteme.",
    },
    services: [
      {
        title: "Elektricne instalacije",
        body: "Nacrtujemo in izvajamo civilne ter industrijske elektricne sisteme z omarami, namenskimi linijami in meritvami za varno, cisto in takoj uporabno predajo.",
        bullets: [
          "Civilne in industrijske instalacije ter elektricne omare",
          "Prilagoditve predpisom, preizkusi in meritve skladnosti",
          "Iskanje napak, vzdrezevanje in razsiritve sistema",
        ],
      },
      {
        title: "FV in hranilniki",
        body: "Izvajamo celovite fotovoltaicne sisteme z baterijami in nadzorom za vecjo lastno porabo, manj odvzema iz omrezja in boljsi nadzor proizvedene energije.",
        bullets: [
          "Fotovoltaicni sistemi za dom, podjetje in poslovne objekte",
          "Baterijski hranilniki in pametno upravljanje porabnikov",
          "Spremljanje proizvodnje in optimizacija porabe",
        ],
      },
      {
        title: "Wallbox",
        body: "Namescamo stenske polnilnice za dom in podjetje, povezane z elektricnim sistemom ter po potrebi tudi s fotovoltaiko in hranilniki za ucinkovitejse polnjenje.",
        bullets: [
          "Pametni AC wallboxi za dom, pisarno in podjetje",
          "Uravnotezenje obremenitev in energetske prioritete",
          "Nastavitev aplikacije, dostopov in spremljanje porabe",
        ],
      },
      {
        title: "Videonadzor in alarmi",
        body: "Zascitimo domove, pisarne in podjetja s kamerami, senzorji in alarmnimi centralami za lokalni in oddaljeni nadzor v realnem casu.",
        bullets: [
          "IP kamere, NVR sistemi in oddaljen dostop prek aplikacije",
          "Prostorski in perimeter alarmi s takojsnjimi obvestili",
          "Sirene, senzorji in popolna pokritost vstopnih tock",
        ],
      },
      {
        title: "Omrezja",
        body: "Vzpostavljamo zanesljivo podatkovno infrastrukturo za pisarne, podjetja in pametne domove z urejenim kabliranjem in stabilno povezljivostjo za vsako napravo.",
        bullets: [
          "Strukturirano kabliranje, rack omare in patch paneli",
          "Stikala, profesionalni Wi-Fi in segmentacija omrezja",
          "Omrezja za videonadzor, pisarne in pametne sisteme",
        ],
      },
    ],
    coverage: {
      areasTitle: "Prisotni v",
      mapAria:
        "Zemljevid severovzhodne Italije z oznacenim operativnim obmocjem podjetja Eletwave ob slovenski meji.",
    },
    brands: {
      eyebrow: "V DOBRI DRUZBI",
      title:
        "Blagovne znamke in materiali, ki jih uporabljamo pri nasih projektih.",
      body: "Izbiramo zanesljive znamke za elektricne sisteme, varnost, energijo in povezljivost, da vsaka instalacija temelji na trdni osnovi.",
      srOnly:
        "Uporabljene znamke: ABB, BTicino, Eaton, Hikvision, Dahua, Axis, Huawei, BYD, Tesla, Fronius, SMA in SolarEdge.",
      gridAria: "Znamke, uporabljene v projektih Eletwave",
    },
    contact: {
      eyebrow: "Kontakt",
      title: "Pogovorimo se o vasem projektu.",
      body: "Delujemo v Furlaniji-Julijski krajini za elektricne sisteme, fotovoltaiko, avtomatizacijo in varnost. Hiter odziv po telefonu, e-posti ali WhatsAppu.",
      labels: {
        phone: "Telefon",
        email: "E-posta",
        area: "Obmocje delovanja",
        vat: "Davcna st.",
      },
      areaValue: "Furlanija-Julijska krajina",
      socials: ["WhatsApp", "Instagram"],
      floatingWhatsapp: "Odpri klepet WhatsApp",
    },
    footer: "ELETWAVE. pametna energija in varnostne resitve",
  };
  let activeThemeEl = null;
  let currentLanguage = "it";

  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }

  function isMobileMenuViewport() {
    return window.innerWidth <= 760;
  }

  function setMobileMenuState(open) {
    if (!topbar || !topbarNav || !topbarMenuButton) {
      return;
    }

    const shouldOpen = isMobileMenuViewport() && open;
    const language = translations[currentLanguage] || translations.it;

    topbar.classList.toggle("is-menu-open", shouldOpen);
    topbarMenuButton.setAttribute("aria-expanded", String(shouldOpen));
    topbarMenuButton.setAttribute(
      "aria-label",
      shouldOpen ? language.menu.close : language.menu.open,
    );
    topbarNav.setAttribute(
      "aria-hidden",
      String(isMobileMenuViewport() && !shouldOpen),
    );

    navLinks.forEach((link) => {
      if (isMobileMenuViewport() && !shouldOpen) {
        link.setAttribute("tabindex", "-1");
      } else {
        link.removeAttribute("tabindex");
      }
    });

    menuLangButtons.forEach((button) => {
      if (isMobileMenuViewport() && !shouldOpen) {
        button.setAttribute("tabindex", "-1");
      } else {
        button.removeAttribute("tabindex");
      }
    });
  }

  function applyTopbarTheme(theme) {
    if (!topbar) {
      return;
    }

    topbar.style.setProperty("--nav-a", theme.a);
    topbar.style.setProperty("--nav-b", theme.b);
    topbar.style.setProperty("--nav-c", theme.c);
    topbar.style.setProperty("--nav-line", theme.line);
  }

  function renderContactList(language) {
    if (!contactList) {
      return;
    }

    contactList.innerHTML = [
      "<li><strong>" +
        language.contact.labels.phone +
        ':</strong> <a href="tel:+393930036372">+39 3930036372</a></li>',
      "<li><strong>" +
        language.contact.labels.email +
        ':</strong> <a href="mailto:eletwave@gmail.com">eletwave@gmail.com</a></li>',
      "<li><strong>" +
        language.contact.labels.area +
        ":</strong> " +
        language.contact.areaValue +
        "</li>",
      "<li><strong>" +
        language.contact.labels.vat +
        ":</strong> 01287600314</li>",
    ].join("");
  }

  function applyLanguage(lang) {
    const language = translations[lang] || translations.it;
    currentLanguage = lang;

    document.documentElement.lang = lang;
    document.title = language.title;

    if (metaDescription) {
      metaDescription.setAttribute("content", language.description);
    }

    if (topbarNav) {
      topbarNav.setAttribute("aria-label", language.navAria);
    }

    langSwitchers.forEach((switcher) => {
      switcher.dataset.lang = lang;
      switcher.style.setProperty(
        "--lang-index",
        String(Math.max(languageOrder.indexOf(lang), 0)),
      );
      switcher.setAttribute("aria-label", language.langAria);
    });

    navLinks.forEach((link, index) => {
      if (language.nav[index]) {
        link.textContent = language.nav[index];
      }
    });

    if (topbarMenuButton) {
      topbarMenuButton.setAttribute(
        "aria-label",
        topbar.classList.contains("is-menu-open")
          ? language.menu.close
          : language.menu.open,
      );
    }

    if (heroEyebrow) {
      heroEyebrow.textContent = language.hero.eyebrow;
    }

    if (heroTitle) {
      heroTitle.textContent = language.hero.title;
    }

    if (heroDescription) {
      heroDescription.textContent = language.hero.body;
    }

    if (manifestoEyebrow) {
      manifestoEyebrow.textContent = language.manifesto.eyebrow;
    }

    if (manifestoTitle) {
      manifestoTitle.textContent = language.manifesto.title;
    }

    if (manifestoLead) {
      manifestoLead.textContent = language.manifesto.lead;
    }

    if (whyEyebrow) {
      whyEyebrow.textContent = language.why.eyebrow;
    }

    if (whyTitle) {
      whyTitle.textContent = language.why.title;
    }

    if (whyImage) {
      whyImage.alt = language.why.imageAlt;
    }

    whyItems.forEach((item, index) => {
      const content = language.why.items[index];

      if (!content) {
        return;
      }

      if (item.title) {
        item.title.textContent = content.title;
      }

      if (item.body) {
        item.body.textContent = content.body;
      }
    });

    if (servicesEyebrow) {
      servicesEyebrow.textContent = language.servicesHead.eyebrow;
    }

    if (servicesTitle) {
      servicesTitle.textContent = language.servicesHead.title;
    }

    serviceCards.forEach((card, index) => {
      const content = language.services[index];

      if (!content) {
        return;
      }

      if (card.title) {
        card.title.textContent = content.title;
      }

      if (card.body) {
        card.body.textContent = content.body;
      }

      card.bullets.forEach((bullet, bulletIndex) => {
        if (content.bullets[bulletIndex]) {
          bullet.textContent = content.bullets[bulletIndex];
        }
      });
    });

    if (coverageAreasTitle) {
      coverageAreasTitle.textContent = language.coverage.areasTitle;
    }

    if (coverageVisual) {
      coverageVisual.setAttribute("aria-label", language.coverage.mapAria);
    }

    if (brandsEyebrow) {
      brandsEyebrow.textContent = language.brands.eyebrow;
    }

    if (brandsTitle) {
      brandsTitle.textContent = language.brands.title;
    }

    if (brandsBody) {
      brandsBody.textContent = language.brands.body;
    }

    if (brandsSrOnly) {
      brandsSrOnly.textContent = language.brands.srOnly;
    }

    if (brandsGrid) {
      brandsGrid.setAttribute("aria-label", language.brands.gridAria);
    }

    if (contactEyebrow) {
      contactEyebrow.textContent = language.contact.eyebrow;
    }

    if (contactTitle) {
      contactTitle.textContent = language.contact.title;
    }

    if (contactBody) {
      contactBody.textContent = language.contact.body;
    }

    renderContactList(language);

    contactSocials.forEach((link, index) => {
      if (language.contact.socials[index]) {
        link.textContent = language.contact.socials[index];
      }
    });

    if (floatingWhatsapp) {
      floatingWhatsapp.setAttribute(
        "aria-label",
        language.contact.floatingWhatsapp,
      );
      floatingWhatsapp.setAttribute("title", language.contact.floatingWhatsapp);
    }

    if (footerTagline) {
      footerTagline.textContent = language.footer;
    }

    langButtons.forEach((button) => {
      const isActive = button.dataset.lang === lang;

      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
      button.setAttribute(
        "aria-label",
        language.langOptions[button.dataset.lang] || button.textContent,
      );
    });

    try {
      window.localStorage.setItem("eletwave-lang", lang);
    } catch (error) {
      /* ignore storage errors */
    }
  }

  function getInitialLanguage() {
    try {
      const savedLanguage = window.localStorage.getItem("eletwave-lang");

      if (savedLanguage && translations[savedLanguage]) {
        return savedLanguage;
      }
    } catch (error) {
      /* ignore storage errors */
    }

    return translations[document.documentElement.lang]
      ? document.documentElement.lang
      : "it";
  }

  if (topbar && themedSections.length) {
    applyTopbarTheme(themedSections[0].theme);
  }

  if (langButtons.length) {
    langButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.lang) {
          applyLanguage(button.dataset.lang);
          if (isMobileMenuViewport()) {
            setMobileMenuState(false);
          }
        }
      });
    });
  }

  applyLanguage(getInitialLanguage());
  setMobileMenuState(false);

  if (topbarMenuButton) {
    topbarMenuButton.addEventListener("click", () => {
      setMobileMenuState(
        !(topbar && topbar.classList.contains("is-menu-open")),
      );
    });
  }

  if (navLinks.length) {
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        setMobileMenuState(false);
      });
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMobileMenuState(false);
    }
  });

  document.addEventListener("click", (event) => {
    if (
      !topbar ||
      !topbar.classList.contains("is-menu-open") ||
      !isMobileMenuViewport()
    ) {
      return;
    }

    if (!topbar.contains(event.target)) {
      setMobileMenuState(false);
    }
  });

  if (revealItems.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -36px 0px",
      },
    );

    revealItems.forEach((el) => io.observe(el));
  }

  if (whySection && whyItems.length) {
    whySection.classList.add("has-scroll-motion");
  }

  function updateWhyLogoMotion() {
    if (!whyImage) {
      return;
    }

    if (prefersReducedMotion) {
      whyImage.style.setProperty("--why-logo-shift", "0px");
      whyImage.style.setProperty("--why-logo-opacity", "1");
      whyImage.style.setProperty("--why-logo-scale", "1");
      return;
    }

    const section = whyImage.closest("#perche-noi");

    if (!section) {
      return;
    }

    const rect = section.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 1;
    const totalDistance = Math.max(viewportHeight * 0.76 + rect.height * 1.06, 1);
    const progress = Math.min(
      Math.max((viewportHeight * 0.66 - rect.top) / totalDistance, 0),
      1,
    );

    let shift = 0;
    let opacity = 1;
    let scale = 1;

    if (progress <= 0.44) {
      const enterProgress = progress / 0.44;
      shift = 44 - enterProgress * 44;
      opacity = 0.02 + enterProgress * 0.98;
      scale = 0.28 + enterProgress * 0.72;
    } else if (progress <= 0.74) {
      const settleProgress = (progress - 0.44) / 0.3;
      shift = 0 - settleProgress * 12;
      opacity = 1;
      scale = 1 + settleProgress * 0.025;
    } else {
      const exitProgress = (progress - 0.74) / 0.26;
      shift = -12 - exitProgress * 104;
      opacity = Math.max(0, 1 - exitProgress * 1.02);
      scale = 1.025 - exitProgress * 0.16;
    }

    whyImage.style.setProperty("--why-logo-shift", `${shift.toFixed(1)}px`);
    whyImage.style.setProperty("--why-logo-opacity", opacity.toFixed(3));
    whyImage.style.setProperty("--why-logo-scale", scale.toFixed(3));
  }

  function updateWhyItemsMotion() {
    if (!whySection || !whyItems.length) {
      return;
    }

    if (prefersReducedMotion) {
      whyItems.forEach((item) => {
        item.el.style.setProperty("--why-item-progress", "1");
        item.el.classList.add("is-active");
      });
      return;
    }

    const rect = whySection.getBoundingClientRect();
    const viewportHeight = window.innerHeight || 1;
    const sectionProgress = Math.min(
      Math.max(
        (viewportHeight * 0.64 - rect.top) / Math.max(rect.height, 1),
        0,
      ),
      1,
    );
    const itemStep = 0.19;
    const itemWindow = 0.32;

    whyItems.forEach((item, index) => {
      const itemProgress = Math.min(
        Math.max((sectionProgress - index * itemStep) / itemWindow, 0),
        1,
      );

      item.el.style.setProperty("--why-item-progress", itemProgress.toFixed(3));
      item.el.classList.toggle("is-active", itemProgress >= 0.78);
    });
  }

  function updateScrollState() {
    const y = window.scrollY || 0;

    if (topbar) {
      topbar.classList.toggle("is-scrolled", y > 24);
    }

    if (topbar && themedSections.length) {
      const probeY = Math.max(48, topbar.getBoundingClientRect().height * 0.72);
      const nextTheme =
        themedSections.find((item) => {
          const rect = item.el.getBoundingClientRect();
          return rect.top <= probeY && rect.bottom > probeY;
        }) || themedSections[0];

      if (nextTheme.el !== activeThemeEl) {
        activeThemeEl = nextTheme.el;
        applyTopbarTheme(nextTheme.theme);
      }
    }

    updateWhyLogoMotion();
    updateWhyItemsMotion();
  }

  function updateMenuOnResize() {
    setMobileMenuState(topbar && topbar.classList.contains("is-menu-open"));
  }

  let scrollTicking = false;

  function scheduleScrollState() {
    if (scrollTicking) {
      return;
    }

    scrollTicking = true;
    window.requestAnimationFrame(() => {
      scrollTicking = false;
      updateScrollState();
    });
  }

  window.addEventListener("scroll", scheduleScrollState, { passive: true });
  window.addEventListener("resize", updateScrollState);
  window.addEventListener("resize", updateMenuOnResize);
  updateScrollState();
  updateMenuOnResize();
})();
