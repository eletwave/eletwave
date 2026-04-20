(function () {
  const revealItems = document.querySelectorAll(".reveal");
  const topbar = document.querySelector(".topbar");
  const metaDescription = document.querySelector('meta[name="description"]');
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const yearNode = document.querySelector("#year");
  const topbarNav = document.querySelector(".topbar__nav");
  const topbarBrand = document.querySelector(".topbar__brand");
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
  const presenceSection = document.querySelector("#presenza-online");
  const googleTitle = presenceSection
    ? presenceSection.querySelector("[data-google-title]")
    : null;
  const googleChip = presenceSection
    ? presenceSection.querySelector("[data-google-chip]")
    : null;
  const googleSummary = presenceSection
    ? presenceSection.querySelector("[data-google-summary]")
    : null;
  const googleRating = presenceSection
    ? presenceSection.querySelector("[data-google-rating]")
    : null;
  const googleReviewCount = presenceSection
    ? presenceSection.querySelector("[data-google-review-count]")
    : null;
  const googleStatus = presenceSection
    ? presenceSection.querySelector("[data-google-status]")
    : null;
  const googleMeta = presenceSection
    ? presenceSection.querySelector("[data-google-meta]")
    : null;
  const googleProfileLink = presenceSection
    ? presenceSection.querySelector("[data-google-profile-link]")
    : null;
  const googleReviewLink = presenceSection
    ? presenceSection.querySelector("[data-google-review-link]")
    : null;
  const googleNote = presenceSection
    ? presenceSection.querySelector("[data-google-note]")
    : null;
  const googleReviewsGrid = presenceSection
    ? presenceSection.querySelector("[data-google-reviews]")
    : null;
  const googleReviewsAction = presenceSection
    ? presenceSection.querySelector("[data-google-reviews-action]")
    : null;
  const googleReviewsNote = presenceSection
    ? presenceSection.querySelector("[data-google-reviews-note]")
    : null;
  const instagramMeta = presenceSection
    ? presenceSection.querySelector("[data-instagram-meta]")
    : null;
  const instagramFeed = presenceSection
    ? presenceSection.querySelector("[data-instagram-feed]")
    : null;
  const instagramProfileLink = presenceSection
    ? presenceSection.querySelector("[data-instagram-profile-link]")
    : null;
  const instagramPostsLink = presenceSection
    ? presenceSection.querySelector("[data-instagram-posts-link]")
    : null;
  const instagramNote = presenceSection
    ? presenceSection.querySelector("[data-instagram-note]")
    : null;
  const presenceEyebrow = presenceSection
    ? presenceSection.querySelector("[data-presence-eyebrow]")
    : null;
  const presenceTitle = presenceSection
    ? presenceSection.querySelector("[data-presence-title]")
    : null;
  const googleKicker = presenceSection
    ? presenceSection.querySelector("[data-google-kicker]")
    : null;
  const googleRatingLabel = presenceSection
    ? presenceSection.querySelector('[data-google-stat-label="rating"]')
    : null;
  const googleReviewsLabel = presenceSection
    ? presenceSection.querySelector('[data-google-stat-label="reviews"]')
    : null;
  const googleStatusLabel = presenceSection
    ? presenceSection.querySelector('[data-google-stat-label="status"]')
    : null;
  const googleProfileCta = presenceSection
    ? presenceSection.querySelector("[data-google-profile-cta]")
    : null;
  const googleReviewCta = presenceSection
    ? presenceSection.querySelector("[data-google-review-cta]")
    : null;
  const googleReviewsKicker = presenceSection
    ? presenceSection.querySelector("[data-google-reviews-kicker]")
    : null;
  const googleReviewsTitle = presenceSection
    ? presenceSection.querySelector("[data-google-reviews-title]")
    : null;
  const googleReviewsCta = presenceSection
    ? presenceSection.querySelector("[data-google-reviews-cta]")
    : null;
  const instagramKicker = presenceSection
    ? presenceSection.querySelector("[data-instagram-kicker]")
    : null;
  const instagramTitle = presenceSection
    ? presenceSection.querySelector("[data-instagram-title]")
    : null;
  const instagramChip = presenceSection
    ? presenceSection.querySelector("[data-instagram-chip]")
    : null;
  const instagramLead = presenceSection
    ? presenceSection.querySelector("[data-instagram-lead]")
    : null;
  const instagramProfileCta = presenceSection
    ? presenceSection.querySelector("[data-instagram-profile-cta]")
    : null;
  const instagramPostsCta = presenceSection
    ? presenceSection.querySelector("[data-instagram-posts-cta]")
    : null;
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
      el: document.querySelector("#presenza-online"),
      theme: {
        a: "rgba(35, 198, 255, 0.14)",
        b: "rgba(10, 15, 26, 0.9)",
        c: "rgba(255, 47, 94, 0.12)",
        line: "rgba(188, 207, 245, 0.14)",
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
      nav: ["CHI SIAMO", "PERCHE NOI", "SERVIZI", "CONTATTI"],
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
      presence: {
        eyebrow: "Presenza online",
        title:
          "Google Business Profile, Instagram e recensioni sempre aggiornati.",
        google: {
          kicker: "Google Business Profile",
          summaryFallback:
            "Profilo attivita, reputazione online e link rapidi in un unico punto, integrati nello stile del sito.",
          ratingLabel: "Valutazione media",
          reviewsLabel: "Recensioni Google",
          statusLabel: "Stato profilo",
          pendingStatus: "In setup",
          chipServiceArea: "Service area business",
          chipProfile: "Profilo su Google",
          metaPending:
            "Profilo owner e recensioni vengono sincronizzati dal backend dedicato, senza esporre chiavi nel frontend.",
          metaNoAddress: "Attivita senza indirizzo pubblico",
          metaWebsite: "Sito collegato",
          metaPlaceId: "Place ID disponibile",
          metaSynced:
            "Dati sincronizzati automaticamente dal profilo Google Business.",
          profileCta: "Apri profilo",
          reviewCta: "Lascia una recensione",
          notePending:
            "In attesa del collegamento al profilo Google Business.",
          noteConnected:
            "Collegamento attivo. Dati e recensioni vengono aggiornati automaticamente dal backend.",
          noteConfig:
            "Configura una sorgente dati in site-config.js per attivare Google Business Profile.",
          noteErrorPrefix: "Google Business non raggiungibile: ",
          noteErrorFallback: "errore sconosciuto",
          reviewsKicker: "Recensioni Google",
          reviewsTitle:
            "Feedback verificati, senza widget esterni invasivi.",
          reviewsCta: "Vedi tutte",
          reviewsEmptyTitle: "Nessuna recensione disponibile",
          reviewsEmptyBody:
            "Le recensioni compariranno qui non appena il profilo Google sara collegato in modo completo.",
          reviewsConfigNote:
            "Il layout e pronto. Le recensioni appariranno qui appena i file dati verranno sincronizzati.",
          reviewsConnectedNote:
            "Le recensioni mostrano i contenuti piu recenti ricevuti sulla scheda Google.",
          reviewsWaitingNote:
            "La scheda e collegata. Le recensioni compariranno qui quando saranno disponibili.",
          reviewsErrorNote:
            "Il layout resta attivo, ma i dati Google arriveranno solo dopo il completamento della configurazione esterna.",
          authorFallback: "Cliente Google",
          bodyFallback: "Recensione pubblicata senza testo visibile.",
          replyLabel: "Risposta Eletwave",
          statusOpen: "Attivo",
          statusPaused: "Pausa",
          statusClosed: "Chiuso",
          statusServiceArea: "Area servita",
          statusConnected: "Connesso",
        },
        instagram: {
          kicker: "Instagram business",
          title: "Ultimi post dal profilo @eletwave.",
          chip: "Feed automatico",
          lead:
            "I contenuti vengono caricati automaticamente dal profilo business e restano navigabili senza uscire dal linguaggio visivo del sito.",
          metaPending:
            "Profilo business pronto al collegamento. Appena la sincronizzazione sara attiva, qui compariranno gli ultimi post reali.",
          profileCta: "Apri profilo",
          postsCta: "Vedi tutti i post",
          notePending: "In attesa del collegamento all'API Instagram.",
          noteConnected:
            "Il feed mostra gli ultimi contenuti disponibili dal profilo Instagram business.",
          noteWaiting:
            "Il profilo e collegato, ma non ci sono ancora contenuti da mostrare nel feed.",
          noteConfig:
            "Configura una sorgente dati in site-config.js per attivare il feed Instagram automatico.",
          noteErrorPrefix: "Instagram non raggiungibile: ",
          noteErrorFallback: "errore sconosciuto",
          emptyWaitingBody:
            "I post compariranno qui appena il profilo Instagram sara collegato alla sincronizzazione dati.",
          emptyConfigBody:
            "Il layout e gia pronto. Appena colleghi la sorgente dati, qui compariranno gli ultimi post reali.",
          emptyUnavailableBody:
            "Il profilo Instagram e gia linkato, ma il feed automatico non e ancora disponibile.",
          feedAutoLabel: "Feed automatico collegato",
          publishedPostsLabel: "post pubblicati",
          syncActiveLabel: "sincronizzazione automatica attiva",
          typeLabels: {
            IMAGE: "Post",
            VIDEO: "Video",
            CAROUSEL_ALBUM: "Carousel",
            REELS: "Reel",
          },
          postFallback:
            "Apri il post per vedere il contenuto completo su Instagram.",
        },
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
      nav: ["ABOUT US", "WHY US", "SERVICES", "CONTACT"],
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
      presence: {
        eyebrow: "Online presence",
        title:
          "Google Business Profile, Instagram and reviews always kept up to date.",
        google: {
          kicker: "Google Business Profile",
          summaryFallback:
            "Business profile, online reputation and quick links collected in one place, styled to match the site.",
          ratingLabel: "Average rating",
          reviewsLabel: "Google reviews",
          statusLabel: "Profile status",
          pendingStatus: "In setup",
          chipServiceArea: "Service area business",
          chipProfile: "Google profile",
          metaPending:
            "Owner profile and reviews are synced from the dedicated backend without exposing keys in the frontend.",
          metaNoAddress: "Business without public address",
          metaWebsite: "Website connected",
          metaPlaceId: "Place ID available",
          metaSynced:
            "Data synced automatically from the Google Business Profile.",
          profileCta: "Open profile",
          reviewCta: "Leave a review",
          notePending: "Waiting for the Google Business Profile connection.",
          noteConnected:
            "Connection active. Data and reviews are updated automatically from the backend.",
          noteConfig:
            "Configure a data source in site-config.js to enable Google Business Profile.",
          noteErrorPrefix: "Google Business unavailable: ",
          noteErrorFallback: "unknown error",
          reviewsKicker: "Google reviews",
          reviewsTitle:
            "Verified feedback without intrusive third-party widgets.",
          reviewsCta: "See all",
          reviewsEmptyTitle: "No reviews available",
          reviewsEmptyBody:
            "Reviews will appear here as soon as the Google profile is fully connected.",
          reviewsConfigNote:
            "The layout is ready. Reviews will appear here as soon as the data files are synced.",
          reviewsConnectedNote:
            "The reviews show the most recent feedback received on the Google listing.",
          reviewsWaitingNote:
            "The listing is connected. Reviews will appear here when they become available.",
          reviewsErrorNote:
            "The layout remains active, but Google data will arrive only after the external setup is completed.",
          authorFallback: "Google customer",
          bodyFallback: "Review published without visible text.",
          replyLabel: "Reply from Eletwave",
          statusOpen: "Active",
          statusPaused: "Paused",
          statusClosed: "Closed",
          statusServiceArea: "Service area",
          statusConnected: "Connected",
        },
        instagram: {
          kicker: "Instagram business",
          title: "Latest posts from @eletwave.",
          chip: "Automatic feed",
          lead:
            "Content is loaded automatically from the business profile and stays within the visual language of the site.",
          metaPending:
            "Business profile ready to be connected. As soon as sync is active, the latest real posts will appear here.",
          profileCta: "Open profile",
          postsCta: "View all posts",
          notePending: "Waiting for the Instagram API connection.",
          noteConnected:
            "The feed shows the latest content available from the Instagram business profile.",
          noteWaiting:
            "The profile is connected, but there is no content to show in the feed yet.",
          noteConfig:
            "Configure a data source in site-config.js to enable the automatic Instagram feed.",
          noteErrorPrefix: "Instagram unavailable: ",
          noteErrorFallback: "unknown error",
          emptyWaitingBody:
            "Posts will appear here as soon as the Instagram profile is connected to data sync.",
          emptyConfigBody:
            "The layout is already ready. As soon as you connect the data source, the latest real posts will appear here.",
          emptyUnavailableBody:
            "The Instagram profile is already linked, but the automatic feed is not available yet.",
          feedAutoLabel: "Automatic feed connected",
          publishedPostsLabel: "posts published",
          syncActiveLabel: "automatic sync active",
          typeLabels: {
            IMAGE: "Post",
            VIDEO: "Video",
            CAROUSEL_ALBUM: "Carousel",
            REELS: "Reel",
          },
          postFallback: "Open the post to view the full content on Instagram.",
        },
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
    nav: ["O NAS", "ZAKAJ MI", "STORITVE", "KONTAKTI"],
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
    presence: {
      eyebrow: "Spletna prisotnost",
      title:
        "Google Business Profile, Instagram in ocene so vedno posodobljeni.",
      google: {
        kicker: "Google Business Profile",
        summaryFallback:
          "Poslovni profil, spletni ugled in hitre povezave so zbrani na enem mestu in usklajeni z videzom strani.",
        ratingLabel: "Povprecna ocena",
        reviewsLabel: "Google ocene",
        statusLabel: "Stanje profila",
        pendingStatus: "V pripravi",
        chipServiceArea: "Service area business",
        chipProfile: "Google profil",
        metaPending:
          "Profil lastnika in ocene se sinhronizirajo iz namenskega backenda brez izpostavljanja kljucev v frontendu.",
        metaNoAddress: "Podjetje brez javnega naslova",
        metaWebsite: "Povezana spletna stran",
        metaPlaceId: "Place ID na voljo",
        metaSynced:
          "Podatki se samodejno sinhronizirajo iz Google Business profila.",
        profileCta: "Odpri profil",
        reviewCta: "Pusti oceno",
        notePending: "Cakamo na povezavo z Google Business profilom.",
        noteConnected:
          "Povezava je aktivna. Podatki in ocene se samodejno posodabljajo iz backenda.",
        noteConfig:
          "Nastavi vir podatkov v site-config.js za aktivacijo Google Business profila.",
        noteErrorPrefix: "Google Business ni dosegljiv: ",
        noteErrorFallback: "neznana napaka",
        reviewsKicker: "Google ocene",
        reviewsTitle:
          "Preverjene povratne informacije brez vsiljivih zunanjih gradnikov.",
        reviewsCta: "Prikazi vse",
        reviewsEmptyTitle: "Ocen ni na voljo",
        reviewsEmptyBody:
          "Ocene se bodo prikazale tukaj takoj, ko bo Google profil v celoti povezan.",
        reviewsConfigNote:
          "Postavitev je pripravljena. Ocene se bodo tukaj pojavile takoj, ko bodo podatkovne datoteke sinhronizirane.",
        reviewsConnectedNote:
          "Ocene prikazujejo najnovejse povratne informacije z Google profila.",
        reviewsWaitingNote:
          "Profil je povezan. Ocene se bodo prikazale tukaj, ko bodo na voljo.",
        reviewsErrorNote:
          "Postavitev ostane aktivna, vendar bodo Google podatki prisli sele po zakljucku zunanje konfiguracije.",
        authorFallback: "Google stranka",
        bodyFallback: "Ocena je bila objavljena brez vidnega besedila.",
        replyLabel: "Odgovor podjetja Eletwave",
        statusOpen: "Aktivno",
        statusPaused: "Pavza",
        statusClosed: "Zaprto",
        statusServiceArea: "Obmocje storitve",
        statusConnected: "Povezano",
      },
      instagram: {
        kicker: "Instagram business",
        title: "Zadnje objave z @eletwave.",
        chip: "Samodejni feed",
        lead:
          "Vsebina se samodejno nalaga iz poslovnega profila in ostaja usklajena z vizualnim jezikom strani.",
        metaPending:
          "Poslovni profil je pripravljen na povezavo. Takoj ko bo sinhronizacija aktivna, se bodo tukaj prikazale zadnje prave objave.",
        profileCta: "Odpri profil",
        postsCta: "Poglej vse objave",
        notePending: "Cakamo na povezavo z Instagram API.",
        noteConnected:
          "Feed prikazuje zadnjo vsebino, ki je na voljo iz Instagram business profila.",
        noteWaiting:
          "Profil je povezan, vendar v feedu se ni vsebine za prikaz.",
        noteConfig:
          "Nastavi vir podatkov v site-config.js za aktivacijo samodejnega Instagram feeda.",
        noteErrorPrefix: "Instagram ni dosegljiv: ",
        noteErrorFallback: "neznana napaka",
        emptyWaitingBody:
          "Objave se bodo prikazale tukaj takoj, ko bo Instagram profil povezan s sinhronizacijo podatkov.",
        emptyConfigBody:
          "Postavitev je ze pripravljena. Takoj ko povezes vir podatkov, se bodo tukaj prikazale zadnje prave objave.",
        emptyUnavailableBody:
          "Instagram profil je ze povezan, vendar samodejni feed se ni na voljo.",
        feedAutoLabel: "Samodejni feed povezan",
        publishedPostsLabel: "objav",
        syncActiveLabel: "samodejna sinhronizacija aktivna",
        typeLabels: {
          IMAGE: "Objava",
          VIDEO: "Video",
          CAROUSEL_ALBUM: "Vrtiljak",
          REELS: "Reel",
        },
        postFallback:
          "Odpri objavo za ogled celotne vsebine na Instagramu.",
      },
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
  const localeByLanguage = {
    it: "it-IT",
    en: "en-US",
    sl: "sl-SI",
  };
  let presenceFetchStarted = false;
  let googlePresenceState = "idle";
  let instagramPresenceState = "idle";
  let googlePresencePayload = null;
  let instagramPresencePayload = null;
  let googlePresenceErrorMessage = "";
  let instagramPresenceErrorMessage = "";
  const siteConfig =
    window.ELETWAVE_CONFIG && typeof window.ELETWAVE_CONFIG === "object"
      ? window.ELETWAVE_CONFIG
      : {};
  const integrationConfig =
    siteConfig.integrations && typeof siteConfig.integrations === "object"
      ? siteConfig.integrations
      : {};
  const apiBaseUrl =
    typeof integrationConfig.apiBaseUrl === "string"
      ? integrationConfig.apiBaseUrl.replace(/\/+$/, "")
      : "";
  const googleDataUrl =
    typeof integrationConfig.googleDataUrl === "string"
      ? integrationConfig.googleDataUrl
      : "";
  const instagramDataUrl =
    typeof integrationConfig.instagramDataUrl === "string"
      ? integrationConfig.instagramDataUrl
      : "";
  const instagramProfileUrl =
    typeof integrationConfig.instagramProfileUrl === "string" &&
    integrationConfig.instagramProfileUrl
      ? integrationConfig.instagramProfileUrl
      : "https://www.instagram.com/eletwave/";
  const googleProfileFallbackUrl =
    typeof integrationConfig.googleProfileUrl === "string"
      ? integrationConfig.googleProfileUrl
      : "";
  const googleReviewFallbackUrl =
    typeof integrationConfig.googleReviewUrl === "string"
      ? integrationConfig.googleReviewUrl
      : "";
  const htmlEscapes = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

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

  function scrollToHashTarget(hash) {
    if (!hash || hash.charAt(0) !== "#") {
      return false;
    }

    const target = document.querySelector(hash);

    if (!target) {
      return false;
    }

    target.scrollIntoView({
      block: "start",
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });

    return true;
  }

  function updateLocationHash(hash) {
    if (
      !hash ||
      hash.charAt(0) !== "#" ||
      !window.history ||
      !window.history.pushState
    ) {
      return;
    }

    if (window.location.hash === hash) {
      window.history.replaceState(null, "", hash);
      return;
    }

    window.history.pushState(null, "", hash);
  }

  function bindHashLink(link) {
    if (!link) {
      return;
    }

    link.addEventListener("click", (event) => {
      const hash = link.getAttribute("href");

      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      if (!hash || hash.charAt(0) !== "#" || !document.querySelector(hash)) {
        setMobileMenuState(false);
        return;
      }

      event.preventDefault();
      setMobileMenuState(false);

      window.requestAnimationFrame(() => {
        scrollToHashTarget(hash);
        updateLocationHash(hash);
      });
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

  function getIntlLocale() {
    return localeByLanguage[currentLanguage] || localeByLanguage.it;
  }

  function getPresenceCopy() {
    const language = translations[currentLanguage] || translations.it;
    return language.presence || translations.it.presence;
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, (char) => htmlEscapes[char]);
  }

  function truncateText(value, maxLength) {
    const text = String(value || "").trim();

    if (!text || text.length <= maxLength) {
      return text;
    }

    return text.slice(0, Math.max(maxLength - 1, 1)).trimEnd() + "...";
  }

  function formatDate(value) {
    if (!value) {
      return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return new Intl.DateTimeFormat(getIntlLocale(), {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  }

  function formatCount(value) {
    return typeof value === "number" && !Number.isNaN(value)
      ? new Intl.NumberFormat(getIntlLocale()).format(value)
      : "--";
  }

  function formatRating(value) {
    return typeof value === "number" && !Number.isNaN(value) && value > 0
      ? value.toLocaleString(getIntlLocale(), {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        })
      : "--";
  }

  function normalizeGoogleRating(value) {
    if (typeof value === "number") {
      return Math.max(0, Math.min(5, Math.round(value)));
    }

    return (
      {
        ONE: 1,
        TWO: 2,
        THREE: 3,
        FOUR: 4,
        FIVE: 5,
      }[String(value || "").toUpperCase()] || 0
    );
  }

  function renderStars(value) {
    const rating = normalizeGoogleRating(value);

    if (!rating) {
      return "☆☆☆☆☆";
    }

    return "★".repeat(rating) + "☆".repeat(Math.max(5 - rating, 0));
  }

  function formatGoogleStatus(status, isServiceAreaBusiness, googleCopy) {
    const normalized = String(status || "").toUpperCase();

    if (normalized === "OPEN") {
      return googleCopy.statusOpen;
    }

    if (normalized === "CLOSED_TEMPORARILY") {
      return googleCopy.statusPaused;
    }

    if (normalized === "CLOSED_PERMANENTLY") {
      return googleCopy.statusClosed;
    }

    return isServiceAreaBusiness
      ? googleCopy.statusServiceArea
      : googleCopy.statusConnected;
  }

  function setLinkState(link, href) {
    if (!link) {
      return;
    }

    if (href) {
      link.href = href;
      link.setAttribute("aria-disabled", "false");
      return;
    }

    link.href = "#";
    link.setAttribute("aria-disabled", "true");
  }

  function buildApiUrl(path) {
    if (!apiBaseUrl) {
      return "";
    }

    const normalizedPath = path.startsWith("/") ? path : "/" + path;
    return apiBaseUrl + normalizedPath;
  }

  function getDataSourceUrl(type) {
    if (type === "google-business") {
      return googleDataUrl || buildApiUrl("/google-business");
    }

    if (type === "instagram") {
      return instagramDataUrl || buildApiUrl("/instagram");
    }

    return "";
  }

  function renderInstagramSkeletons(count) {
    if (!instagramFeed) {
      return;
    }

    instagramFeed.innerHTML = Array.from({ length: count }, () => {
      return '<div class="presence-post presence-post--skeleton presence-skeleton"></div>';
    }).join("");
  }

  function renderGoogleReviewSkeletons(count) {
    if (!googleReviewsGrid) {
      return;
    }

    googleReviewsGrid.innerHTML = Array.from({ length: count }, () => {
      return '<div class="presence-review presence-review--skeleton presence-skeleton"></div>';
    }).join("");
  }

  function renderInstagramEmpty(message) {
    if (!instagramFeed) {
      return;
    }

    instagramFeed.innerHTML =
      '<article class="presence-post">' +
      '<div class="presence-post__body">' +
      '<span class="presence-post__date">Instagram</span>' +
      '<p class="presence-post__caption">' +
      escapeHtml(message) +
      "</p>" +
      "</div>" +
      "</article>";
  }

  function renderGoogleReviews(reviews, googleCopy) {
    if (!googleReviewsGrid) {
      return;
    }

    if (!reviews.length) {
      googleReviewsGrid.innerHTML =
        '<article class="presence-review">' +
        '<div class="presence-review__author">' +
        '<span class="presence-review__name">' +
        escapeHtml(googleCopy.reviewsEmptyTitle) +
        "</span>" +
        '<span class="presence-review__date">Google Business Profile</span>' +
        "</div>" +
        '<p class="presence-review__body">' +
        escapeHtml(googleCopy.reviewsEmptyBody) +
        "</p>" +
        "</article>";
      return;
    }

    googleReviewsGrid.innerHTML = reviews
      .slice(0, 3)
      .map((review) => {
        const author = escapeHtml(review.author || googleCopy.authorFallback);
        const date = escapeHtml(formatDate(review.updateTime || review.createTime));
        const body = escapeHtml(
          truncateText(
            review.comment || googleCopy.bodyFallback,
            240,
          ),
        );
        const replyMarkup =
          review.reply && review.reply.comment
            ? '<div class="presence-review__reply"><strong>' +
              escapeHtml(googleCopy.replyLabel) +
              "</strong><br />" +
              escapeHtml(truncateText(review.reply.comment, 180)) +
              "</div>"
            : "";

        return (
          '<article class="presence-review">' +
          '<div class="presence-review__head">' +
          '<div class="presence-review__author">' +
          '<span class="presence-review__name">' +
          author +
          "</span>" +
          '<span class="presence-review__date">' +
          date +
          "</span>" +
          "</div>" +
          '<span class="presence-review__rating">' +
          renderStars(review.rating || review.starRating) +
          "</span>" +
          "</div>" +
          '<p class="presence-review__body">' +
          body +
          "</p>" +
          replyMarkup +
          "</article>"
        );
      })
      .join("");
  }

  function renderInstagramPosts(posts, instagramCopy) {
    if (!instagramFeed) {
      return;
    }

    if (!posts.length) {
      renderInstagramEmpty(instagramCopy.emptyWaitingBody);
      return;
    }

    const typeLabels = instagramCopy.typeLabels;

    instagramFeed.innerHTML = posts
      .slice(0, 6)
      .map((post) => {
        const imageMarkup = post.imageUrl
          ? '<div class="presence-post__media">' +
            '<img src="' +
            escapeHtml(post.imageUrl) +
            '" alt="' +
            escapeHtml(post.alt || post.caption || "Post Instagram Eletwave") +
            '" loading="lazy" decoding="async" />' +
            "</div>"
          : "";

        return (
          '<a class="presence-post" href="' +
          escapeHtml(post.permalink || instagramProfileUrl) +
          '" target="_blank" rel="noopener noreferrer">' +
          '<span class="presence-post__type">' +
          escapeHtml(typeLabels[post.mediaType] || "Post") +
          "</span>" +
          imageMarkup +
          '<div class="presence-post__body">' +
          '<span class="presence-post__date">' +
          escapeHtml(formatDate(post.timestamp)) +
          "</span>" +
          '<p class="presence-post__caption">' +
          escapeHtml(
            truncateText(
              post.caption || instagramCopy.postFallback,
              120,
            ),
          ) +
          "</p>" +
          "</div>" +
          "</a>"
        );
      })
      .join("");
  }

  function renderGooglePresence() {
    if (!presenceSection) {
      return;
    }

    const googleCopy = getPresenceCopy().google;

    if (googleKicker) {
      googleKicker.textContent = googleCopy.kicker;
    }

    if (googleRatingLabel) {
      googleRatingLabel.textContent = googleCopy.ratingLabel;
    }

    if (googleReviewsLabel) {
      googleReviewsLabel.textContent = googleCopy.reviewsLabel;
    }

    if (googleStatusLabel) {
      googleStatusLabel.textContent = googleCopy.statusLabel;
    }

    if (googleProfileCta) {
      googleProfileCta.textContent = googleCopy.profileCta;
    }

    if (googleReviewCta) {
      googleReviewCta.textContent = googleCopy.reviewCta;
    }

    if (googleReviewsKicker) {
      googleReviewsKicker.textContent = googleCopy.reviewsKicker;
    }

    if (googleReviewsTitle) {
      googleReviewsTitle.textContent = googleCopy.reviewsTitle;
    }

    if (googleReviewsCta) {
      googleReviewsCta.textContent = googleCopy.reviewsCta;
    }

    if (googlePresenceState === "loaded" && googlePresencePayload) {
      const payload = googlePresencePayload;
      const profile = payload.profile || {};
      const summary = payload.summary || {};
      const isServiceAreaBusiness = Boolean(profile.isServiceAreaBusiness);
      const profileUrl =
        profile.mapsUrl || profile.profileUrl || googleProfileFallbackUrl || "";
      const reviewUrl =
        profile.newReviewUrl || profile.reviewUrl || googleReviewFallbackUrl || "";

      if (googleTitle) {
        googleTitle.textContent = profile.title || "ELETWAVE";
      }

      if (googleChip) {
        googleChip.textContent = isServiceAreaBusiness
          ? googleCopy.chipServiceArea
          : googleCopy.chipProfile;
      }

      if (googleSummary) {
        googleSummary.textContent =
          profile.description || googleCopy.summaryFallback;
      }

      if (googleRating) {
        googleRating.textContent = formatRating(summary.averageRating);
      }

      if (googleReviewCount) {
        googleReviewCount.textContent = formatCount(summary.totalReviewCount);
      }

      if (googleStatus) {
        googleStatus.textContent = formatGoogleStatus(
          profile.status,
          isServiceAreaBusiness,
          googleCopy,
        );
      }

      if (googleMeta) {
        const metaParts = [];

        if (isServiceAreaBusiness) {
          metaParts.push(googleCopy.metaNoAddress);
        }

        if (profile.phone) {
          metaParts.push(profile.phone);
        }

        if (profile.website) {
          metaParts.push(googleCopy.metaWebsite);
        }

        if (profile.placeId) {
          metaParts.push(googleCopy.metaPlaceId);
        }

        googleMeta.textContent = metaParts.length
          ? metaParts.join(" • ")
          : googleCopy.metaSynced;
      }

      setLinkState(googleProfileLink, profileUrl);
      setLinkState(googleReviewLink, reviewUrl || profileUrl);
      setLinkState(googleReviewsAction, profileUrl || reviewUrl);

      if (googleNote) {
        googleNote.textContent = googleCopy.noteConnected;
      }

      if (googleReviewsNote) {
        googleReviewsNote.textContent =
          summary.totalReviewCount > 0
            ? googleCopy.reviewsConnectedNote
            : googleCopy.reviewsWaitingNote;
      }

      renderGoogleReviews(Array.isArray(payload.reviews) ? payload.reviews : [], googleCopy);
      return;
    }

    if (googleTitle) {
      googleTitle.textContent = "ELETWAVE";
    }

    if (googleChip) {
      googleChip.textContent = googleCopy.chipServiceArea;
    }

    if (googleSummary) {
      googleSummary.textContent = googleCopy.summaryFallback;
    }

    if (googleRating) {
      googleRating.textContent = "--";
    }

    if (googleReviewCount) {
      googleReviewCount.textContent = "--";
    }

    if (googleStatus) {
      googleStatus.textContent = googleCopy.pendingStatus;
    }

    if (googleMeta) {
      googleMeta.textContent = googleCopy.metaPending;
    }

    setLinkState(googleProfileLink, googleProfileFallbackUrl);
    setLinkState(googleReviewLink, googleReviewFallbackUrl);
    setLinkState(
      googleReviewsAction,
      googleProfileFallbackUrl || googleReviewFallbackUrl,
    );

    if (googlePresenceState === "config_missing") {
      if (googleNote) {
        googleNote.textContent = googleCopy.noteConfig;
      }

      if (googleReviewsNote) {
        googleReviewsNote.textContent = googleCopy.reviewsConfigNote;
      }

      renderGoogleReviews([], googleCopy);
      return;
    }

    if (googlePresenceState === "error") {
      if (googleNote) {
        googleNote.textContent =
          googleCopy.noteErrorPrefix +
          (googlePresenceErrorMessage || googleCopy.noteErrorFallback);
      }

      if (googleReviewsNote) {
        googleReviewsNote.textContent = googleCopy.reviewsErrorNote;
      }

      renderGoogleReviews([], googleCopy);
      return;
    }

    if (googleNote) {
      googleNote.textContent = googleCopy.notePending;
    }

    if (googleReviewsNote) {
      googleReviewsNote.textContent = googleCopy.reviewsWaitingNote;
    }
  }

  function renderInstagramPresence() {
    if (!presenceSection) {
      return;
    }

    const instagramCopy = getPresenceCopy().instagram;

    if (instagramKicker) {
      instagramKicker.textContent = instagramCopy.kicker;
    }

    if (instagramTitle) {
      instagramTitle.textContent = instagramCopy.title;
    }

    if (instagramChip) {
      instagramChip.textContent = instagramCopy.chip;
    }

    if (instagramLead) {
      instagramLead.textContent = instagramCopy.lead;
    }

    if (instagramProfileCta) {
      instagramProfileCta.textContent = instagramCopy.profileCta;
    }

    if (instagramPostsCta) {
      instagramPostsCta.textContent = instagramCopy.postsCta;
    }

    if (instagramPresenceState === "loaded" && instagramPresencePayload) {
      const payload = instagramPresencePayload;
      const profile = payload.profile || {};
      const posts = Array.isArray(payload.posts) ? payload.posts : [];
      const profileUrl = profile.profileUrl || instagramProfileUrl;

      setLinkState(instagramProfileLink, profileUrl);
      setLinkState(instagramPostsLink, profileUrl);

      if (instagramMeta) {
        const mediaCountLabel =
          typeof profile.mediaCount === "number" && profile.mediaCount >= 0
            ? formatCount(profile.mediaCount) +
              " " +
              instagramCopy.publishedPostsLabel
            : instagramCopy.feedAutoLabel;
        const username = profile.username ? "@" + profile.username : "@eletwave";
        instagramMeta.textContent =
          username +
          " • " +
          mediaCountLabel +
          " • " +
          instagramCopy.syncActiveLabel;
      }

      if (instagramNote) {
        instagramNote.textContent = posts.length
          ? instagramCopy.noteConnected
          : instagramCopy.noteWaiting;
      }

      renderInstagramPosts(posts, instagramCopy);
      return;
    }

    setLinkState(instagramProfileLink, instagramProfileUrl);
    setLinkState(instagramPostsLink, instagramProfileUrl);

    if (instagramMeta) {
      instagramMeta.textContent = instagramCopy.metaPending;
    }

    if (instagramPresenceState === "config_missing") {
      if (instagramNote) {
        instagramNote.textContent = instagramCopy.noteConfig;
      }

      renderInstagramEmpty(instagramCopy.emptyConfigBody);
      return;
    }

    if (instagramPresenceState === "error") {
      if (instagramNote) {
        instagramNote.textContent =
          instagramCopy.noteErrorPrefix +
          (instagramPresenceErrorMessage || instagramCopy.noteErrorFallback);
      }

      renderInstagramEmpty(instagramCopy.emptyUnavailableBody);
      return;
    }

    if (instagramNote) {
      instagramNote.textContent = instagramCopy.notePending;
    }
  }

  function renderPresenceSection() {
    if (!presenceSection) {
      return;
    }

    const presenceCopy = getPresenceCopy();

    if (presenceEyebrow) {
      presenceEyebrow.textContent = presenceCopy.eyebrow;
    }

    if (presenceTitle) {
      presenceTitle.textContent = presenceCopy.title;
    }

    renderGooglePresence();
    renderInstagramPresence();
  }

  async function fetchIntegrationJson(sourceType) {
    const url = getDataSourceUrl(sourceType);

    if (!url) {
      throw new Error(
        "Sorgente dati non configurata in site-config.js per " + sourceType,
      );
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    let payload = null;

    try {
      payload = await response.json();
    } catch (error) {
      payload = null;
    }

    if (!response.ok) {
      throw new Error(
        payload && payload.error ? payload.error : "Richiesta non riuscita",
      );
    }

    return payload;
  }

  async function loadGoogleBusiness() {
    if (!presenceSection) {
      return;
    }

    googlePresencePayload = await fetchIntegrationJson("google-business");
    googlePresenceErrorMessage = "";
    googlePresenceState = "loaded";
    renderGooglePresence();
  }

  async function loadInstagramFeed() {
    if (!presenceSection) {
      return;
    }

    instagramPresencePayload = await fetchIntegrationJson("instagram");
    instagramPresenceErrorMessage = "";
    instagramPresenceState = "loaded";
    renderInstagramPresence();
  }

  function loadPresenceData() {
    if (!presenceSection || presenceFetchStarted) {
      return;
    }

    presenceFetchStarted = true;
    googlePresenceState = "loading";
    instagramPresenceState = "loading";

    setLinkState(instagramProfileLink, instagramProfileUrl);
    setLinkState(instagramPostsLink, instagramProfileUrl);

    if (!getDataSourceUrl("google-business") && !getDataSourceUrl("instagram")) {
      googlePresenceState = "config_missing";
      instagramPresenceState = "config_missing";
      renderPresenceSection();
      return;
    }

    Promise.allSettled([loadGoogleBusiness(), loadInstagramFeed()]).then(
      (results) => {
        const googleResult = results[0];
        const instagramResult = results[1];

        if (googleResult && googleResult.status === "rejected") {
          googlePresencePayload = null;
          googlePresenceState = "error";
          googlePresenceErrorMessage =
            googleResult.reason && googleResult.reason.message
              ? googleResult.reason.message
              : "";
          setLinkState(googleProfileLink, googleProfileFallbackUrl);
          setLinkState(googleReviewLink, googleReviewFallbackUrl);
          setLinkState(
            googleReviewsAction,
            googleProfileFallbackUrl || googleReviewFallbackUrl,
          );
          renderGooglePresence();
        }

        if (instagramResult && instagramResult.status === "rejected") {
          instagramPresencePayload = null;
          instagramPresenceState = "error";
          instagramPresenceErrorMessage =
            instagramResult.reason && instagramResult.reason.message
              ? instagramResult.reason.message
              : "";
          renderInstagramPresence();
        }
      },
    );
  }

  function observePresenceData() {
    if (!presenceSection) {
      return;
    }

    renderInstagramSkeletons(6);
    renderGoogleReviewSkeletons(3);
    setLinkState(instagramProfileLink, instagramProfileUrl);
    setLinkState(instagramPostsLink, instagramProfileUrl);
    setLinkState(googleProfileLink, googleProfileFallbackUrl);
    setLinkState(googleReviewLink, googleReviewFallbackUrl);
    setLinkState(
      googleReviewsAction,
      googleProfileFallbackUrl || googleReviewFallbackUrl,
    );

    if (!("IntersectionObserver" in window)) {
      loadPresenceData();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            observer.disconnect();
            loadPresenceData();
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    observer.observe(presenceSection);
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

    renderPresenceSection();

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
  observePresenceData();

  if (topbarMenuButton) {
    topbarMenuButton.addEventListener("click", () => {
      setMobileMenuState(
        !(topbar && topbar.classList.contains("is-menu-open")),
      );
    });
  }

  navLinks.forEach((link) => bindHashLink(link));
  bindHashLink(topbarBrand);

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
    const itemWindow = 0.24;

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
  window.addEventListener("hashchange", () => {
    scrollToHashTarget(window.location.hash);
  });
  updateScrollState();
  updateMenuOnResize();

  if (window.location.hash) {
    window.requestAnimationFrame(() => {
      scrollToHashTarget(window.location.hash);
    });
  }
})();
