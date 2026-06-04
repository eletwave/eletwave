(function () {
  const stage = document.querySelector("#quiz-stage");
  const progress = document.querySelector("#quote-progress");
  const prevButton = document.querySelector("#prev-step");
  const nextButton = document.querySelector("#next-step");
  const summaryList = document.querySelector("#summary-list");
  const whatsappLink = document.querySelector("#send-whatsapp");
  const emailLink = document.querySelector("#send-email");

  if (!stage) {
    return;
  }

  const serviceDetails = {
    elettrico: {
      title: "Che intervento elettrico dobbiamo valutare?",
      options: [
        ["Nuovo impianto", "Casa, negozio, ufficio o capannone da realizzare."],
        ["Adeguamento", "Messa a norma, quadro, linee o protezioni."],
        ["Ampliamento", "Nuovi punti, nuove linee o nuovi ambienti."],
        ["Guasto", "Problema da diagnosticare o risolvere."],
      ],
    },
    fotovoltaico: {
      title: "A che punto sei con il fotovoltaico?",
      options: [
        ["Voglio un nuovo impianto", "Partiamo da consumi, tetto e potenza."],
        ["Ho gia il fotovoltaico", "Valutiamo accumulo, monitoraggio o modifica."],
        ["Vorrei aggiungere batterie", "Dimensioniamo accumulo e gestione carichi."],
        ["Non lo so ancora", "Serve una prima valutazione di fattibilita."],
      ],
    },
    wallbox: {
      title: "Che ricarica ti serve?",
      options: [
        ["Casa", "Wallbox in garage, posto auto o esterno."],
        ["Azienda", "Una o piu postazioni per flotta, clienti o dipendenti."],
        ["Con fotovoltaico", "Ricarica integrata con produzione e accumulo."],
        ["Solo predisposizione", "Linea pronta per installazione futura."],
      ],
    },
    sicurezza: {
      title: "Quale sistema di sicurezza ti interessa?",
      options: [
        ["Videosorveglianza", "Telecamere, NVR e visione da app."],
        ["Antifurto", "Sensori, centrale, sirene e notifiche."],
        ["Entrambi", "Copertura completa con controllo remoto."],
        ["Aggiornamento impianto", "Sistema esistente da sistemare o ampliare."],
      ],
    },
    reti: {
      title: "Che rete dati dobbiamo progettare?",
      options: [
        ["Casa smart", "Wi-Fi stabile, punti rete e dispositivi connessi."],
        ["Ufficio", "Cablaggio, switch, access point e postazioni."],
        ["Videosorveglianza", "Rete dedicata per telecamere e NVR."],
        ["Rack o armadio", "Ordine, patch panel e infrastruttura."],
      ],
    },
    domotica: {
      title: "Cosa vuoi automatizzare?",
      options: [
        ["Luci e scenari", "Comandi, scene e automazioni quotidiane."],
        ["Clima e consumi", "Controllo carichi, energia e comfort."],
        ["Cancelli e accessi", "Automazioni, videocitofonia e app."],
        ["Sistema integrato", "Piu funzioni da coordinare insieme."],
      ],
    },
    led: {
      title: "Che illuminazione vuoi migliorare?",
      options: [
        ["Casa", "Luci interne, esterne o decorative."],
        ["Negozio o ufficio", "Comfort, resa e consumi."],
        ["Capannone", "Illuminazione tecnica e sicurezza."],
        ["Relamping", "Sostituzione corpi esistenti con LED."],
      ],
    },
    manutenzione: {
      title: "Che tipo di assistenza ti serve?",
      options: [
        ["Guasto urgente", "Impianto fermo o problema importante."],
        ["Controllo impianto", "Verifiche, sicurezza e stato generale."],
        ["Manutenzione programmata", "Controlli periodici e prevenzione."],
        ["Modifica piccola", "Intervento puntuale da stimare."],
      ],
    },
  };

  const questions = {
    service: {
      eyebrow: "Domanda 1",
      title: "Da quale servizio partiamo?",
      body: "Scegli il servizio principale. Poi il quiz si adatta alla tua scelta.",
      type: "options",
      key: "Servizio",
      next: "detail",
      options: [
        ["elettrico", "Impianto elettrico", "Nuovo impianto, modifica o quadro."],
        ["fotovoltaico", "Fotovoltaico", "Pannelli, batterie e monitoraggio."],
        ["wallbox", "Wallbox", "Ricarica auto casa o azienda."],
        ["sicurezza", "Sicurezza", "Telecamere, antifurto e controllo remoto."],
        ["reti", "Reti dati", "Cablaggio, rack e Wi-Fi."],
        ["domotica", "Domotica", "Scenari, carichi, accessi e automazioni."],
        ["led", "Illuminazione LED", "Relamping e luci tecniche."],
        ["manutenzione", "Manutenzione", "Guasti, controlli e ampliamenti."],
      ],
    },
    detail: {
      dynamic: true,
      eyebrow: "Domanda 2",
      body: "Questa domanda cambia in base al servizio scelto.",
      type: "options",
      key: "Dettaglio servizio",
      next: "building",
    },
    building: {
      eyebrow: "Domanda 3",
      title: "Dove va fatto l'intervento?",
      body: "Ci serve per capire contesto e complessita.",
      type: "options",
      key: "Immobile",
      next: "timing",
      options: [
        ["Casa o appartamento", "Casa o appartamento", "Abitazione singola o appartamento."],
        ["Villetta", "Villetta", "Casa indipendente, garage o esterni."],
        ["Condominio", "Condominio", "Parti comuni o piu unita."],
        ["Negozio o ufficio", "Negozio o ufficio", "Spazio commerciale o professionale."],
        ["Azienda o capannone", "Azienda o capannone", "Ambiente produttivo o magazzino."],
        ["Altro", "Altro", "Da spiegare nei dettagli finali."],
      ],
    },
    timing: {
      eyebrow: "Domanda 4",
      title: "Quanto e urgente?",
      body: "Basta una priorita indicativa.",
      type: "options",
      key: "Priorita",
      next: "contact",
      options: [
        ["Urgente", "Urgente", "Guasto o blocco da gestire presto."],
        ["Entro 1 mese", "Entro 1 mese", "Vuoi programmare i lavori."],
        ["1-3 mesi", "1-3 mesi", "Stai raccogliendo preventivi."],
        ["Solo valutazione", "Solo valutazione", "Vuoi capire fattibilita e costi."],
      ],
    },
    contact: {
      eyebrow: "Ultimo step",
      title: "Lasciaci i dati per ricontattarti.",
      body: "Aggiungi una descrizione libera: il messaggio finale sara gia pronto.",
      type: "form",
      next: null,
    },
  };

  const answers = {};
  const path = ["service"];
  let currentId = "service";

  function currentQuestion() {
    if (currentId === "detail") {
      const selectedService = answers.ServizioValue || "elettrico";
      const detail = serviceDetails[selectedService] || serviceDetails.elettrico;
      return {
        ...questions.detail,
        title: detail.title,
        options: detail.options.map(([label, body]) => [label, label, body]),
      };
    }

    return questions[currentId];
  }

  function render() {
    const question = currentQuestion();
    const index = path.indexOf(currentId);
    const total = 5;

    if (progress) {
      progress.style.setProperty("--progress", `${((index + 1) / total) * 100}%`);
    }

    if (question.type === "form") {
      stage.innerHTML = `
        <div class="quiz-step is-active">
          <p class="eyebrow">${question.eyebrow}</p>
          <h2>${question.title}</h2>
          <p>${question.body}</p>
          <div class="form-grid">
            <div class="field">
              <label for="name">Nome e cognome</label>
              <input id="name" name="name" autocomplete="name" value="${answers.Nome || ""}" />
            </div>
            <div class="field">
              <label for="phone">Telefono</label>
              <input id="phone" name="phone" autocomplete="tel" value="${answers.Telefono || ""}" />
            </div>
            <div class="field">
              <label for="city">Comune o zona</label>
              <input id="city" name="city" autocomplete="address-level2" value="${answers.Zona || ""}" placeholder="Es. Gorizia" />
            </div>
            <div class="field">
              <label for="email">Email</label>
              <input id="email" name="email" type="email" autocomplete="email" value="${answers.Email || ""}" />
            </div>
            <div class="field field--full">
              <label for="details">Dettagli utili</label>
              <textarea id="details" name="details" placeholder="Descrivi brevemente cosa vuoi fare...">${answers.Dettagli || ""}</textarea>
            </div>
          </div>
        </div>`;
    } else {
      stage.innerHTML = `
        <div class="quiz-step is-active">
          <p class="eyebrow">${question.eyebrow}</p>
          <h2>${question.title}</h2>
          <p>${question.body}</p>
          <div class="option-grid">
            ${question.options
              .map(
                ([value, label, body]) => `
                  <button class="option-card ${answers[question.key] === label ? "is-selected" : ""}" type="button" data-value="${value}" data-label="${label}">
                    <strong>${label}</strong>
                    <span>${body}</span>
                  </button>`,
              )
              .join("")}
          </div>
        </div>`;
    }

    prevButton.disabled = currentId === "service";
    nextButton.textContent = question.next ? "Avanti" : "Aggiorna riepilogo";
    updateSummary();
  }

  function updateFormAnswers() {
    ["name", "phone", "city", "email", "details"].forEach((id) => {
      const input = document.querySelector(`#${id}`);
      if (!input) {
        return;
      }

      const labels = {
        name: "Nome",
        phone: "Telefono",
        city: "Zona",
        email: "Email",
        details: "Dettagli",
      };

      answers[labels[id]] = input.value.trim();
    });
  }

  function updateSummary() {
    updateFormAnswers();

    const rows = [
      ["Servizio", answers.Servizio || "Da selezionare"],
      ["Dettaglio", answers["Dettaglio servizio"] || "Da selezionare"],
      ["Immobile", answers.Immobile || "Da selezionare"],
      ["Priorita", answers.Priorita || "Da selezionare"],
      ["Zona", answers.Zona || "Da indicare"],
      ["Cliente", answers.Nome || "Da indicare"],
      ["Telefono", answers.Telefono || "Da indicare"],
    ];

    summaryList.innerHTML = rows
      .map(([label, value]) => `<li><small>${label}</small><span>${value}</span></li>`)
      .join("");

    const message = [
      "Richiesta preventivo ELETWAVE",
      "",
      `Servizio: ${answers.Servizio || "Da selezionare"}`,
      `Dettaglio: ${answers["Dettaglio servizio"] || "Da selezionare"}`,
      `Immobile: ${answers.Immobile || "Da selezionare"}`,
      `Priorita: ${answers.Priorita || "Da selezionare"}`,
      `Zona: ${answers.Zona || "Da indicare"}`,
      `Dettagli: ${answers.Dettagli || "Da indicare"}`,
      "",
      `Nome: ${answers.Nome || "Da indicare"}`,
      `Telefono: ${answers.Telefono || "Da indicare"}`,
      `Email: ${answers.Email || "Da indicare"}`,
    ].join("\n");

    const encodedMessage = encodeURIComponent(message);
    whatsappLink.href = `https://wa.me/393930036372?text=${encodedMessage}`;
    emailLink.href = `mailto:info@eletwave.com?subject=${encodeURIComponent(
      "Richiesta preventivo ELETWAVE",
    )}&body=${encodedMessage}`;
  }

  stage.addEventListener("click", (event) => {
    const option = event.target.closest(".option-card");
    if (!option) {
      return;
    }

    const question = currentQuestion();
    answers[question.key] = option.dataset.label;

    if (currentId === "service") {
      answers.ServizioValue = option.dataset.value;
      delete answers["Dettaglio servizio"];
    }

    stage.querySelectorAll(".option-card").forEach((card) => {
      card.classList.toggle("is-selected", card === option);
    });

    updateSummary();
  });

  stage.addEventListener("input", updateSummary);

  prevButton.addEventListener("click", () => {
    if (path.length <= 1) {
      return;
    }

    path.pop();
    currentId = path[path.length - 1];
    render();
  });

  nextButton.addEventListener("click", () => {
    const question = currentQuestion();

    if (question.type === "form") {
      updateSummary();
      document.querySelector(".quote-summary")?.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
      return;
    }

    if (!answers[question.key]) {
      stage.querySelector(".option-card")?.focus();
      return;
    }

    currentId = question.next;
    path.push(currentId);
    render();
  });

  render();
})();
