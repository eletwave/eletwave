(function () {
  const stage = document.querySelector("#quiz-stage");
  const progress = document.querySelector("#quote-progress");
  const stepLabel = document.querySelector("#quote-step-label");
  const stepCount = document.querySelector("#quote-step-count");
  const prevButton = document.querySelector("#prev-step");
  const nextButton = document.querySelector("#next-step");
  const quoteNavigation = document.querySelector("#quote-navigation");

  if (!stage) {
    return;
  }

  const { branches, categoryOrder } = window.EletwaveQuoteData;
  const answers = {};
  let current = "category";
  let selectedCategory = "";
  let selectedSubcategory = "";
  let questionIndex = 0;
  const history = [];
  const contactFields = {
    name: "Nome", phone: "Telefono", email: "Email", city: "Comune",
    address: "Indirizzo", "client-type": "Tipo cliente", vat: "P.IVA/CF",
    date: "Data desiderata", time: "Fascia oraria", notes: "Note finali",
  };
  const contactKeys = new Set([...Object.values(contactFields), "Consenso", "Foto/documenti"]);
  let downloadUrl = "";

  function clearTechnicalAnswers() {
    Object.keys(answers).forEach((key) => {
      if (!contactKeys.has(key)) delete answers[key];
    });
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  const infoText = {
    "Nuova installazione": "Per impianti o sistemi da realizzare da zero, con progettazione, materiali e installazione completa.",
    "Assistenza tecnica / riparazione": "Per guasti, anomalie, dispositivi che non funzionano o controlli urgenti su impianti esistenti.",
    "Modifica o ampliamento impianto": "Per aggiungere punti, linee, prese, luci, apparecchi o funzioni a un impianto già presente.",
    "Verifica, manutenzione o DICO": "Per controlli tecnici, manutenzioni, documentazione o verifica di conformità dell'impianto.",
    "Consulenza online / preventivo": "Per analizzare un problema, un preventivo ricevuto o capire quale soluzione conviene prima di intervenire.",
    "Kit predisposti / soluzioni pronte": "Per soluzioni già impostate, da adattare al tuo caso con installazione o supporto Eletwave.",
    "Non so / voglio un consiglio": "Per richieste non ancora chiare: ti guidiamo noi verso il percorso più adatto.",
    DICO: "Dichiarazione di Conformità. Eletwave può rilasciarla solo per lavori eseguiti, installati o verificati in loco.",
    "Non so": "Scegli questa voce se non hai ancora il dato: lo chiariremo nel contatto successivo.",
    Altro: "Usa questa voce quando la tua situazione non rientra nelle opzioni disponibili.",
    Emergenza: "Situazione potenzialmente pericolosa o bloccante, da valutare con priorità alta.",
    "Entro 24 ore": "Intervento o contatto richiesto entro la giornata successiva.",
    "Solo valutazione": "Non hai urgenza: vuoi capire costi, possibilità e soluzione migliore.",
  };

  function optionInfo(label, context = "") {
    const clean = String(label || "").trim();
    if (infoText[clean]) return infoText[clean];

    const text = clean.toLowerCase();
    const where = String(context || "").toLowerCase();

    if (/appartamento|casa|villa|b&b|negozio|ufficio|capannone|garage|cantina|esterno|giardino|terrazzo|locale/.test(text)) {
      return `Indica ${clean.toLowerCase()} come ambiente principale: aiuta a stimare spazi, accessi, posa cavi e materiali.`;
    }

    if (/kw|trifase|generatore|fornitura/.test(text)) {
      return `Seleziona ${clean} per capire potenza disponibile, protezioni del quadro e compatibilità dei carichi.`;
    }

    if (/mq|superficie|oltre|meno/.test(text)) {
      return `Serve a dimensionare tempi, quantità di materiali e complessità generale dell'intervento.`;
    }

    if (/^\d|pochi|giorni|mese|ore/.test(text)) {
      return `Quantità o tempistica indicativa per "${context || clean}": aiuta a stimare durata, priorità e materiale necessario.`;
    }

    if (/fotovoltaico|accumulo|wallbox|domotica|allarme|videosorveglianza|wi-fi|rete|smart|home assistant/.test(text)) {
      return `Predisposizione o servizio ${clean.toLowerCase()}: permette di valutare collegamenti, compatibilità e possibilità future.`;
    }

    if (/luci|prese|quadro|illuminazione|punto luce|linee|cavi|presa|forno|induzione|lavatrice|asciugatrice|climatizzatori|pompa|piscina/.test(text)) {
      return `Voce tecnica ${clean.toLowerCase()}: indica quali parti dell'impianto vanno installate, modificate o controllate.`;
    }

    if (/foto|planimetria|document|schema|relazione|report|preventivo|bolletta/.test(text)) {
      return `Materiale utile per valutare meglio la richiesta prima del contatto: se non puoi allegarlo ora, invialo dopo in chat.`;
    }

    if (/bruciato|scintille|caldo|salta|corrente|guasto|non funziona|problema/.test(text)) {
      return `Descrive il sintomo principale: serve a capire priorità, rischio e tipo di controllo necessario.`;
    }

    if (/nuova|ristrutturazione|abitata|vuota|vecchio|valutando/.test(text)) {
      return `Stato del lavoro: cambia accessibilità, tempi di posa e precisione del preventivo.`;
    }

    if (/^(sì|si|no)$/.test(text)) {
      return `Risposta rapida per confermare o escludere questa condizione nel percorso ${where || "selezionato"}.`;
    }

    return `Seleziona questa voce se "${clean}" descrive meglio la tua richiesta. Aiuta Eletwave a preparare una risposta più precisa.`;
  }

  function getBranch() {
    return branches[selectedCategory]?.subcategories?.[selectedSubcategory] || null;
  }

  function getQuestion() {
    const branch = getBranch();
    return branch?.questions?.[questionIndex] || null;
  }

  function answerText(value) {
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    return typeof value === "boolean" ? (value ? "Sì" : "No") : value || "";
  }

  function hasAnswer(question) {
    if (!question || question.optional) {
      return true;
    }

    const value = answers[question.key];
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return Boolean(typeof value === "string" ? value.trim() : value);
  }

  function allAnswerText() {
    return Object.entries(answers)
      .filter(([key]) => !contactKeys.has(key))
      .map(([, value]) => answerText(value)).join(" ").toLowerCase();
  }

  function detectResult() {
    const text = allAnswerText();
    const branch = getBranch();
    const category = branches[selectedCategory];

    if (/(odore di bruciato|scintille|quadro caldo|presa bruciata|presa scalda|non arriva corrente|emergenza)/.test(text)) {
      return {
        label: "Urgenza",
        action: "Chiama subito Eletwave se la situazione è pericolosa.",
      };
    }

    if (/(dico|evento pubblico|aperto al pubblico|area pubblica|food truck|friggitrice|forno|passaggio auto|esterno scoperto|trifase)/.test(text)) {
      return {
        label: "Verifica in loco necessaria",
        action: "Serve una verifica tecnica in presenza prima del preventivo definitivo.",
      };
    }

    if (selectedCategory === "kit") {
      return {
        label: "Kit predisposto consigliato",
        action: "Prepariamo una proposta kit distinguendo prodotto, check remoto e installazione.",
      };
    }

    if (/(oltre 200|oltre 400|oltre 3|oltre 30|30-60|oltre 60|cemento armato|pietra|muri spessi|fotovoltaico|accumulo|oltre 6 kw|10 kw|ombre)/.test(text)) {
      return {
        label: "Sopralluogo consigliato",
        action: "Conviene valutare spazi, quadro, distanze e predisposizioni dal vivo.",
      };
    }

    if (/(home assistant|configurazione app|assistenza remota|analisi preventivo|check documenti|consulenza online)/.test(text) || selectedCategory === "consulenza") {
      return {
        label: "Assistenza remota possibile",
        action: "Possiamo partire con una consulenza o analisi online.",
      };
    }

    if (selectedCategory === "modifica" && ["prese", "punti_luce"].includes(selectedSubcategory)) {
      return {
        label: "Preventivo online possibile",
        action: "I dati raccolti possono bastare per una prima stima.",
      };
    }

    return {
      label: branch?.outcome || category?.label || "Richiesta ricevuta",
      action: "Ti ricontattiamo per definire il prossimo passaggio.",
    };
  }

  function currentStepNumber() {
    const branch = getBranch();
    if (current === "category") return 1;
    if (current === "subcategory") return 2;
    if (current === "question") return 3 + questionIndex;
    if (current === "contact") return 3 + (branch?.questions?.length || 0);
    return 1;
  }

  function totalSteps() {
    const branch = getBranch();
    return 3 + (branch?.questions?.length || 0);
  }

  function setProgress() {
    const total = totalSteps();
    const step = currentStepNumber();
    const hasKnownTotal = Boolean(getBranch());
    const percent = hasKnownTotal
      ? Math.max(8, Math.min(100, (step / total) * 100))
      : current === "subcategory" ? 16 : 8;
    progress?.style.setProperty("--progress", `${percent}%`);
    if (stepLabel) {
      stepLabel.textContent = current === "contact" ? "Dati e invio" : `Step ${step}`;
    }
    if (stepCount) {
      stepCount.textContent = hasKnownTotal ? `${step}/${total}` : `${step}/…`;
    }
  }

  function optionMarkup(option, selected, valueOverride = "", context = "") {
    const label = Array.isArray(option) ? option[0] : option;
    const providedInfo = Array.isArray(option) ? option[1] : "";
    const info = providedInfo || optionInfo(label, context);
    const value = valueOverride || label;
    const infoId = `info-${context}-${value}`.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
    return `
      <div class="option-card-shell">
        <button class="option-card option-card--single ${selected ? "is-selected" : ""}" type="button" data-value="${escapeHtml(value)}">
          <strong>${escapeHtml(label)}</strong>
        </button>
        <button class="option-info" type="button" aria-label="Informazioni su ${escapeHtml(label)}" aria-controls="${infoId}" aria-expanded="false">i</button>
        <span class="option-card__info" id="${infoId}">${escapeHtml(info)}</span>
      </div>`;
  }

  function renderCategory() {
    return `
      <div class="quiz-step is-active">
        <p class="eyebrow">Domanda 1</p>
        <h2>Di cosa hai bisogno?</h2>
        <div class="option-grid">
          ${categoryOrder
            .map((id) => optionMarkup([branches[id].label, branches[id].body], selectedCategory === id, id, "categoria principale"))
            .join("")}
        </div>
      </div>`;
  }

  function renderSubcategory() {
    const category = branches[selectedCategory];
    const entries = Object.entries(category.subcategories);
    return `
      <div class="quiz-step is-active">
        <p class="eyebrow">Domanda 2</p>
        <h2>${escapeHtml(category.label)}</h2>
        <div class="option-grid">
          ${entries
            .map(([id, branch]) => optionMarkup([branch.label, branch.outcome], selectedSubcategory === id, id, category.label))
            .join("")}
        </div>
      </div>`;
  }

  function renderQuestion() {
    const question = getQuestion();
    if (!question) {
      current = "contact";
      return renderContact();
    }

    const value = answers[question.key];
    let body = "";

    if (question.type === "options") {
      body = `<div class="option-grid">${question.options.map((option) => optionMarkup(option, value === (Array.isArray(option) ? option[0] : option), "", question.title)).join("")}</div>`;
      if (question.key === "Upload disponibili" && value === "Sì") {
        body += `
          <div class="inline-notice">
            Perfetto: le foto o i documenti non vengono caricati dal sito. Inviali o allegali dopo nella chat WhatsApp o nella mail.
          </div>`;
      }
    }

    if (question.type === "multi") {
      const selected = Array.isArray(value) ? value : [];
      body = `
        <div class="option-grid">
          ${question.options
            .map((option) => {
              const label = Array.isArray(option) ? option[0] : option;
              const providedInfo = Array.isArray(option) ? option[1] : "";
              const info = providedInfo || optionInfo(label, question.title);
              const id = `check-${question.key}-${label}`.replace(/[^a-zA-Z0-9_-]/g, "-");
              const infoId = `info-${question.key}-${label}`.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
              return `
                <div class="option-card option-card--check ${selected.includes(label) ? "is-selected" : ""}">
                  <input id="${id}" type="checkbox" value="${escapeHtml(label)}" ${selected.includes(label) ? "checked" : ""} />
                  <label for="${id}">${escapeHtml(label)}</label>
                  <button class="option-info" type="button" aria-label="Informazioni su ${escapeHtml(label)}" aria-controls="${infoId}" aria-expanded="false">i</button>
                  <span class="option-card__info" id="${infoId}">${escapeHtml(info)}</span>
                </div>`;
            })
            .join("")}
        </div>`;
    }

    if (question.type === "text") {
      body = `
        <div class="form-grid">
          <div class="field field--full">
            <label for="question-input">${escapeHtml(question.title)}</label>
            <input id="question-input" maxlength="1500" value="${escapeHtml(value || "")}" placeholder="${escapeHtml(question.placeholder || "")}" />
          </div>
        </div>`;
    }

    if (question.type === "textarea") {
      body = `
        <div class="form-grid">
          <div class="field field--full">
            <label for="question-input">${escapeHtml(question.title)}</label>
            <textarea id="question-input" maxlength="1500" placeholder="${escapeHtml(question.placeholder || "")}">${escapeHtml(value || "")}</textarea>
          </div>
        </div>`;
    }

    return `
      <div class="quiz-step is-active">
        <p class="eyebrow">Domanda ${questionIndex + 3}</p>
        <h2>${escapeHtml(question.title)}</h2>
        ${question.body ? `<p class="question-help">${escapeHtml(question.body)}</p>` : ""}
        ${body}
      </div>`;
  }

  function renderContact() {
    return `
      <div class="quiz-step is-active">
        <p class="eyebrow">Ultimo step</p>
        <h2>Dati per ricontattarti.</h2>
        <div class="form-grid">
          <div class="field">
            <label for="name">Nome e cognome <span aria-hidden="true">*</span></label>
            <input id="name" maxlength="120" autocomplete="name" required aria-required="true" value="${escapeHtml(answers.Nome || "")}" />
          </div>
          <div class="field">
            <label for="phone">Telefono</label>
            <input id="phone" maxlength="32" type="tel" autocomplete="tel" aria-describedby="contact-method-help" value="${escapeHtml(answers.Telefono || "")}" />
          </div>
          <div class="field">
            <label for="email">Email</label>
            <input id="email" maxlength="254" type="email" autocomplete="email" aria-describedby="contact-method-help" value="${escapeHtml(answers.Email || "")}" />
          </div>
          <div class="field">
            <label for="city">Comune</label>
            <input id="city" maxlength="120" autocomplete="address-level2" value="${escapeHtml(answers.Comune || "")}" placeholder="Es. Romans d'Isonzo" />
          </div>
          <div class="field field--full">
            <label for="address">Indirizzo intervento opzionale</label>
            <input id="address" maxlength="240" value="${escapeHtml(answers.Indirizzo || "")}" />
          </div>
          <div class="field">
            <label for="client-type">Tipo cliente</label>
            <input id="client-type" maxlength="100" value="${escapeHtml(answers["Tipo cliente"] || "")}" placeholder="Privato, azienda, B&B..." />
          </div>
          <div class="field">
            <label for="vat">P.IVA o codice fiscale opzionale</label>
            <input id="vat" maxlength="32" value="${escapeHtml(answers["P.IVA/CF"] || "")}" />
          </div>
          <div class="field">
            <label for="date">Data desiderata</label>
            <input id="date" value="${escapeHtml(answers["Data desiderata"] || "")}" placeholder="Es. prossima settimana" />
          </div>
          <div class="field">
            <label for="time">Fascia oraria preferita</label>
            <input id="time" maxlength="100" value="${escapeHtml(answers["Fascia oraria"] || "")}" placeholder="Mattina, pomeriggio..." />
          </div>
          <div class="field field--full">
            <label for="notes">Note finali</label>
            <textarea id="notes" maxlength="1500" placeholder="Aggiungi dettagli, vincoli o preferenze...">${escapeHtml(answers["Note finali"] || "")}</textarea>
          </div>
          <div class="field field--full field--attachment-note">
            <strong>Foto e documenti</strong>
            <small>Il sito non carica allegati: se hai foto, planimetrie o documenti utili, inviali dopo nella chat WhatsApp o allegali alla mail.</small>
          </div>
          <p class="field field--full field-help" id="contact-method-help">Inserisci almeno un recapito tra telefono ed email.</p>
          <div class="field field--full field--consent">
            <input id="consent" type="checkbox" required aria-required="true" ${answers.Consenso ? "checked" : ""} />
            <span><label for="consent">Confermo la correttezza delle informazioni e acconsento a essere contattato da Eletwave.</label> Consulta la <a href="./privacy-policy.html" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.</span>
          </div>
          <p class="contact-status field--full" id="contact-status" aria-live="polite">Per inviare servono nome, telefono o email e consenso.</p>
          <div class="final-send-panel field--full">
            <a class="button button--primary is-disabled" data-send="whatsapp" aria-disabled="true" target="_blank" rel="noopener noreferrer">
              Invia WhatsApp
            </a>
            <a class="button button--ghost is-disabled" data-send="email" aria-disabled="true">
              Invia email
            </a>
          </div>
          <p class="field-help field--full" id="long-message-notice" hidden></p>
          <details class="request-preview field--full">
            <summary>Riepilogo della richiesta</summary>
            <label for="message-preview">Testo completo</label>
            <textarea id="message-preview" readonly rows="10"></textarea>
          </details>
          <div class="request-tools field--full">
            <button class="button button--ghost" type="button" id="copy-request">Copia richiesta</button>
            <a id="download-request" download="richiesta-eletwave.txt">Scarica richiesta (.txt)</a>
            <span id="copy-status" role="status"></span>
          </div>
        </div>
      </div>`;
  }

  function render(moveFocus = true) {
    setProgress();

    if (current === "category") {
      stage.innerHTML = renderCategory();
    } else if (current === "subcategory") {
      stage.innerHTML = renderSubcategory();
    } else if (current === "question") {
      stage.innerHTML = renderQuestion();
    } else {
      stage.innerHTML = renderContact();
    }

    const question = current === "question" ? getQuestion() : null;
    const needsConfirmation = Boolean(
      question &&
      (["multi", "text", "textarea"].includes(question.type) || question.key === "Upload disponibili"),
    );

    prevButton.hidden = history.length === 0;
    nextButton.hidden = !needsConfirmation;
    nextButton.textContent = question?.type === "multi" ? "Conferma selezione" : "Continua";
    quoteNavigation.hidden = prevButton.hidden && nextButton.hidden;
    if (current === "contact") updateSendPanel();
    if (moveFocus) {
      const heading = stage.querySelector("h2");
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
      if (stage.getBoundingClientRect().top < 48) {
        heading.scrollIntoView({ block: "start", behavior: "instant" });
      }
    }
  }

  function remember() {
    history.push({
      current,
      selectedCategory,
      selectedSubcategory,
      questionIndex,
      answers: JSON.parse(JSON.stringify(answers)),
    });
  }

  function restore(snapshot) {
    current = snapshot.current;
    selectedCategory = snapshot.selectedCategory;
    selectedSubcategory = snapshot.selectedSubcategory;
    questionIndex = snapshot.questionIndex;
    clearTechnicalAnswers();
    Object.entries(snapshot.answers).forEach(([key, value]) => {
      if (!contactKeys.has(key)) answers[key] = value;
    });
  }

  function goNext() {
    saveCurrentInputs();

    if (current === "category") {
      if (!selectedCategory) return;
      remember();
      current = "subcategory";
      selectedSubcategory = "";
      render();
      return;
    }

    if (current === "subcategory") {
      if (!selectedSubcategory) return;
      remember();
      current = "question";
      questionIndex = 0;
      render();
      return;
    }

    if (current === "question") {
      const question = getQuestion();
      if (!hasAnswer(question)) {
        focusFirstInput();
        return;
      }

      remember();
      const branch = getBranch();
      if (questionIndex < branch.questions.length - 1) {
        questionIndex += 1;
      } else {
        current = "contact";
      }
      render();
      return;
    }

    updateSendPanel();
  }

  function focusFirstInput() {
    stage.querySelector("button, input, textarea")?.focus();
  }

  function saveCurrentInputs() {
    if (current !== "question" && current !== "contact") {
      return;
    }

    if (current === "question") {
      const question = getQuestion();
      if (!question) return;

      if (question.type === "multi") {
        answers[question.key] = Array.from(stage.querySelectorAll("input[type='checkbox']:checked")).map((input) => input.value);
      }

      if (question.type === "text" || question.type === "textarea") {
        answers[question.key] = stage.querySelector("#question-input")?.value.trim() || "";
      }
    }

    if (current === "contact") {
      Object.entries(contactFields).forEach(([id, key]) => {
        answers[key] = document.querySelector(`#${id}`)?.value.trim() || "";
      });
      answers["Foto/documenti"] = "Se disponibili, da inviare o allegare dopo in chat WhatsApp o email";
      answers.Consenso = Boolean(document.querySelector("#consent")?.checked);
    }
  }

  function responseRows() {
    return Object.entries(answers)
      .filter(([key]) => !["Categoria", "Sottocategoria", "CategoriaValue", "SottocategoriaValue"].includes(key))
      .map(([key, value]) => [key, answerText(value) || "Non indicato"]);
  }

  function contactIsReady() {
    if (current !== "contact") return false;

    const name = String(answers.Nome || "").trim();
    const rawPhone = String(answers.Telefono || "").trim();
    const phone = rawPhone.replace(/\D/g, "");
    const phoneIsValid = !rawPhone || (/^\+?[\d\s().-]+$/.test(rawPhone) && phone.length >= 6 && phone.length <= 15);
    const email = String(answers.Email || "").trim();
    const emailIsValid = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const hasContact = phone.length >= 6 || Boolean(email && emailIsValid);

    return name.length >= 2 && hasContact && phoneIsValid && emailIsValid && answers.Consenso === true;
  }

  function setSendLink(link, href, enabled) {
    if (!link) return;

    link.classList.toggle("is-disabled", !enabled);
    link.setAttribute("aria-disabled", String(!enabled));
    link.tabIndex = enabled ? 0 : -1;
    if (enabled) {
      link.href = href;
    } else {
      link.removeAttribute("href");
    }
  }

  function buildMessage() {
    const result = detectResult();
    const category = branches[selectedCategory]?.label || "Da selezionare";
    const branch = getBranch()?.label || "Da selezionare";
    const messageLines = [
      "Richiesta preventivo ELETWAVE",
      "",
      `Categoria principale: ${category}`,
      `Sottocategoria tecnica: ${branch}`,
      `Risultato automatico: ${result.label}`,
      `Azione suggerita: ${result.action}`,
      "",
      "Risposte configuratore:",
      ...responseRows().map(([key, value]) => `- ${key}: ${value}`),
      "",
      "Nota DICO: la Dichiarazione di Conformità viene rilasciata solo per lavori eseguiti, installati o verificati in loco da Eletwave, secondo la normativa applicabile.",
    ];

    return messageLines.join("\n");
  }

  function updateSendPanel() {
    if (current !== "contact") return;
    saveCurrentInputs();
    const message = buildMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappHref = `https://wa.me/393930036372?text=${encodedMessage}`;
    const emailHref = `mailto:info@eletwave.com?subject=${encodeURIComponent("Richiesta preventivo ELETWAVE")}&body=${encodedMessage}`;
    const canSend = contactIsReady();
    // Conservative limits: the full request always remains available below.
    const longWhatsapp = whatsappHref.length > 7000;
    const longEmail = emailHref.length > 1800;
    setSendLink(stage.querySelector("[data-send='whatsapp']"),
      longWhatsapp ? "https://wa.me/393930036372" : whatsappHref, canSend);
    setSendLink(stage.querySelector("[data-send='email']"),
      longEmail ? "mailto:info@eletwave.com?subject=Richiesta%20preventivo%20ELETWAVE" : emailHref, canSend);
    const preview = stage.querySelector("#message-preview");
    preview.value = message;
    const notice = stage.querySelector("#long-message-notice");
    notice.hidden = !(longWhatsapp || longEmail);
    notice.textContent = longWhatsapp
      ? "La richiesta è lunga: copia il testo qui sotto e incollalo in WhatsApp o nella mail, oppure allega il file scaricato."
      : "Per email, copia il testo qui sotto e incollalo nel messaggio, oppure allega il file scaricato. WhatsApp include già la richiesta.";
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    downloadUrl = URL.createObjectURL(new Blob([message], { type: "text/plain;charset=utf-8" }));
    stage.querySelector("#download-request").href = downloadUrl;
    const status = stage.querySelector("#contact-status");
    status.classList.toggle("is-ready", canSend);
    const statusText = canSend
      ? "Dati completi: puoi inviare la richiesta con WhatsApp o email."
      : "Per inviare servono nome, un recapito valido e il consenso.";
    if (status.textContent !== statusText) status.textContent = statusText;
  }

  function onInput() {
    saveCurrentInputs();
    if (current === "contact") updateSendPanel();
  }

  stage.addEventListener("click", (event) => {
    const info = event.target.closest(".option-info");
    if (info) {
      event.preventDefault();
      event.stopPropagation();
      const card = info.closest(".option-card-shell, .option-card");
      const willOpen = !card?.classList.contains("is-info-open");
      stage.querySelectorAll(".is-info-open").forEach((openCard) => {
        if (openCard !== card) {
          openCard.classList.remove("is-info-open");
          openCard.querySelector(".option-info")?.setAttribute("aria-expanded", "false");
        }
      });
      card?.classList.toggle("is-info-open", willOpen);
      info.setAttribute("aria-expanded", String(willOpen));
      return;
    }

    const option = event.target.closest(".option-card");
    if (!option) {
      return;
    }

    if (option.classList.contains("option-card--check")) {
      if (event.target.matches("input, label")) return;
      event.preventDefault();
      const checkbox = option.querySelector("input[type='checkbox']");
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
        option.classList.toggle("is-selected", checkbox.checked);
        saveCurrentInputs();
        updateSendPanel();
      }
      return;
    }

    const value = option.dataset.value;

    if (current === "category") {
      selectedCategory = value;
      selectedSubcategory = "";
      clearTechnicalAnswers();
      answers.Consenso = false;
      answers.Categoria = branches[value].label;
      answers.CategoriaValue = value;
      updateSendPanel();
      goNext();
      return;
    }

    if (current === "subcategory") {
      selectedSubcategory = value;
      const branch = getBranch();
      Object.keys(answers).forEach((key) => {
        if (!contactKeys.has(key) && !["Categoria", "CategoriaValue"].includes(key)) {
          delete answers[key];
        }
      });
      answers.Consenso = false;
      answers.Sottocategoria = branch.label;
      answers.SottocategoriaValue = value;
      updateSendPanel();
      goNext();
      return;
    }

    if (current === "question") {
      const question = getQuestion();
      answers[question.key] = value;
      stage.querySelectorAll(".option-card").forEach((card) => card.classList.toggle("is-selected", card === option));
      updateSendPanel();
      if (question.key === "Upload disponibili") {
        render();
        return;
      }
      goNext();
    }
  });

  stage.addEventListener("change", (event) => {
    if (event.target.matches("input[type='checkbox']")) {
      const card = event.target.closest(".option-card");
      card?.classList.toggle("is-selected", event.target.checked);
      saveCurrentInputs();
      updateSendPanel();
      return;
    }

    updateSendPanel();
  });

  stage.addEventListener("input", onInput);

  prevButton.addEventListener("click", () => {
    saveCurrentInputs();
    const snapshot = history.pop();
    if (!snapshot) return;
    restore(snapshot);
    render();
  });

  nextButton.addEventListener("click", goNext);

  document.querySelector("#quote-form").addEventListener("submit", (event) => {
    event.preventDefault();
    if (current !== "contact") goNext();
  });
  stage.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && event.target.matches("input:not([type='checkbox'])")) {
      event.preventDefault();
      if (current === "question") goNext();
    }
  });
  stage.addEventListener("click", async (event) => {
    if (!event.target.closest("#copy-request")) return;
    const preview = stage.querySelector("#message-preview");
    try {
      await navigator.clipboard.writeText(preview.value);
      stage.querySelector("#copy-status").textContent = "Richiesta copiata.";
    } catch {
      preview.closest("details").open = true;
      preview.focus();
      preview.select();
      stage.querySelector("#copy-status").textContent = "Selezione pronta: copia il testo.";
    }
  });

  render(false);
})();
