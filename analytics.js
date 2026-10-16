(function () {
  "use strict";

  const measurementId = "G-LN42Y4382J";
  const storageKey = "eletwave-analytics-consent";
  const disableKey = "ga-disable-" + measurementId;
  const consentVersion = 1;
  const routes = {
    "/": ["/", "ELETWAVE | Impianti elettrici, fotovoltaico e sicurezza"],
    "/index.html": ["/", "ELETWAVE | Impianti elettrici, fotovoltaico e sicurezza"],
    "/en/": ["/en/", "ELETWAVE | Electrical systems, solar and security"],
    "/en/index.html": ["/en/", "ELETWAVE | Electrical systems, solar and security"],
    "/sl/": ["/sl/", "ELETWAVE | Elektrika, soncna energija in varnost"],
    "/sl/index.html": ["/sl/", "ELETWAVE | Elektrika, soncna energija in varnost"],
    "/preventivo.html": ["/preventivo.html", "ELETWAVE | Preventivo online"],
    "/privacy-policy.html": ["/privacy-policy.html", "Privacy Policy | ELETWAVE"],
    "/cookie-policy.html": ["/cookie-policy.html", "Cookie Policy | ELETWAVE"],
  };
  const route = routes[location.pathname];
  if (!route) return;

  const language = ["it", "en", "sl"].includes(document.documentElement.lang) ? document.documentElement.lang : "it";
  const text = {
    it: {
      title: "Statistiche del sito",
      body: "Con il tuo consenso usiamo Google Analytics per misurare visite e clic su WhatsApp e Preventivo. Il sito funziona anche se rifiuti.",
      accept: "Accetta statistiche", reject: "Rifiuta", preferences: "Preferenze cookie",
      privacy: "Privacy", cookies: "Cookie", close: "Chiudi", closeReject: "Chiudi e rifiuta",
    },
    en: {
      title: "Website statistics",
      body: "With your consent, we use Google Analytics to measure visits and clicks on WhatsApp and Online Quote. The website also works if you decline.",
      accept: "Accept statistics", reject: "Decline", preferences: "Cookie preferences",
      privacy: "Privacy", cookies: "Cookies", close: "Close", closeReject: "Close and decline",
    },
    sl: {
      title: "Statistika spletne strani",
      body: "Z va\u0161im soglasjem uporabljamo Google Analytics za merjenje obiskov in klikov na WhatsApp in Spletno povpra\u0161evanje. Stran deluje tudi, \u010de zavrnete.",
      accept: "Dovoli statistiko", reject: "Zavrni", preferences: "Nastavitve pi\u0161kotkov",
      privacy: "Zasebnost", cookies: "Pi\u0161kotki", close: "Zapri", closeReject: "Zapri in zavrni",
    },
  }[language];
  const supportedHost = ["www.eletwave.com", "eletwave.com"].includes(location.hostname);
  const denied = { analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" };
  let preference = null;
  let memoryPreference = null;
  let storageUnavailable = false;
  let active = false;
  let tagRequested = false;
  let viewRecorded = false;
  let returnFocus = null;
  window[disableKey] = true;

  function validPreference(value) {
    if (!value || value.version !== consentVersion || !["granted", "denied"].includes(value.value)) return null;
    if (!Number.isFinite(value.savedAt) || value.savedAt > Date.now() || value.savedAt <= 0) return null;
    const expiry = new Date(value.savedAt);
    expiry.setMonth(expiry.getMonth() + 6);
    return expiry.getTime() > Date.now() ? value : null;
  }

  function readPreference() {
    if (storageUnavailable) return validPreference(memoryPreference);
    let stored;
    try { stored = localStorage.getItem(storageKey); }
    catch { storageUnavailable = true; return validPreference(memoryPreference); }
    try { return validPreference(JSON.parse(stored)); }
    catch { return null; }
  }

  function savePreference(value) {
    memoryPreference = { version: consentVersion, value, savedAt: Date.now() };
    try { localStorage.setItem(storageKey, JSON.stringify(memoryPreference)); }
    catch { storageUnavailable = true; }
    applyPreference(memoryPreference);
  }

  function clearAnalyticsCookies() {
    const names = ["_ga", "_ga_LN42Y4382J"];
    const domains = ["", location.hostname, "." + location.hostname, "eletwave.com", ".eletwave.com"];
    for (const name of names) {
      for (const domain of domains) {
        document.cookie = name + "=; Max-Age=0; Path=/; SameSite=Lax" + (domain ? "; Domain=" + domain : "");
      }
    }
  }

  // Never include query strings, fragments, message links or form contents in analytics.
  function pageParameters() {
    let referrer = "";
    try {
      const url = new URL(document.referrer);
      if (["http:", "https:"].includes(url.protocol)) {
        referrer = url.origin === location.origin ? "https://www.eletwave.com" + (routes[url.pathname]?.[0] || "/") : url.origin + "/";
      }
    } catch { /* Direct visit. */ }
    return {
      send_to: measurementId,
      page_location: "https://www.eletwave.com" + route[0],
      page_referrer: referrer,
      page_title: route[1],
      language,
    };
  }

  function startAnalytics() {
    if (active || !supportedHost) return;
    active = true;
    window[disableKey] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    if (!tagRequested) {
      window.gtag("consent", "default", denied);
      window.gtag("set", "ads_data_redaction", true);
      window.gtag("set", "url_passthrough", false);
      window.gtag("js", new Date());
    }
    window.gtag("consent", "update", { ...denied, analytics_storage: "granted" });
    window.gtag("config", measurementId, {
      ...pageParameters(),
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: 60 * 60 * 24 * 180,
      cookie_update: false,
      cookie_flags: "SameSite=Lax;Secure",
    });
    if (!viewRecorded) {
      window.gtag("event", "page_view", pageParameters());
      viewRecorded = true;
    }
    if (!tagRequested) {
      tagRequested = true;
      const script = document.createElement("script");
      script.async = true;
      script.referrerPolicy = "no-referrer";
      script.src = "https://www.googletagmanager.com/gtag/js?id=" + measurementId;
      script.id = "eletwave-google-tag";
      document.head.append(script);
    }
  }

  function stopAnalytics() {
    window[disableKey] = true;
    if (active && typeof window.gtag === "function") {
      // Discard our unprocessed commands too, including while the tag loads.
      window.dataLayer.length = 0;
      window.gtag("consent", "update", denied);
    }
    active = false;
    clearAnalyticsCookies();
  }

  const banner = document.createElement("aside");
  banner.id = "analytics-consent";
  banner.className = "analytics-consent";
  banner.hidden = true;
  banner.setAttribute("role", "region");
  banner.setAttribute("aria-labelledby", "analytics-consent-title");
  banner.innerHTML = '<div class="analytics-consent__inner"><div class="analytics-consent__copy">' +
    '<h2 id="analytics-consent-title">' + text.title + '</h2><p>' + text.body + '</p>' +
    '<div class="analytics-consent__links"><a href="/privacy-policy.html">' + text.privacy + '</a>' +
    '<a href="/cookie-policy.html">' + text.cookies + '</a></div></div>' +
    '<div class="analytics-consent__actions"><button type="button" data-consent="denied">' + text.reject + '</button>' +
    '<button type="button" data-consent="granted">' + text.accept + '</button></div>' +
    '<button type="button" class="analytics-consent__close"><svg width="20" height="20" aria-hidden="true"><use href="/assets/quote-icons.svg#x"></use></svg></button></div>';
  document.body.append(banner);
  const close = banner.querySelector(".analytics-consent__close");
  const preferences = document.createElement("button");
  preferences.type = "button";
  preferences.className = "analytics-preferences";
  preferences.textContent = text.preferences;
  preferences.setAttribute("aria-controls", banner.id);
  preferences.setAttribute("aria-expanded", "false");
  (document.querySelector("footer nav") || document.querySelector("footer"))?.append(preferences);
  preferences.parentElement?.classList.add("analytics-preferences-nav");

  function updateHeight() {
    document.documentElement.style.setProperty("--analytics-banner-height", banner.hidden ? "0px" : Math.ceil(banner.getBoundingClientRect().height) + "px");
  }

  function setOpen(open) {
    banner.hidden = !open;
    preferences.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("has-analytics-banner", open);
    close.setAttribute("aria-label", preference ? text.close : text.closeReject);
    close.title = preference ? text.close : text.closeReject;
    updateHeight();
    if (!open && banner.contains(document.activeElement)) {
      const target = returnFocus?.isConnected ? returnFocus : document.querySelector("#stage-title, main h1, main");
      if (target) {
        if (!target.matches("button, a, input, textarea")) target.tabIndex = -1;
        target.focus({ preventScroll: true });
      }
    }
  }

  function applyPreference(value) {
    preference = validPreference(value);
    if (preference?.value === "granted") startAnalytics();
    else stopAnalytics();
    setOpen(!preference);
  }

  preferences.addEventListener("click", () => {
    returnFocus = preferences;
    setOpen(true);
    banner.querySelector("[data-consent]").focus({ preventScroll: true });
  });
  banner.addEventListener("click", event => {
    const button = event.target.closest("[data-consent]");
    if (button) savePreference(button.dataset.consent);
  });
  function dismiss() {
    if (preference) setOpen(false);
    else savePreference("denied");
  }
  close.addEventListener("click", dismiss);
  banner.addEventListener("keydown", event => {
    if (event.key === "Escape") { event.preventDefault(); dismiss(); }
  });
  if ("ResizeObserver" in window) new ResizeObserver(updateHeight).observe(banner);
  window.addEventListener("resize", updateHeight);

  function refreshPreference() {
    const next = readPreference();
    if (JSON.stringify(next) !== JSON.stringify(preference)) applyPreference(next);
  }
  window.addEventListener("storage", event => {
    if (event.key === storageKey || event.key === null) refreshPreference();
  });
  window.addEventListener("pageshow", refreshPreference);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) refreshPreference();
  });

  function trackClick(event) {
    if (event.type === "auxclick" && event.button !== 1) return;
    if (event.type === "click" && event.button !== 0) return;
    if (!validPreference(preference)) { applyPreference(null); return; }
    if (!active || preference.value !== "granted" || window[disableKey]) return;
    const link = event.target.closest?.("a[href]");
    if (!link) return;
    let url;
    try { url = new URL(link.href); } catch { return; }
    let name;
    if (url.protocol === "https:" && ["wa.me", "api.whatsapp.com", "web.whatsapp.com"].includes(url.hostname)) name = "click_whatsapp";
    else if (url.origin === location.origin && url.pathname === "/preventivo.html") name = "click_preventivo";
    if (!name) return;
    let position = "page";
    if (link.closest(".hero__actions")) position = "hero";
    else if (link.closest(".topbar__nav")) position = "menu";
    else if (link.closest(".contact__actions")) position = "contact";
    else if (link.matches("[data-send=whatsapp]")) position = "quote_review";
    else if (link.closest(".aside-contact")) position = "quote_help";
    window.gtag("event", name, { ...pageParameters(), link_position: position });
  }
  document.addEventListener("click", trackClick, true);
  document.addEventListener("auxclick", trackClick, true);
  applyPreference(readPreference());
})();
