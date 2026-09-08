(function () {
  "use strict";

  const data = window.EletwaveQuoteData;
  const form = document.getElementById("quote-form");
  if (!data || !form) return;
  const { services, branches, intents } = data;
  const stage = document.getElementById("quiz-stage");
  const nextButton = document.getElementById("next-step");
  const backButton = document.getElementById("prev-step");
  const resetDialog = document.getElementById("reset-dialog");
  const status = document.getElementById("quote-status");
  const contactKeys = ["name", "city", "phone", "email", "notes"];
  const blankState = () => ({
    view: "service", service: "", intent: "", branch: "", index: 0,
    answers: {}, contact: { name: "", city: "", phone: "", email: "", notes: "" },
    consent: false, editing: false, contactErrors: false,
  });
  let state = blankState();
  let editSnapshot = null;
  let downloadUrl = "";

  const escape = value => String(value ?? "").replace(/[&<>"']/g, char =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  const icon = name => '<svg class="icon" aria-hidden="true"><use href="./assets/quote-icons.svg#' + name + '"></use></svg>';
  const optionLabel = value => Array.isArray(value) ? value[0] : value;
  const currentBranch = () => branches[state.intent]?.subcategories[state.branch];
  const questions = () => currentBranch()?.questions || [];
  const currentQuestion = () => questions()[state.index];
  const chosenRoutes = () => services[state.service]?.routes[state.intent] || [];
  const answerText = value => Array.isArray(value) ? value.join(", ") : String(value ?? "");
  const hasValue = value => Array.isArray(value) ? value.length > 0 : String(value ?? "").trim().length > 0;
  const exclusive = value => /^(non so\b|non saprei\b|nessun[oa]?\b|nessuno\b|niente\b|da definire\b)/i.test(value);
  const stepIndex = () => ({ questions: 1, contact: 2, review: 3 })[state.view] ?? 0;
  const editButton = (action, label, index = "") => '<button type="button" class="icon-button" data-action="' + action + '" data-index="' + index + '" aria-label="' + escape(label) + '" title="' + escape(label) + '">' + icon("pencil") + "</button>";

  function heading(title, body = "", counter = "") {
    return '<div class="stage-heading">' + (counter ? '<span class="question-counter">' + escape(counter) + "</span>" : "") +
      '<h2 id="stage-title" tabindex="-1">' + escape(title) + "</h2>" +
      (body ? "<p>" + escape(body) + "</p>" : "") + "</div>";
  }

  function choice(value, label, body = "", symbol = "", selected = false, extra = "") {
    return '<button type="button" class="choice ' + extra + '" data-choice="' + escape(value) + '" aria-pressed="' + selected + '">' +
      (symbol ? '<span class="choice__icon">' + icon(symbol) + "</span>" : "") +
      '<span class="choice__text"><strong>' + escape(label) + "</strong>" + (body ? "<small>" + escape(body) + "</small>" : "") +
      '</span><svg class="icon choice__arrow" aria-hidden="true"><use href="./assets/quote-icons.svg#chevron-right"></use></svg></button>';
  }

  function renderProgress() {
    const current = stepIndex();
    document.querySelectorAll("#quote-steps li").forEach((item, index) => {
      if (index === current) item.setAttribute("aria-current", "step");
      else item.removeAttribute("aria-current");
      item.classList.toggle("is-complete", index < current);
      item.querySelector(".step-number").innerHTML = index < current ? icon("check") : index + 1;
    });
    document.getElementById("restart").hidden = !state.service;
    const service = services[state.service];
    const branch = currentBranch();
    const count = questions().filter(q => hasValue(state.answers[q.key])).length;
    document.getElementById("request-summary").innerHTML = '<span class="aside-caption">La tua richiesta</span>' +
      (service ? '<div class="summary-line">' + icon(service.icon) + "<div><strong>" + escape(service.label) + "</strong>" +
        (state.intent ? "<small>" + escape(intents[state.intent].label) + "</small>" : "") + "</div></div>" +
        (branch ? "<p>" + escape(branch.label) + "</p>" : "") +
        (state.view !== "service" ? '<button type="button" class="text-link" data-action="edit-service">' + icon("pencil") + "Modifica intervento</button>" : "") +
        (branch ? '<p class="summary-count">' + count + " di " + questions().length + " dettagli compilati</p>" : "") :
        "<h3>Il tuo prossimo progetto<br>inizia da qui.</h3><p>Raccontaci cosa ti serve. Valuteremo insieme l'intervento e il preventivo.</p>") +
      '<p class="summary-count">Nessun pagamento online.<br>La richiesta non è vincolante.</p>';
  }

  function renderSelection() {
    if (state.view === "service") {
      stage.innerHTML = heading("Di quale impianto hai bisogno?", "Un nuovo progetto, una modifica o un problema da risolvere.") +
        '<div class="choice-grid">' + Object.entries(services).map(([id, service]) =>
          choice(id, service.label, service.body, service.icon, state.service === id,
            "choice--service" + (id === "consiglio" ? " choice--advice" : ""))).join("") + "</div>";
    } else if (state.view === "intent") {
      stage.innerHTML = heading("Che cosa vorresti fare?", "", services[state.service].label) +
        '<div class="choice-grid">' + Object.keys(services[state.service].routes).map(id =>
          choice(id, intents[id].label, intents[id].body, intents[id].icon, state.intent === id)).join("") + "</div>";
    } else {
      stage.innerHTML = heading("Quale intervento ti serve?", "", services[state.service].label + " · " + intents[state.intent].label) +
        '<div class="choice-grid choice-grid--answers">' + chosenRoutes().map(id =>
          choice(id, branches[state.intent].subcategories[id].label, "", "", state.branch === id)).join("") + "</div>";
    }
  }

  function renderQuestion() {
    const q = currentQuestion();
    const value = state.answers[q.key];
    const multi = q.type === "multi";
    const isText = q.type === "text" || q.type === "textarea";
    const upload = q.key === "Upload disponibili";
    stage.innerHTML = '<div class="detail-progress" aria-hidden="true"><span style="width:' +
      Math.round(state.index / questions().length * 100) + '%"></span></div>' +
      heading(q.title, upload ? "Potrai allegarli nella chat o nell'email, dopo aver aperto la richiesta." :
        q.body || (multi ? "Puoi indicare più esigenze." : ""), "Dettaglio " + (state.index + 1) + " di " + questions().length + " · " + services[state.service].label);

    if (isText) {
      stage.innerHTML += '<label class="sr-only" for="question-input">' + escape(q.title) + "</label>" +
        (q.type === "textarea" ? '<textarea id="question-input" class="question-input" maxlength="1500" rows="5" placeholder="' + escape(q.placeholder || "Aggiungi un dettaglio") + '">' + escape(value || "") + "</textarea>" :
          '<input id="question-input" class="question-input" type="text" maxlength="1500" placeholder="' + escape(q.placeholder || "Aggiungi un dettaglio") + '" value="' + escape(value || "") + '">') +
        '<p class="character-count"><span id="character-count">' + String(value || "").length + "</span> / 1500</p>";
    } else {
      stage.innerHTML += '<div class="choice-grid choice-grid--answers" role="group" aria-labelledby="stage-title">' +
        q.options.map((option, index) => {
          const label = optionLabel(option);
          const body = Array.isArray(option) ? option[1] : "";
          if (!multi) return choice(label, label, body, "", value === label);
          return '<label class="choice choice--check" for="option-' + index + '"><input id="option-' + index +
            '" type="checkbox" value="' + escape(label) + '"' + (Array.isArray(value) && value.includes(label) ? " checked" : "") +
            '><span class="choice__text"><strong>' + escape(label) + "</strong>" + (body ? "<small>" + escape(body) + "</small>" : "") + "</span></label>";
        }).join("") + "</div>";
    }
    if (upload) stage.innerHTML += '<div class="notice notice--info"><p>' + icon("paperclip") + " " + escape(q.body) + "</p></div>";
    if (q.key !== "Descrizione" && (!q.options?.some(option => exclusive(optionLabel(option))) || multi)) {
      stage.innerHTML += '<button type="button" class="text-link skip-question" data-action="skip">' +
        (upload ? "Non ora" : "Non lo so / da definire") + "</button>";
    }
    nextButton.hidden = !multi && !isText;
    nextButton.querySelector("span").textContent = state.editing ? "Salva risposta" : "Conferma";
    nextButton.disabled = !hasValue(value);
  }

  function field(id, label, type = "text", autocomplete = "", full = false, placeholder = "") {
    return '<div class="field' + (full ? " field--full" : "") + '"><label for="' + id + '">' + label + "</label>" +
      '<input id="' + id + '" name="' + id + '" type="' + type + '" autocomplete="' + autocomplete + '" maxlength="' +
      (id === "phone" ? 30 : id === "email" ? 254 : 100) + '" value="' + escape(state.contact[id]) + '" placeholder="' + escape(placeholder) +
      '" aria-describedby="' + id + '-error"' + (["name", "city"].includes(id) ? ' required' : "") + '>' +
      '<p class="field-error" id="' + id + '-error" hidden></p></div>';
  }

  function renderContact() {
    stage.innerHTML = heading("Come possiamo ricontattarti?", "Bastano il tuo nome, il comune dell'intervento e almeno un recapito.") +
      '<div class="contact-fields">' +
      field("name", "Nome e cognome", "text", "name", false, "Mario Rossi") +
      field("city", "Comune dell'intervento", "text", "address-level2", false, "Es. Gorizia") +
      field("phone", "Telefono", "tel", "tel", false, "+39") +
      field("email", "Email", "email", "email", false, "nome@esempio.it") +
      '<div class="field field--full"><label for="notes">Vuoi aggiungere qualcosa? <span class="field-hint">(facoltativo)</span></label>' +
      '<textarea id="notes" name="notes" maxlength="1500" rows="4" placeholder="Esigenze particolari, orari per ricontattarti, altri dettagli…">' + escape(state.contact.notes) + "</textarea></div></div>" +
      '<label class="consent"><input type="checkbox" id="consent" required aria-describedby="consent-error"' + (state.consent ? " checked" : "") + '>' +
      '<span>Ho letto la <a href="./privacy-policy.html" target="_blank" rel="noopener noreferrer">Privacy Policy</a> e acconsento al trattamento dei dati per rispondere alla mia richiesta.</span></label>' +
      '<p class="field-error" id="consent-error" hidden></p>' +
      '<p class="contact-note">' + icon("lock-keyhole") + "<span>I dati restano in questa pagina finché non scegli di condividerli tramite WhatsApp o email.</span></p>";
    nextButton.hidden = false;
    nextButton.disabled = false;
    nextButton.querySelector("span").textContent = state.editing ? "Salva contatti" : "Rivedi richiesta";
    if (state.contactErrors) validateContact();
  }

  function contactIssues() {
    const c = state.contact;
    const issues = {};
    if (c.name.trim().length < 2) issues.name = "Inserisci il tuo nome.";
    if (c.city.trim().length < 2) issues.city = "Indica il comune dell'intervento.";
    if (!c.phone.trim() && !c.email.trim()) {
      issues.phone = "Inserisci un telefono oppure un'email.";
      issues.email = "È sufficiente uno dei due recapiti.";
    }
    if (c.phone.trim() && (!/^\+?[\d\s().-]+$/.test(c.phone.trim()) || !/^\d{6,15}$/.test(c.phone.replace(/\D/g, "")))) {
      issues.phone = "Controlla il numero di telefono.";
    }
    if (c.email.trim() && !/^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/.test(c.email.trim())) issues.email = "Controlla l'indirizzo email.";
    if (!state.consent) issues.consent = "Conferma la lettura della Privacy Policy.";
    return issues;
  }

  function validateContact(focus = false) {
    const issues = contactIssues();
    for (const key of ["name", "city", "phone", "email", "consent"]) {
      const input = document.getElementById(key);
      const error = document.getElementById(key + "-error");
      input.setAttribute("aria-invalid", String(Boolean(issues[key])));
      error.textContent = issues[key] || "";
      error.hidden = !issues[key];
    }
    if (focus && Object.keys(issues).length) {
      document.getElementById(Object.keys(issues)[0]).focus();
      status.textContent = "Controlla i dati evidenziati: " + Object.values(issues).join(" ");
    }
    return !Object.keys(issues).length;
  }

  function makeMessage() {
    const c = state.contact;
    return [
      "RICHIESTA PREVENTIVO ELETWAVE",
      "",
      "Servizio: " + services[state.service].label,
      "Richiesta: " + intents[state.intent].label,
      "Intervento: " + currentBranch().label,
      "",
      "DETTAGLI",
      ...questions().map(q => (q.key === "Upload disponibili" ? "Foto o documenti disponibili" : q.key) + ": " + answerText(state.answers[q.key] || "Da definire")),
      "",
      "CONTATTI",
      "Nome: " + c.name.trim(),
      "Comune: " + c.city.trim(),
      ...(c.phone.trim() ? ["Telefono: " + c.phone.trim()] : []),
      ...(c.email.trim() ? ["Email: " + c.email.trim()] : []),
      ...(c.notes.trim() ? ["", "Note: " + c.notes.trim()] : []),
      "",
      "Richiesta non vincolante, soggetta a valutazione tecnica.",
      "Consenso al trattamento dei dati per rispondere alla richiesta: sì.",
    ].join("\n");
  }

  function urgent() {
    return questions().some(q => /urgenza|urgente/i.test(q.key + " " + q.title) &&
      /^(emergenza|entro 24 ore|sì)$/i.test(answerText(state.answers[q.key])));
  }

  function renderReview() {
    const message = makeMessage();
    const whatsapp = "https://wa.me/393930036372?text=" + encodeURIComponent(message);
    const emailBase = "mailto:info@eletwave.com?subject=" + encodeURIComponent("Richiesta preventivo - " + services[state.service].label);
    const email = emailBase + "&body=" + encodeURIComponent(message);
    const longWhatsapp = whatsapp.length > 7000;
    const longEmail = email.length > 1800;
    stage.innerHTML = heading("La tua richiesta, pronta da condividere.", "Controlla i dettagli prima di aprire WhatsApp o email. L'invio avverrà dall'app che scegli.") +
      '<section class="review-section"><div class="review-section__heading"><h3>Intervento</h3>' + editButton("edit-service", "Modifica intervento") + "</div>" +
      '<div class="review-path">' + icon(services[state.service].icon) + "<div><strong>" + escape(services[state.service].label) +
      "</strong><small>" + escape(intents[state.intent].label + " · " + currentBranch().label) + "</small></div></div>" +
      '<dl class="review-list">' + questions().map((q, index) => '<div class="review-row"><dt>' +
        escape(q.key === "Upload disponibili" ? "Foto o documenti" : q.key) + "</dt><dd>" +
        escape(answerText(state.answers[q.key] || "Da definire")) + "</dd><dd>" + editButton("edit-answer", "Modifica: " + q.title, index) + "</dd></div>").join("") +
      '</dl></section><section class="review-section"><div class="review-section__heading"><h3>Contatti</h3>' +
      editButton("edit-contact", "Modifica contatti") + '</div><dl class="review-list">' +
      Object.entries({ name: "Nome", city: "Comune", phone: "Telefono", email: "Email", notes: "Note" }).filter(([key]) => state.contact[key].trim()).map(([key, label]) =>
        '<div class="review-row"><dt>' + label + "</dt><dd>" + escape(state.contact[key].trim()) + "</dd></div>").join("") + "</dl></section>" +
      (urgent() ? '<div class="notice"><p><strong>Hai indicato una richiesta urgente.</strong> Per verificare la disponibilità, chiamaci direttamente al <a href="tel:+393930036372">+39 393 003 6372</a>. Il modulo non garantisce un intervento immediato.</p></div>' : "") +
      (state.answers["Upload disponibili"] === "Sì" ? '<div class="notice notice--info"><p>' + icon("paperclip") + " Ricordati di aggiungere foto e documenti nella chat o nell'email.</p></div>" : "") +
      '<section class="send-section"><h3>Come vuoi inviarla?</h3><p>Valuteremo la richiesta e ti ricontatteremo per i prossimi passi.</p>' +
      (longWhatsapp || longEmail ? '<div class="notice" id="long-message-notice"><p>La richiesta supera lo spazio disponibile nel collegamento ' +
        (longWhatsapp ? "WhatsApp e email" : "email") + '. <strong>Copia il testo o scaricalo</strong>, poi incollalo o allegalo al messaggio ' +
        (longWhatsapp ? "nella chat o nell’email" : "nell’email") + " prima di inviare.</p></div>" : "") +
      '<div class="send-actions"><a class="button button--primary" data-send="whatsapp" href="' + escape(longWhatsapp ? "https://wa.me/393930036372" : whatsapp) +
      '" target="_blank" rel="noopener noreferrer">' + icon("message-circle") + "Apri WhatsApp</a>" +
      '<a class="button button--quiet" data-send="email" href="' + escape(longEmail ? emailBase : email) + '">' + icon("mail") + "Apri email</a></div>" +
      '<div class="export-actions"><button type="button" class="text-link" id="copy-request" data-action="copy">' + icon("copy") + 'Copia testo</button>' +
      '<button type="button" class="text-link" id="download-request" data-action="download">' + icon("download") + "Scarica richiesta</button></div>" +
      '<p class="send-status" id="send-status" role="status"></p><details class="preview" id="message-details"><summary>Testo completo della richiesta</summary>' +
      '<label class="sr-only" for="message-preview">Testo da inviare</label><textarea id="message-preview" class="question-input" readonly>' + escape(message) + "</textarea></details></section>";
  }

  function render(focus = true) {
    nextButton.hidden = true;
    backButton.hidden = state.view === "service";
    backButton.innerHTML = icon("arrow-left") + (state.editing ? "Annulla" : "Indietro");
    renderProgress();
    if (["service", "intent", "branch"].includes(state.view)) renderSelection();
    else if (state.view === "questions") renderQuestion();
    else if (state.view === "contact") renderContact();
    else renderReview();
    if (focus) {
      stage.querySelector("h2").focus({ preventScroll: true });
      const top = stage.getBoundingClientRect().top;
      if (top < 16 || window.scrollY > 180) stage.scrollIntoView({ block: "start" });
    }
  }

  function clearDetails() {
    editSnapshot = null;
    state.answers = {};
    state.index = 0;
    state.editing = false;
    state.consent = false;
    state.contactErrors = false;
  }

  function select(value) {
    if (state.view === "service") {
      if (!(value in services)) return;
      if (state.service !== value) {
        clearDetails();
        state.intent = "";
        state.branch = "";
      }
      state.service = value;
      if (value === "consiglio") {
        state.intent = "consiglio";
        state.branch = "consiglio";
        state.index = 0;
        state.view = "questions";
      } else state.view = "intent";
    } else if (state.view === "intent") {
      if (!(value in services[state.service].routes)) return;
      if (state.intent !== value) {
        clearDetails();
        state.branch = "";
      }
      state.intent = value;
      if (chosenRoutes().length === 1) {
        state.branch = chosenRoutes()[0];
        state.index = 0;
        state.view = "questions";
      } else state.view = "branch";
    } else if (state.view === "branch") {
      if (!chosenRoutes().includes(value)) return;
      if (state.branch !== value) clearDetails();
      state.branch = value;
      state.index = 0;
      state.view = "questions";
    } else if (state.view === "questions") {
      state.answers[currentQuestion().key] = value;
      advanceQuestion();
      return;
    }
    render();
  }

  function advanceQuestion() {
    if (state.editing) {
      editSnapshot = null;
      state.editing = false;
      state.view = "review";
    } else if (state.index < questions().length - 1) state.index++;
    else state.view = "contact";
    render();
  }

  function goBack() {
    if (state.editing) {
      Object.assign(state, editSnapshot);
      editSnapshot = null;
      state.editing = false;
      state.view = "review";
    } else if (state.view === "intent") state.view = "service";
    else if (state.view === "branch") state.view = "intent";
    else if (state.view === "questions") {
      if (state.index > 0) state.index--;
      else state.view = state.service === "consiglio" ? "service" : chosenRoutes().length > 1 ? "branch" : "intent";
    } else if (state.view === "contact") {
      state.view = "questions";
      state.index = questions().length - 1;
    } else if (state.view === "review") state.view = "contact";
    render();
  }

  function goNext() {
    if (state.view === "questions" && hasValue(state.answers[currentQuestion().key])) advanceQuestion();
    else if (state.view === "contact") {
      state.contactErrors = true;
      if (validateContact(true)) {
        editSnapshot = null;
        state.view = "review";
        state.editing = false;
        render();
      }
    }
  }

  async function copyMessage() {
    const message = makeMessage();
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(message);
      const result = document.getElementById("send-status");
      if (result) result.textContent = "Testo copiato. Puoi incollarlo nel messaggio.";
    } catch {
      const details = document.getElementById("message-details");
      if (!details) return;
      details.open = true;
      const preview = document.getElementById("message-preview");
      preview.focus();
      preview.select();
      document.getElementById("send-status").textContent = "Copia automatica non disponibile. Il testo è selezionato per la copia manuale.";
    }
  }

  function beginEdit(view, index = state.index) {
    editSnapshot = { answers: structuredClone(state.answers), contact: { ...state.contact }, consent: state.consent };
    state.view = view;
    state.index = index;
    state.editing = true;
    render();
  }

  document.getElementById("quote-workspace").addEventListener("click", event => {
    const target = event.target.closest("[data-choice], [data-action]");
    if (!target) return;
    if (target.hasAttribute("data-choice")) {
      select(target.dataset.choice);
      return;
    }
    const action = target.dataset.action;
    if (action === "skip") {
      state.answers[currentQuestion().key] = currentQuestion().key === "Upload disponibili" ? "Non ora" : "Da definire";
      advanceQuestion();
    } else if (action === "edit-answer") {
      beginEdit("questions", Number(target.dataset.index));
    } else if (action === "edit-contact") {
      beginEdit("contact");
    } else if (action === "edit-service") {
      // Leave a pending edit without replacing its previously confirmed values.
      if (editSnapshot) Object.assign(state, editSnapshot);
      editSnapshot = null;
      state.view = "service";
      state.editing = false;
      render();
    } else if (action === "copy") {
      void copyMessage();
    } else if (action === "download") {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      downloadUrl = URL.createObjectURL(new Blob([makeMessage()], { type: "text/plain;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "richiesta-eletwave.txt";
      link.click();
    }
  });

  form.addEventListener("input", event => {
    const input = event.target;
    if (state.view === "questions" && input.id === "question-input") {
      state.answers[currentQuestion().key] = input.value;
      document.getElementById("character-count").textContent = input.value.length;
      nextButton.disabled = !hasValue(input.value);
    } else if (state.view === "contact" && contactKeys.includes(input.id)) {
      state.contact[input.id] = input.value;
      if (state.contactErrors) validateContact();
    }
  });

  form.addEventListener("change", event => {
    const input = event.target;
    if (input.id === "consent") {
      state.consent = input.checked;
      if (state.contactErrors) validateContact();
    } else if (state.view === "questions" && input.type === "checkbox") {
      const inputs = [...stage.querySelectorAll('input[type="checkbox"]')];
      if (input.checked) {
        inputs.filter(other => other !== input && (exclusive(input.value) || exclusive(other.value))).forEach(other => { other.checked = false; });
      }
      state.answers[currentQuestion().key] = inputs.filter(other => other.checked).map(other => other.value);
      nextButton.disabled = !hasValue(state.answers[currentQuestion().key]);
    }
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    goNext();
  });
  form.addEventListener("keydown", event => {
    if (event.key === "Enter" && event.target.id === "question-input" && event.target.tagName === "INPUT") {
      event.preventDefault();
      goNext();
    }
  });
  nextButton.addEventListener("click", goNext);
  backButton.addEventListener("click", goBack);
  document.getElementById("restart").addEventListener("click", () => {
    resetDialog.returnValue = "";
    resetDialog.showModal();
  });
  resetDialog.addEventListener("close", () => {
    if (resetDialog.returnValue === "reset") {
      if (downloadUrl) URL.revokeObjectURL(downloadUrl);
      downloadUrl = "";
      state = blankState();
      editSnapshot = null;
      status.textContent = "È iniziata una nuova richiesta.";
      render();
    }
  });
  window.addEventListener("pagehide", () => {
    if (downloadUrl) URL.revokeObjectURL(downloadUrl);
    downloadUrl = "";
  });
  document.getElementById("year").textContent = new Date().getFullYear();
  render(false);
  document.getElementById("quote-workspace").hidden = false;
  document.querySelector(".quote-steps").hidden = false;
  document.getElementById("load-error").hidden = true;
})();
