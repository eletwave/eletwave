(function () {
  const stage = document.querySelector("#quiz-stage");
  const progress = document.querySelector("#quote-progress");
  const stepLabel = document.querySelector("#quote-step-label");
  const stepCount = document.querySelector("#quote-step-count");
  const prevButton = document.querySelector("#prev-step");
  const nextButton = document.querySelector("#next-step");
  const summaryList = document.querySelector("#summary-list");
  const whatsappLink = document.querySelector("#send-whatsapp");
  const emailLink = document.querySelector("#send-email");

  if (!stage) {
    return;
  }

  const q = (key, title, options, body = "") => ({
    key,
    title,
    body,
    type: "options",
    options,
  });

  const m = (key, title, options, body = "") => ({
    key,
    title,
    body,
    type: "multi",
    options,
  });

  const t = (key, title, placeholder = "", body = "") => ({
    key,
    title,
    body,
    type: "text",
    placeholder,
  });

  const a = (key, title, placeholder = "", body = "") => ({
    key,
    title,
    body,
    type: "textarea",
    placeholder,
  });

  const uploads = () => ({
    ...q("Upload disponibili", "Hai foto o documenti utili?", ["Si", "No"], "Se hai foto, planimetrie o documenti, potrai allegarli dopo in chat WhatsApp o email."),
    optional: true,
  });

  const commonWhere = q("Luogo intervento", "Dove va fatto l'intervento?", [
    "Casa o appartamento",
    "Villa o casa indipendente",
    "B&B",
    "Negozio",
    "Ufficio",
    "Garage/cantina",
    "Esterno",
    "Altro",
  ]);

  const commonUrgency = q("Urgenza", "Quanto e urgente?", [
    "Emergenza",
    "Entro 24 ore",
    "Entro pochi giorni",
    "Entro 1 mese",
    "Solo valutazione",
    "Non so",
  ]);

  const propertyType = q("Tipo immobile", "Che tipo di immobile e?", [
    "Appartamento",
    "Casa indipendente",
    "Villa",
    "Garage/cantina",
    "B&B",
    "Negozio",
    "Ufficio",
    "Capannone",
    "Altro",
  ]);

  const areaSize = q("Superficie", "Superficie indicativa", [
    "Meno di 50 mq",
    "50-80 mq",
    "80-120 mq",
    "120-180 mq",
    "180-400 mq",
    "Oltre 400 mq",
    "Non so",
  ]);

  const powerSupply = q("Fornitura", "Che fornitura elettrica hai o prevedi?", [
    "3 kW",
    "4,5 kW",
    "6 kW",
    "Trifase",
    "Generatore",
    "Non so",
  ]);

  const documents = q("Documentazione", "Che documentazione ti serve?", [
    "DICO",
    "Schema impianto",
    "Relazione materiali",
    "Report fotografico",
    "Solo preventivo",
    "Non so",
  ]);

  const branches = {
    nuova_installazione: {
      label: "Nuova installazione",
      body: "Impianto o sistema nuovo da progettare e realizzare.",
      subcategories: {
        elettrico_casa: {
          label: "Impianto elettrico casa/appartamento",
          outcome: "Sopralluogo consigliato",
          questions: [
            propertyType,
            areaSize,
            q("Numero piani", "Numero piani", ["1", "2", "3", "Oltre 3"]),
            q("Stato immobile", "Stato dell'immobile", [
              "Nuova costruzione",
              "Ristrutturazione",
              "Casa abitata",
              "Casa vuota",
              "Impianto vecchio da rifare",
              "Sto solo valutando",
            ]),
            m("Ambienti", "Quali ambienti sono presenti?", [
              "Cucina",
              "Soggiorno",
              "Camere",
              "Bagni",
              "Corridoi",
              "Garage",
              "Cantina",
              "Esterno/giardino",
              "Locale tecnico",
              "Terrazzo/balcone",
            ]),
            m("Predisposizioni", "Predisposizioni future", [
              "Fotovoltaico",
              "Wallbox",
              "Domotica",
              "Allarme",
              "Videosorveglianza",
              "Wi-Fi/rete dati",
              "Climatizzazione",
              "Cancello",
              "Piscina/giardino",
            ]),
            powerSupply,
            documents,
            uploads("Planimetria, foto quadro, contatore, locali o lavori in corso."),
          ],
        },
        attivita: {
          label: "Impianto per B&B, negozio o ufficio",
          outcome: "Sopralluogo consigliato",
          questions: [
            q("Tipo attivita", "Tipo attivita", [
              "B&B",
              "Negozio",
              "Ufficio",
              "Studio professionale",
              "Bar/ristorazione",
              "Magazzino",
              "Laboratorio",
              "Altro",
            ]),
            q("Superficie", "Superficie indicativa", [
              "Meno di 50 mq",
              "50-100 mq",
              "100-200 mq",
              "Oltre 200 mq",
            ]),
            t("Numero locali", "Numero locali o stanze", "Es. 4 stanze + reception"),
            m("Servizi richiesti", "Cosa ti serve?", [
              "Impianto elettrico",
              "Prese/postazioni",
              "Quadro",
              "Illuminazione",
              "Luci emergenza",
              "Wi-Fi ospiti",
              "Rete dati",
              "Videosorveglianza",
              "Controllo consumi",
              "Smart home",
              "Manutenzione",
              "DICO/documenti",
            ]),
            q("Documenti disponibili", "Documenti impianto", [
              "Ho DICO",
              "Non ho DICO",
              "Non so",
              "Devo aprire attivita",
              "Devo affittare",
              "Devo regolarizzare",
            ]),
            uploads("Foto quadro, contatore, planimetria, locali o documenti impianto."),
          ],
        },
        quadro_nuovo: {
          label: "Quadro elettrico nuovo",
          outcome: "Sopralluogo consigliato",
          questions: [
            q("Tipo quadro", "Che tipo di quadro serve?", [
              "Appartamento",
              "Generale casa",
              "Garage/cantina",
              "Esterno",
              "Negozio/ufficio",
              "Trifase",
              "Piscina/giardino",
              "Evento/cantiere",
              "Non so",
            ]),
            powerSupply,
            m("Linee da proteggere", "Linee da separare o proteggere", [
              "Luci",
              "Prese",
              "Cucina",
              "Forno",
              "Piano induzione",
              "Lavatrice",
              "Asciugatrice",
              "Climatizzatori",
              "Garage",
              "Esterno",
              "Pompa",
              "Fotovoltaico",
              "Wallbox",
              "Allarme",
              "Rete/server",
              "Piscina",
            ]),
            m("Predisposizioni future", "Predisposizioni future", [
              "Fotovoltaico",
              "Wallbox",
              "Domotica",
              "Piscina",
              "Giardino",
              "Rete dati",
              "Nessuna",
              "Non so",
            ]),
            documents,
            uploads("Foto contatore, zona installazione, quadro esistente e percorso cavi."),
          ],
        },
        smart_home: {
          label: "Smart home/domotica",
          outcome: "Consulenza smart home",
          questions: [
            m("Cosa automatizzare", "Cosa vuoi automatizzare?", [
              "Luci",
              "Tapparelle",
              "Prese",
              "Riscaldamento",
              "Climatizzazione",
              "Consumi",
              "Sensori allagamento",
              "Sensori movimento",
              "Porte/finestre",
              "Cancello",
              "Irrigazione",
              "Videocitofono",
              "Tutta la casa",
            ]),
            q("Sistema desiderato", "Sistema desiderato", [
              "Home Assistant",
              "Shelly",
              "Zigbee",
              "Wi-Fi",
              "BTicino/Legrand",
              "KNX",
              "Non so",
            ]),
            t("Quantita dispositivi", "Quanti dispositivi o stanze?", "Es. 7 tapparelle, 12 luci, 4 stanze"),
            q("Stato impianto", "Stato impianto", [
              "Casa abitata",
              "Ristrutturazione",
              "Impianto nuovo",
              "Impianto vecchio",
              "Gia smart in parte",
            ]),
            q("Neutro scatole", "Neutro nelle scatole comandi", ["Si", "No", "Non so"]),
            m("Servizio richiesto", "Servizio richiesto", [
              "Consulenza",
              "Progetto",
              "Fornitura dispositivi",
              "Installazione",
              "Configurazione app",
              "Home Assistant",
              "Assistenza remota",
              "Tutto completo",
            ]),
            uploads("Foto quadro, interruttori, scatole comandi, dispositivi, planimetria."),
          ],
        },
        rete_wifi: {
          label: "Wi-Fi/rete dati",
          outcome: "Progetto rete",
          questions: [
            propertyType,
            areaSize,
            q("Piani", "Numero piani", ["1", "2", "3", "Oltre 3"]),
            m("Obiettivo problema", "Obiettivo o problema", [
              "Nuova rete",
              "Wi-Fi debole",
              "Zone senza segnale",
              "Connessione instabile",
              "Troppi dispositivi",
              "Rete ospiti",
              "Rete B&B",
              "Rete telecamere",
              "Rete smart home",
              "Rete cablata",
            ]),
            q("Dispositivi collegati", "Dispositivi collegati", [
              "1-10",
              "10-30",
              "30-60",
              "Oltre 60",
            ]),
            q("Punti rete", "Punti rete cablati", [
              "Nessuno",
              "1-3",
              "4-6",
              "7-12",
              "Oltre 12",
            ]),
            m("Ostacoli", "Muri o ostacoli", [
              "Normali",
              "Cemento armato",
              "Pietra",
              "Muri spessi",
              "Piu piani",
              "Giardino/esterno",
              "Non so",
            ]),
            m("Apparecchi esistenti", "Apparecchi esistenti", [
              "Modem operatore",
              "Router",
              "Mesh",
              "Access point",
              "Rack",
              "Nessuno",
              "Non so",
            ]),
            uploads("Planimetria, posizione modem, foto locali, rack o prese dati."),
          ],
        },
        videosorveglianza: {
          label: "Videosorveglianza",
          outcome: "Preventivo kit + installazione",
          questions: [
            commonWhere,
            q("Numero telecamere", "Numero telecamere", ["1-2", "3-4", "5-8", "Oltre 8"]),
            m("Zone da coprire", "Zone da coprire", [
              "Ingresso",
              "Cancello",
              "Giardino",
              "Garage",
              "Parcheggio",
              "Interno",
              "Magazzino",
              "Cassa/bancone",
              "Corridoi",
              "Altro",
            ]),
            q("Tecnologia", "Tecnologia preferita", ["Wi-Fi", "Cablate", "PoE", "Non so"]),
            q("Predisposizioni", "Ci sono predisposizioni?", ["Si", "No", "In parte", "Non so"]),
            q("Registrazione", "Tipo registrazione", [
              "Solo live",
              "Continua",
              "Movimento",
              "Cloud",
              "NVR locale",
              "Non so",
            ]),
            q("App telefono", "Vuoi controllo da app?", [
              "Si",
              "No",
              "Si con notifiche",
              "Si con piu utenti",
              "Non so",
            ]),
            uploads("Foto zone da coprire, modem/router, quadro, planimetria."),
          ],
        },
        videocitofono: {
          label: "Videocitofono/controllo accessi",
          outcome: "Verifica predisposizione",
          questions: [
            m("Cosa serve", "Cosa serve?", [
              "Videocitofono nuovo",
              "Sostituzione citofono",
              "Apertura cancello",
              "Apertura porta",
              "Tastierino/codici",
              "Lettore badge",
              "App smartphone",
            ]),
            commonWhere,
            q("Impianto esistente", "Impianto esistente", ["Citofono", "Videocitofono", "No", "Non so"]),
            q("Distanza", "Distanza posto esterno/interno", [
              "Meno di 10 m",
              "10-30 m",
              "Oltre 30 m",
              "Non so",
            ]),
            q("Smartphone", "Apertura da smartphone", ["Si", "No", "Non so"]),
            uploads("Vecchio citofono, cancello/porta, quadro, percorso cavi."),
          ],
        },
        fotovoltaico: {
          label: "Fotovoltaico/monitoraggio consumi",
          outcome: "Analisi tecnica",
          questions: [
            q("Cosa fare", "Cosa vuoi fare?", [
              "Nuovo fotovoltaico",
              "Batteria accumulo",
              "Monitoraggio consumi",
              "Predisposizione futura",
              "Non so",
            ]),
            commonWhere,
            q("Consumo annuo", "Consumo annuo indicativo", [
              "Meno di 2.000 kWh",
              "2.000-4.000 kWh",
              "4.000-6.000 kWh",
              "Oltre 6.000 kWh",
              "Non so",
            ]),
            q("Potenza desiderata", "Potenza desiderata", [
              "3 kW",
              "4,5 kW",
              "6 kW",
              "10 kW",
              "Oltre 10 kW",
              "Non so",
            ]),
            q("Tetto", "Tipo tetto o installazione", [
              "Falda coppi/tegole",
              "Piano",
              "Lamiera",
              "Guaina",
              "Cemento",
              "Pergola",
              "Terreno",
              "Non so",
            ]),
            q("Orientamento", "Orientamento", ["Sud", "Est", "Ovest", "Est/Ovest", "Nord", "Piu falde", "Non so"]),
            m("Ombre", "Ci sono ombre?", ["Nessuna", "Camino", "Alberi", "Palazzi", "Antenne", "Altre ombre", "Non so"]),
            powerSupply,
            q("Accumulo", "Accumulo", ["Si", "No", "Forse", "Predisposizione"]),
            uploads("Bolletta, foto tetto, quadro, contatore, planimetria o screenshot mappa."),
          ],
        },
        gazebo_evento: {
          label: "Gazebo/evento temporaneo",
          outcome: "Kit o verifica in loco",
          questions: [
            q("Tipo evento", "Tipo evento", [
              "Festa privata",
              "Gazebo giardino",
              "DJ/audio/luci",
              "Banco bar/frigo/spillatore",
              "Stand/mercatino",
              "Food truck/cucina",
              "Aziendale",
              "Aperto al pubblico",
            ]),
            q("Luogo", "Luogo", [
              "Interno",
              "Esterno coperto",
              "Esterno scoperto",
              "Giardino",
              "Gazebo",
              "Piazza/area pubblica",
              "Locale commerciale",
              "Non so",
            ]),
            m("Carichi", "Cosa devi alimentare?", [
              "Luci decorative",
              "Casse audio",
              "Console DJ",
              "Frigo",
              "Spillatore",
              "Macchina ghiaccio",
              "Banco bar",
              "Forno",
              "Friggitrice",
              "Piastra",
              "Pompa",
              "Stand",
              "Caricabatterie",
              "Altro",
            ]),
            q("Numero prese", "Numero prese", ["1-3", "4-6", "7-10", "Oltre 10"]),
            q("Zone separate", "Zone separate", ["1", "2", "3", "4 o piu"]),
            powerSupply,
            q("Distanza alimentazione", "Distanza alimentazione/zona evento", [
              "Meno di 5 m",
              "5-10 m",
              "10-20 m",
              "20-30 m",
              "Oltre 30 m",
            ]),
            q("Passaggio cavi", "Passaggio cavi", ["No", "Persone", "Auto", "Non so"]),
            m("Servizio richiesto", "Servizio richiesto", [
              "Consulenza evento",
              "Preventivo kit",
              "Check remoto",
              "Installazione Eletwave",
              "Verifica in loco con eventuale DICO",
              "Allestimento completo",
            ]),
            uploads("Area evento, gazebo, punto alimentazione, quadro, presa, attrezzature."),
          ],
        },
      },
    },
    assistenza: {
      label: "Assistenza tecnica / riparazione",
      body: "Guasto, problema o sistema esistente da sistemare.",
      subcategories: {
        impianto: {
          label: "Impianto elettrico",
          outcome: "Intervento tecnico",
          questions: [
            m("Problema", "Che problema hai?", [
              "Non arriva corrente",
              "Presa non funziona",
              "Luce non funziona",
              "Interruttore non funziona",
              "Contatore salta",
              "Odore di bruciato",
              "Scintille",
              "Rumori strani",
              "Altro",
            ]),
            q("Quando succede", "Quando succede?", [
              "Sempre",
              "Ogni tanto",
              "Quando accendo un apparecchio",
              "Quando piove",
              "Di notte",
              "Non so",
            ]),
            q("Da quanto", "Da quanto tempo?", ["Da oggi", "Pochi giorni", "Settimane", "Mesi", "Non so"]),
            commonUrgency,
            commonWhere,
            uploads("Foto quadro, video problema, apparecchio coinvolto, presa/interruttore."),
          ],
        },
        quadro_salvavita: {
          label: "Quadro/salvavita",
          outcome: "Verifica quadro",
          questions: [
            m("Problema", "Cosa succede?", [
              "Salvavita scatta",
              "Contatore salta",
              "Magnetotermico scatta",
              "Quadro caldo",
              "Odore di bruciato",
              "Scintille",
              "Quadro vecchio",
              "Non so quale interruttore scatta",
            ]),
            q("Succede accendendo qualcosa", "Succede quando accendi qualcosa?", ["Si", "No", "A volte", "Non so"]),
            q("Succede quando piove", "Succede quando piove?", ["Si", "No", "Non so"]),
            powerSupply,
            q("Tipo quadro", "Tipo quadro", ["Piccolo appartamento", "Generale casa", "Negozio/ufficio", "Trifase", "Non so"]),
            uploads("Quadro chiuso, quadro aperto se sicuro, contatore, interruttore che scatta."),
          ],
        },
        prese_luci: {
          label: "Prese o luci",
          outcome: "Intervento semplice o verifica linea",
          questions: [
            m("Problema", "Che problema hai?", [
              "Presa non funziona",
              "Luce non accende",
              "Lampada lampeggia",
              "Interruttore non funziona",
              "Presa scalda",
              "Presa bruciata",
              "Differenziale scatta usando quella presa",
              "Altro",
            ]),
            q("Punti coinvolti", "Quanti punti sono coinvolti?", ["1", "2-3", "4-6", "Oltre 6"]),
            m("Dove", "Dove si trovano?", ["Cucina", "Soggiorno", "Camera", "Bagno", "Corridoio", "Garage", "Esterno", "Negozio/ufficio", "Altro"]),
            q("Da quanto", "Da quanto tempo?", ["Oggi", "Pochi giorni", "Settimane", "Mesi"]),
            uploads("Foto presa/lampada, interruttore, quadro o video problema."),
          ],
        },
        smart_assistenza: {
          label: "Smart home/domotica",
          outcome: "Assistenza remota possibile",
          questions: [
            m("Cosa non funziona", "Cosa non funziona?", [
              "Luci smart",
              "Tapparelle smart",
              "Prese smart",
              "Sensori",
              "Home Assistant",
              "Zigbee",
              "App",
              "Automazioni",
              "Misuratore consumi",
              "Altro",
            ]),
            q("Sistema", "Sistema", ["Shelly", "Home Assistant", "Zigbee", "Wi-Fi", "BTicino/Legrand", "KNX", "Altro", "Non so"]),
            q("Tipo problema", "Tipo problema", ["Configurazione app", "Dispositivo offline", "Problema elettrico", "Automazione sbagliata", "Rete Wi-Fi", "Non so"]),
            q("Dispositivi coinvolti", "Dispositivi coinvolti", ["1", "2-5", "6-10", "Oltre 10"]),
            q("Accesso remoto", "Accesso remoto possibile?", ["Si", "No", "Non so"]),
            uploads("Screenshot app, dispositivo, quadro, scatola comando, errore Home Assistant."),
          ],
        },
        wifi_assistenza: {
          label: "Wi-Fi/rete dati",
          outcome: "Consulenza Wi-Fi",
          questions: [
            m("Problema", "Che problema hai?", ["Wi-Fi lento", "Wi-Fi assente", "Zone senza segnale", "Rete cade", "Dispositivi non si collegano", "Telecamere offline", "Smart home offline", "Rete ospiti", "Altro"]),
            propertyType,
            areaSize,
            q("Piani", "Piani", ["1", "2", "3", "Oltre 3"]),
            q("Dispositivi collegati", "Dispositivi collegati", ["1-10", "10-30", "30-60", "Oltre 60"]),
            t("Provider internet", "Provider internet", "Es. TIM, Vodafone, Iliad..."),
            m("Apparecchi", "Apparecchi presenti", ["Modem", "Router", "Mesh", "Access point", "Switch", "Rack", "Non so"]),
            uploads("Planimetria, modem/router, speed test, access point/switch, zone senza segnale."),
          ],
        },
        videosorveglianza_assistenza: {
          label: "Videosorveglianza",
          outcome: "Assistenza remota possibile",
          questions: [
            m("Problema", "Che problema hai?", ["Telecamera offline", "Non registra", "App non funziona", "Immagini disturbate", "Notifiche non arrivano", "NVR non funziona", "Telecamera non alimentata", "Altro"]),
            q("Dispositivi coinvolti", "Dispositivi coinvolti", ["1", "2-3", "4-8", "Oltre 8"]),
            q("Tecnologia", "Tecnologia", ["Wi-Fi", "Cablate", "PoE", "Non so"]),
            t("Marca modello", "Marca/modello se lo conosci", "Es. Hikvision, Dahua, Reolink..."),
            q("Da quando", "Da quando succede?", ["Oggi", "Pochi giorni", "Dopo cambio modem", "Dopo blackout", "Da sempre", "Non so"]),
            uploads("Screenshot app, telecamera, NVR, modem/router, alimentatore/switch PoE."),
          ],
        },
        videocitofono_assistenza: {
          label: "Videocitofono",
          outcome: "Assistenza videocitofono",
          questions: [
            m("Problema", "Che problema hai?", ["Non suona", "Non si vede video", "Non apre cancello/porta", "Audio non funziona", "App non funziona", "Pulsante non funziona", "Altro"]),
            q("Tipo impianto", "Tipo impianto", ["Citofono", "Videocitofono", "Smart/app", "Non so"]),
            commonWhere,
            uploads("Posto interno, posto esterno, screenshot app, alimentatore/quadro."),
          ],
        },
        fv_assistenza: {
          label: "Fotovoltaico/monitoraggio",
          outcome: "Assistenza monitoraggio",
          questions: [
            m("Problema", "Che problema hai?", ["App non funziona", "Monitoraggio offline", "Produzione bassa", "Inverter in errore", "Batteria non carica", "Consumi non corretti", "Altro"]),
            t("Marca inverter", "Marca inverter", "Es. Huawei, Fronius, SMA..."),
            q("Potenza impianto", "Potenza impianto", ["3 kW", "4,5 kW", "6 kW", "Oltre 6 kW", "Non so"]),
            q("Batteria", "Hai batteria?", ["Si", "No", "Non so"]),
            t("Codice errore", "Codice errore se presente", "Es. codice visto su inverter o app"),
            uploads("Screenshot app, inverter, batteria, quadro, contatore."),
          ],
        },
      },
    },
    modifica: {
      label: "Modifica o ampliamento impianto",
      body: "Aggiunta di punti, linee, quadro, smart home o rete dati.",
      subcategories: {
        prese: {
          label: "Prese",
          outcome: "Preventivo indicativo online",
          questions: [
            q("Quante prese", "Quante prese?", ["1", "2-3", "4-6", "7-10", "Oltre 10"]),
            m("Dove", "Dove servono?", ["Cucina", "Soggiorno", "Camera", "Bagno", "Garage", "Esterno", "Negozio/ufficio", "Altro"]),
            q("Tipo posa", "Tipo posa", ["Incasso", "Canalina", "Cartongesso", "Tubazione esistente", "Non so"]),
            q("Stato ambiente", "Stato ambiente", ["Casa abitata", "Muri finiti", "Lavori in corso", "Tracce gia fatte", "Non so"]),
            q("Serie civile", "Serie civile", ["Uguale all'esistente", "Base", "Standard", "Premium", "Smart", "Non so"]),
            uploads("Punto intervento, presa esistente, quadro, planimetria semplice."),
          ],
        },
        punti_luce: {
          label: "Punti luce",
          outcome: "Preventivo indicativo online",
          questions: [
            q("Quanti punti luce", "Quanti punti luce?", ["1", "2-3", "4-6", "7-10", "Oltre 10"]),
            m("Tipo luce", "Tipo luce", ["Lampadario", "Plafoniera", "Faretti", "LED strip", "Applique", "Esterno", "Altro"]),
            q("Alimentazione esistente", "Alimentazione esistente?", ["Si", "No", "Non so"]),
            q("Comando", "Tipo comando", ["Interruttore", "Deviatore", "Dimmer", "Sensore movimento", "Crepuscolare", "Smart/app", "Non so"]),
            uploads("Punto luce, soffitto/parete, interruttore, quadro."),
          ],
        },
        linea_dedicata: {
          label: "Linea dedicata",
          outcome: "Verifica quadro necessaria",
          questions: [
            q("Apparecchio", "Per quale apparecchio?", ["Forno", "Piano induzione", "Lavatrice", "Asciugatrice", "Climatizzatore", "Pompa", "Garage", "Cancello", "Wallbox", "Fotovoltaico", "Server/rete", "Piscina", "Gazebo/esterno", "Altro"]),
            q("Potenza apparecchio", "Potenza apparecchio", ["Meno di 1 kW", "1-2 kW", "2-3 kW", "Oltre 3 kW", "Non so"]),
            q("Distanza quadro", "Distanza dal quadro", ["Meno di 5 m", "5-10 m", "10-20 m", "Oltre 20 m", "Non so"]),
            q("Tipo posa", "Tipo posa", ["Incasso", "Canalina", "Tubazione esistente", "Esterno", "Interrato", "Non so"]),
            uploads("Quadro, percorso, apparecchio, punto arrivo."),
          ],
        },
        quadro_modifica: {
          label: "Quadro elettrico",
          outcome: "Sopralluogo tecnico",
          questions: [
            m("Cosa fare", "Cosa bisogna fare?", ["Aggiungere spazio", "Separare linee", "Aggiungere differenziale", "Aggiungere protezioni", "Predisporre FV", "Predisporre wallbox", "Predisporre domotica", "Sistemare quadro"]),
            uploads("Foto quadro e contatore."),
          ],
        },
        smart_modifica: {
          label: "Smart home",
          outcome: "Consulenza smart",
          questions: [
            m("Cosa aggiungere", "Cosa vuoi aggiungere?", ["Luci smart", "Tapparelle smart", "Prese smart", "Sensori", "Controllo consumi", "Home Assistant", "Altro"]),
            t("Quantita", "Quantita dispositivi", "Es. 4 tapparelle, 6 luci"),
            t("Sistema esistente", "Sistema esistente", "Es. Shelly, Home Assistant, BTicino..."),
            uploads("Foto e screenshot utili."),
          ],
        },
        rete_modifica: {
          label: "Rete dati/Wi-Fi",
          outcome: "Progetto Wi-Fi",
          questions: [
            m("Cosa aggiungere", "Cosa vuoi aggiungere?", ["Punto rete", "Access point", "Rack", "Switch", "Rete ospiti", "Copertura esterna"]),
            t("Quantita", "Quantita", "Es. 3 punti rete, 2 access point"),
            uploads("Planimetria, modem/router, locali, rack, prese dati."),
          ],
        },
      },
    },
    verifica: {
      label: "Verifica, manutenzione o DICO",
      body: "Controlli, documenti, report tecnico e manutenzioni.",
      subcategories: {
        controllo_sicurezza: {
          label: "Controllo sicurezza impianto",
          outcome: "Check sicurezza",
          questions: [
            propertyType,
            q("Eta impianto", "Eta impianto", ["Meno di 5 anni", "5-10 anni", "10-20 anni", "Oltre 20 anni", "Non so"]),
            q("DICO presente", "DICO presente?", ["Si", "No", "Non so"]),
            m("Problemi", "Problemi presenti", ["Salvavita scatta", "Contatore salta", "Prese vecchie", "Quadro vecchio", "Nessun problema", "Altro"]),
            q("Report scritto", "Vuoi report scritto?", ["Si", "No", "Non so"]),
            uploads("Quadro, contatore, prese, documenti impianto."),
          ],
        },
        manutenzione: {
          label: "Manutenzione periodica",
          outcome: "Piano manutenzione",
          questions: [
            q("Tipo cliente", "Tipo cliente", ["Privato", "B&B", "Negozio", "Ufficio", "Condominio", "Altro"]),
            m("Cosa controllare", "Cosa controllare?", ["Quadro", "Differenziali", "Luci emergenza", "Prese", "Wi-Fi", "Videosorveglianza", "Fotovoltaico", "Smart home", "Tutto"]),
            q("Frequenza", "Frequenza", ["Una volta", "Annuale", "Semestrale", "Trimestrale", "Non so"]),
          ],
        },
        dico: {
          label: "DICO/documenti impianto",
          outcome: "Check documenti DICO",
          questions: [
            q("Cosa serve", "Cosa serve?", ["Mi serve DICO", "Controllo DICO ricevuta", "Mancano allegati", "Impianto senza documenti", "Lavori con altra impresa", "Lavori fai da te", "Non so"]),
            q("Chi ha fatto lavori", "Chi ha fatto i lavori?", ["Eletwave", "Altra impresa", "Fai da te", "Vecchio proprietario", "Non so"]),
            m("Documenti disponibili", "Documenti disponibili", ["DICO", "Schema", "Relazione materiali", "Fatture", "Foto lavori", "Certificati componenti", "Nessuno"]),
            m("Servizio", "Servizio richiesto", ["Check documenti online", "Elenco mancanti", "Consulenza documentale", "Sopralluogo", "Adeguamento impianto", "DICO per lavori Eletwave"]),
            uploads("DICO, allegati, quadro, impianto, preventivi/fatture, comunicazioni."),
          ],
        },
        vendita_affitto: {
          label: "Verifica per vendita/affitto/apertura attivita",
          outcome: "Check documentale",
          questions: [
            q("Finalita", "Finalita", ["Vendere casa", "Affittare casa", "Aprire B&B", "Aprire negozio", "Aprire ufficio", "Regolarizzare impianto"]),
            q("Chi richiede documenti", "Chi richiede i documenti?", ["Agenzia immobiliare", "Comune", "Tecnico/geometra", "Proprietario", "Non so"]),
            m("Documenti disponibili", "Documenti disponibili", ["DICO", "Planimetria", "Visura/catasto", "Nessun documento", "Non so"]),
          ],
        },
        report: {
          label: "Report tecnico",
          outcome: "Report tecnico",
          questions: [
            q("Tipo report", "Tipo report", ["Stato impianto", "Criticita", "Documenti mancanti", "Preventivo adeguamento", "Altro"]),
            uploads("Foto, documenti, preventivi, planimetria."),
          ],
        },
      },
    },
    consulenza: {
      label: "Consulenza online / preventivo",
      body: "Secondo parere, analisi preventivi, documenti o progetto preliminare.",
      subcategories: {
        secondo_parere: {
          label: "Secondo parere tecnico",
          outcome: "Consulenza online",
          questions: [a("Descrizione problema", "Descrivi il problema"), a("Soluzione proposta", "Che soluzione ti hanno proposto?"), q("Preventivo Eletwave", "Vuoi anche un preventivo Eletwave?", ["Si", "No", "Non so"]), uploads("Foto, video o documenti.")],
        },
        analisi_preventivo: {
          label: "Analisi preventivo ricevuto",
          outcome: "Analisi preventivo online",
          questions: [
            q("Tipo preventivo", "Tipo preventivo", ["Impianto elettrico", "Smart home", "Fotovoltaico", "Wi-Fi/rete", "Videosorveglianza", "Gazebo/evento", "Altro"]),
            m("Cosa capire", "Cosa vuoi capire?", ["Prezzo", "Materiali", "Mancanze", "Sicurezza", "Alternative", "Convenienza"]),
            uploads("Preventivo, schede tecniche, foto impianto, note cliente."),
          ],
        },
        check_dico: {
          label: "Check documenti DICO",
          outcome: "Consulenza documentale",
          questions: [
            m("Documenti caricati", "Documenti che puoi inviare", ["DICO", "Allegati obbligatori", "Schema", "Relazione materiali", "Fattura", "Altro"]),
            q("Motivo controllo", "Motivo controllo", ["Vendita", "Affitto", "Lavori appena fatti", "Dubbi su impresa", "Apertura attivita", "Altro"]),
            uploads("Documenti e allegati."),
          ],
        },
        smart_consulenza: {
          label: "Consulenza smart home",
          outcome: "Progetto smart home",
          questions: [m("Cosa fare", "Cosa vuoi fare?", ["Luci", "Tapparelle", "Home Assistant", "Sensori", "Consumi", "Automazioni"]), t("Quantita e sistema", "Quantita dispositivi e sistema attuale", "Es. 8 luci, Shelly, app..."), uploads("Foto o screenshot.")],
        },
        wifi_consulenza: {
          label: "Consulenza Wi-Fi",
          outcome: "Progetto Wi-Fi",
          questions: [areaSize, q("Piani", "Piani", ["1", "2", "3", "Oltre 3"]), m("Problema", "Problema", ["Wi-Fi debole", "Zone senza segnale", "Troppi dispositivi", "Rete ospiti", "Rete telecamere"]), q("Dispositivi", "Dispositivi", ["1-10", "10-30", "30-60", "Oltre 60"]), uploads("Planimetria e foto modem/router.")],
        },
        fv_consulenza: {
          label: "Consulenza fotovoltaico",
          outcome: "Analisi FV",
          questions: [q("Materiale disponibile", "Cosa puoi inviare?", ["Bolletta", "Preventivo ricevuto", "Foto tetto", "kW proposti", "Tutto", "Non so"]), t("kW proposti", "kW proposti o desiderati", "Es. 6 kW + batteria"), uploads("Bolletta, preventivo, foto tetto.")],
        },
        evento_consulenza: {
          label: "Consulenza gazebo/eventi",
          outcome: "Consulenza evento",
          questions: [q("Tipo evento", "Tipo evento", ["Privato", "Aziendale", "Pubblico", "Food/bar", "DJ/audio/luci"]), m("Carichi", "Carichi", ["Luci", "Audio", "Frigo", "Spillatore", "Forno", "Friggitrice", "Altro"]), powerSupply, uploads("Foto area e punto alimentazione.")],
        },
        ristrutturazione: {
          label: "Consulenza ristrutturazione casa",
          outcome: "Schema preliminare",
          questions: [areaSize, t("Stanze", "Stanze e ambienti", "Es. cucina, sala, 2 camere, 2 bagni"), m("Richieste", "Cosa vuoi prevedere?", ["Prese", "Luci", "Rete dati", "Domotica", "Allarme", "Videosorveglianza", "Wallbox", "Fotovoltaico"]), uploads("Planimetria o foto.")],
        },
      },
    },
    kit: {
      label: "Kit predisposti / soluzioni pronte",
      body: "Soluzioni pronte o semi-pronte, configurate da Eletwave.",
      subcategories: {
        stand: {
          label: "Kit fiere/stand/mercatini",
          outcome: "Kit predisposto consigliato",
          questions: [
            q("Tipo utilizzo", "Tipo utilizzo", ["Stand espositivo", "Mercatino", "Fiera", "Banco vendita", "Informativo", "Artigianato", "Food leggero"]),
            q("Luogo", "Luogo", ["Interno", "Esterno coperto", "Esterno scoperto", "Area pubblica", "Padiglione fiera"]),
            m("Cosa alimentare", "Cosa alimentare?", ["Luci stand", "POS", "Tablet/PC", "Piccoli apparecchi", "Frigo", "Insegna", "Caricabatterie", "Altro"]),
            q("Numero prese", "Numero prese", ["1-3", "4-6", "7-10", "Oltre 10"]),
            powerSupply,
            q("Passaggi cavi", "Passaggi cavi", ["Passaggio persone", "Passaggio auto", "Nessun passaggio", "Non so"]),
            q("Servizio", "Servizio", ["Kit pronto", "Kit + check remoto", "Kit + installazione", "Verifica in loco/DICO se applicabile"]),
            uploads("Area stand, presa/quadro disponibile, lista attrezzature, planimetria."),
          ],
        },
        gazebo_kit: {
          label: "Kit gazebo/feste/eventi",
          outcome: "Kit predisposto consigliato",
          questions: [
            q("Tipo evento", "Tipo evento", ["Festa privata", "Gazebo", "Giardino", "Evento aziendale", "Evento pubblico"]),
            m("Carichi", "Carichi", ["Luci", "Audio", "Frigo", "Spillatore", "Macchina ghiaccio", "Banco bar", "Piccoli elettrodomestici"]),
            q("Numero prese", "Numero prese", ["1-3", "4-6", "7-10", "Oltre 10"]),
            powerSupply,
            q("Passaggi", "Ci sono passaggi cavi critici?", ["No", "Persone", "Auto", "Non so"]),
            q("Servizio", "Servizio", ["Preventivo kit", "Check remoto", "Installazione", "Verifica in loco/DICO"]),
          ],
        },
        dj: {
          label: "Kit DJ/audio/luci",
          outcome: "Kit audio/luci",
          questions: [m("Carichi", "Carichi", ["Console DJ", "Mixer", "Casse", "Subwoofer", "Luci palco", "Macchina fumo", "Schermi/video"]), q("Linee separate", "Linee separate audio/luci?", ["Si", "No", "Non so"]), powerSupply, uploads("Lista apparecchi, foto area, presa/quadro.")],
        },
        banco_bar: {
          label: "Kit banco bar/frigo/spillatore",
          outcome: "Kit banco bar",
          questions: [m("Carichi", "Carichi", ["Frigo", "Congelatore", "Spillatore", "Macchina ghiaccio", "Banco bar", "Macchina caffe", "Luci banco"]), q("Uso", "Uso privato o pubblico?", ["Privato", "Pubblico", "Non so"]), q("Continuita frigo", "Serve continuita frigo?", ["Si", "No", "Non so"])],
        },
        wifi_kit: {
          label: "Kit Wi-Fi/rete dati",
          outcome: "Kit Wi-Fi",
          questions: [q("Tipo kit", "Tipo kit", ["Wi-Fi casa", "Wi-Fi B&B", "Wi-Fi negozio", "Access point esterno", "Rete ospiti", "Telecamere + rete"]), areaSize, q("Piani", "Piani", ["1", "2", "3", "Oltre 3"]), q("Dispositivi", "Dispositivi", ["1-10", "10-30", "30-60", "Oltre 60"]), uploads("Planimetria, modem/router, zone senza segnale.")],
        },
        smart_kit: {
          label: "Kit smart home/domotica",
          outcome: "Kit smart home",
          questions: [q("Tipo kit", "Tipo kit", ["Luci smart", "Tapparelle smart", "Sensori", "Controllo consumi", "Home Assistant base", "B&B smart"]), t("Numero dispositivi", "Numero dispositivi", "Es. 6 luci, 4 tapparelle"), q("Neutro scatole", "Neutro nelle scatole?", ["Si", "No", "Non so"]), q("Servizio", "Servizio", ["Kit preconfigurato", "Assistenza remota", "Installazione", "Progetto smart home"])],
        },
        video_kit: {
          label: "Kit videosorveglianza/videocitofono",
          outcome: "Kit video",
          questions: [q("Tipo kit", "Tipo kit", ["Telecamere Wi-Fi", "PoE", "Videocitofono smart", "Controllo accessi base"]), q("Numero telecamere", "Numero telecamere", ["1-2", "3-4", "5-8", "Oltre 8"]), m("Zone", "Zone", ["Interno", "Esterno", "Ingresso", "Cancello", "Parcheggio", "Altro"]), q("Registrazione", "Registrazione", ["Cloud", "NVR locale", "Solo live", "Non so"]), uploads("Zone, modem/router, quadro, posto esterno/interno.")],
        },
        consumi_kit: {
          label: "Kit controllo consumi",
          outcome: "Kit monitoraggio",
          questions: [q("Tipo kit", "Tipo kit", ["Misuratore energia generale", "Monitoraggio singole linee", "FV + consumi", "Home Assistant energia"]), powerSupply, m("Linee da monitorare", "Linee da monitorare", ["Generale", "Cucina", "Clima", "Wallbox", "Fotovoltaico", "Pompa", "Altro"]), q("Report consumi", "Vuoi report consumi?", ["Si", "No", "Non so"])],
        },
        emergenza_kit: {
          label: "Kit emergenza/manutenzione",
          outcome: "Kit emergenza",
          questions: [q("Tipo kit", "Tipo kit", ["Emergenza casa", "Pompa/allagamento", "Luci emergenza", "UPS piccolo ufficio", "Etichette/checklist quadro"]), t("Cosa proteggere", "Cosa vuoi proteggere?", "Es. frigo, router, pompa..."), q("Ambiente", "Ambiente", ["Casa", "Ufficio", "Garage", "Cantina", "Esterno"])],
        },
        personalizzato_kit: {
          label: "Kit personalizzato su richiesta",
          outcome: "Kit personalizzato",
          questions: [a("Esigenza", "Descrivi l'esigenza"), q("Categoria uso", "Categoria uso", ["Evento", "Casa", "B&B", "Negozio", "Ufficio", "Cantiere", "Esterno", "Altro"]), a("Carichi dispositivi", "Carichi o dispositivi da alimentare/configurare"), m("Vincoli", "Vincoli", ["Spedizione", "Ritiro", "Check remoto", "Installazione", "Documentazione", "DICO"]), uploads("Foto, planimetria, lista materiali, dati tecnici.")],
        },
      },
    },
    consiglio: {
      label: "Non so / voglio un consiglio",
      body: "Non sai da dove partire: raccogliamo pochi dati e ti richiamiamo.",
      subcategories: {
        consiglio: {
          label: "Voglio essere consigliato",
          outcome: "Richiamata e smistamento interno",
          questions: [
            a("Descrizione", "Descrivi problema o obiettivo", "Scrivi liberamente cosa vorresti fare o capire..."),
            commonWhere,
            q("Urgenza", "E urgente?", ["Si", "No", "Non so"]),
            q("Preferenza", "Come preferisci procedere?", ["Richiamata", "Consulenza online", "Preventivo", "Sopralluogo", "Non so"]),
            uploads("Foto quadro, problema, locale, documento/preventivo o altro."),
          ],
        },
      },
    },
  };

  const categoryOrder = [
    "nuova_installazione",
    "assistenza",
    "modifica",
    "verifica",
    "consulenza",
    "kit",
    "consiglio",
  ];

  const answers = {};
  let current = "category";
  let selectedCategory = "";
  let selectedSubcategory = "";
  let questionIndex = 0;
  const history = [];

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
    "Modifica o ampliamento impianto": "Per aggiungere punti, linee, prese, luci, apparecchi o funzioni a un impianto gia presente.",
    "Verifica, manutenzione o DICO": "Per controlli tecnici, manutenzioni, documentazione o verifica di conformita dell'impianto.",
    "Consulenza online / preventivo": "Per analizzare un problema, un preventivo ricevuto o capire quale soluzione conviene prima di intervenire.",
    "Kit predisposti / soluzioni pronte": "Per soluzioni gia impostate, da adattare al tuo caso con installazione o supporto Eletwave.",
    "Non so / voglio un consiglio": "Per richieste non ancora chiare: ti guidiamo noi verso il percorso piu adatto.",
    DICO: "Dichiarazione di Conformita. Eletwave puo rilasciarla solo per lavori eseguiti, installati o verificati in loco.",
    "Non so": "Scegli questa voce se non hai ancora il dato: lo chiariremo nel contatto successivo.",
    Altro: "Usa questa voce quando la tua situazione non rientra nelle opzioni disponibili.",
    Emergenza: "Situazione potenzialmente pericolosa o bloccante, da valutare con priorita alta.",
    "Entro 24 ore": "Intervento o contatto richiesto entro la giornata successiva.",
    "Solo valutazione": "Non hai urgenza: vuoi capire costi, possibilita e soluzione migliore.",
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
      return `Seleziona ${clean} per capire potenza disponibile, protezioni del quadro e compatibilita dei carichi.`;
    }

    if (/mq|superficie|oltre|meno/.test(text)) {
      return `Serve a dimensionare tempi, quantita di materiali e complessita generale dell'intervento.`;
    }

    if (/^\d|pochi|giorni|mese|ore/.test(text)) {
      return `Quantita o tempistica indicativa per "${context || clean}": aiuta a stimare durata, priorita e materiale necessario.`;
    }

    if (/fotovoltaico|accumulo|wallbox|domotica|allarme|videosorveglianza|wi-fi|rete|smart|home assistant/.test(text)) {
      return `Predisposizione o servizio ${clean.toLowerCase()}: permette di valutare collegamenti, compatibilita e possibilita future.`;
    }

    if (/luci|prese|quadro|illuminazione|punto luce|linee|cavi|presa|forno|induzione|lavatrice|asciugatrice|climatizzatori|pompa|piscina/.test(text)) {
      return `Voce tecnica ${clean.toLowerCase()}: indica quali parti dell'impianto vanno installate, modificate o controllate.`;
    }

    if (/foto|planimetria|document|schema|relazione|report|preventivo|bolletta/.test(text)) {
      return `Materiale utile per valutare meglio la richiesta prima del contatto: se non puoi allegarlo ora, invialo dopo in chat.`;
    }

    if (/bruciato|scintille|caldo|salta|corrente|guasto|non funziona|problema/.test(text)) {
      return `Descrive il sintomo principale: serve a capire priorita, rischio e tipo di controllo necessario.`;
    }

    if (/nuova|ristrutturazione|abitata|vuota|vecchio|valutando/.test(text)) {
      return `Stato del lavoro: cambia accessibilita, tempi di posa e precisione del preventivo.`;
    }

    if (/^(si|no)$/.test(text)) {
      return `Risposta rapida per confermare o escludere questa condizione nel percorso ${where || "selezionato"}.`;
    }

    return `Seleziona questa voce se "${clean}" descrive meglio la tua richiesta. Aiuta Eletwave a preparare una risposta piu precisa.`;
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
    return value || "";
  }

  function hasAnswer(question) {
    if (!question || question.optional) {
      return true;
    }

    const value = answers[question.key];
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return Boolean(value);
  }

  function allAnswerText() {
    return Object.values(answers).map(answerText).join(" ").toLowerCase();
  }

  function detectResult() {
    const text = allAnswerText();
    const branch = getBranch();
    const category = branches[selectedCategory];

    if (/(odore di bruciato|scintille|quadro caldo|presa bruciata|presa scalda|non arriva corrente|emergenza)/.test(text)) {
      return {
        label: "Urgenza",
        action: "Chiama subito Eletwave se la situazione e pericolosa.",
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

    if (selectedCategory === "modifica" && /(1|2-3|4-6|incasso|canalina|punto luce|prese)/.test(text)) {
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
    const percent = Math.max(8, Math.min(100, (step / total) * 100));
    progress?.style.setProperty("--progress", `${percent}%`);
    if (stepLabel) {
      stepLabel.textContent = current === "contact" ? "Dati e invio" : `Step ${step}`;
    }
    if (stepCount) {
      stepCount.textContent = `${step}/${total}`;
    }
  }

  function optionMarkup(option, selected, valueOverride = "", context = "") {
    const label = Array.isArray(option) ? option[0] : option;
    const providedInfo = Array.isArray(option) ? option[1] : "";
    const info = providedInfo || optionInfo(label, context);
    const value = valueOverride || label;
    return `
      <button class="option-card ${selected ? "is-selected" : ""}" type="button" data-value="${escapeHtml(value)}">
        <span class="option-card__head">
          <strong>${escapeHtml(label)}</strong>
          <span class="option-info" role="button" tabindex="0" aria-label="Informazioni su ${escapeHtml(label)}">i</span>
        </span>
        <span class="option-card__info">${escapeHtml(info)}</span>
      </button>`;
  }

  function renderCategory() {
    return `
      <div class="quiz-step is-active">
        <p class="eyebrow">Domanda 1</p>
        <h2>Di cosa hai bisogno?</h2>
        <p>Scegli il punto di partenza: il preventivo si apre solo sulle domande utili.</p>
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
        <p>Ora scegli la sottocategoria tecnica: da qui cambiano le domande successive.</p>
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
      if (question.key === "Upload disponibili" && value === "Si") {
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
              const id = `check-${escapeHtml(question.key)}-${escapeHtml(label)}`.replace(/[^a-zA-Z0-9_-]/g, "-");
              return `
                <div class="option-card option-card--check ${selected.includes(label) ? "is-selected" : ""}">
                  <input id="${id}" type="checkbox" value="${escapeHtml(label)}" ${selected.includes(label) ? "checked" : ""} />
                  <label for="${id}">${escapeHtml(label)}</label>
                  <span class="option-info" role="button" tabindex="0" aria-label="Informazioni su ${escapeHtml(label)}">i</span>
                  <span class="option-card__info">${escapeHtml(info)}</span>
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
            <input id="question-input" value="${escapeHtml(value || "")}" placeholder="${escapeHtml(question.placeholder || "")}" />
          </div>
        </div>`;
    }

    if (question.type === "textarea") {
      body = `
        <div class="form-grid">
          <div class="field field--full">
            <label for="question-input">${escapeHtml(question.title)}</label>
            <textarea id="question-input" placeholder="${escapeHtml(question.placeholder || "")}">${escapeHtml(value || "")}</textarea>
          </div>
        </div>`;
    }

    return `
      <div class="quiz-step is-active">
        <p class="eyebrow">Domanda ${questionIndex + 3}</p>
        <h2>${escapeHtml(question.title)}</h2>
        ${question.body ? `<p>${escapeHtml(question.body)}</p>` : ""}
        ${body}
      </div>`;
  }

  function renderContact() {
    return `
      <div class="quiz-step is-active">
        <p class="eyebrow">Ultimo step</p>
        <h2>Dati per ricontattarti.</h2>
        <p>Completa i dati: Eletwave ricevera categoria, ramo tecnico, risultato automatico e tutte le risposte raccolte.</p>
        <div class="form-grid">
          <div class="field">
            <label for="name">Nome e cognome</label>
            <input id="name" autocomplete="name" value="${escapeHtml(answers.Nome || "")}" />
          </div>
          <div class="field">
            <label for="phone">Telefono</label>
            <input id="phone" autocomplete="tel" value="${escapeHtml(answers.Telefono || "")}" />
          </div>
          <div class="field">
            <label for="email">Email</label>
            <input id="email" type="email" autocomplete="email" value="${escapeHtml(answers.Email || "")}" />
          </div>
          <div class="field">
            <label for="city">Comune</label>
            <input id="city" autocomplete="address-level2" value="${escapeHtml(answers.Comune || "")}" placeholder="Es. Romans d'Isonzo" />
          </div>
          <div class="field field--full">
            <label for="address">Indirizzo intervento opzionale</label>
            <input id="address" value="${escapeHtml(answers.Indirizzo || "")}" />
          </div>
          <div class="field">
            <label for="client-type">Tipo cliente</label>
            <input id="client-type" value="${escapeHtml(answers["Tipo cliente"] || "")}" placeholder="Privato, azienda, B&B..." />
          </div>
          <div class="field">
            <label for="vat">P.IVA o codice fiscale opzionale</label>
            <input id="vat" value="${escapeHtml(answers["P.IVA/CF"] || "")}" />
          </div>
          <div class="field">
            <label for="date">Data desiderata</label>
            <input id="date" value="${escapeHtml(answers["Data desiderata"] || "")}" placeholder="Es. prossima settimana" />
          </div>
          <div class="field">
            <label for="time">Fascia oraria preferita</label>
            <input id="time" value="${escapeHtml(answers["Fascia oraria"] || "")}" placeholder="Mattina, pomeriggio..." />
          </div>
          <div class="field field--full">
            <label for="notes">Note finali</label>
            <textarea id="notes" placeholder="Aggiungi dettagli, vincoli o preferenze...">${escapeHtml(answers["Note finali"] || "")}</textarea>
          </div>
          <div class="field field--full field--attachment-note">
            <strong>Foto e documenti</strong>
            <small>Il sito non carica allegati: se hai foto, planimetrie o documenti utili, inviali dopo nella chat WhatsApp o allegali alla mail.</small>
          </div>
          <label class="field field--full field--consent">
            <input id="consent" type="checkbox" ${answers.Consenso ? "checked" : ""} />
            <span>Confermo la correttezza delle informazioni e acconsento a essere contattato da Eletwave.</span>
          </label>
          <div class="final-send-panel field--full">
            <a class="button button--primary" data-send="whatsapp" href="https://wa.me/393930036372" target="_blank" rel="noopener noreferrer">
              Invia WhatsApp
            </a>
            <a class="button button--ghost" data-send="email" href="mailto:info@eletwave.com">
              Invia email
            </a>
          </div>
        </div>
      </div>`;
  }

  function render() {
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

    prevButton.disabled = history.length === 0;
    nextButton.textContent = current === "contact" ? "Prepara invio" : "Avanti";
    updateSummary();
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
    Object.keys(answers).forEach((key) => delete answers[key]);
    Object.assign(answers, snapshot.answers);
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

    updateSummary();
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
      const fields = {
        name: "Nome",
        phone: "Telefono",
        email: "Email",
        city: "Comune",
        address: "Indirizzo",
        "client-type": "Tipo cliente",
        vat: "P.IVA/CF",
        date: "Data desiderata",
        time: "Fascia oraria",
        notes: "Note finali",
      };

      Object.entries(fields).forEach(([id, key]) => {
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

  function updateSummary() {
    saveCurrentInputs();
    const result = detectResult();
    const category = branches[selectedCategory]?.label || "Da selezionare";
    const branch = getBranch()?.label || "Da selezionare";

    const rows = [
      ["Categoria", category],
      ["Sottocategoria", branch],
      ["Risultato", result.label],
      ["Comune", answers.Comune || "Da indicare"],
      ["Cliente", answers.Nome || "Da indicare"],
      ["Telefono", answers.Telefono || "Da indicare"],
    ];

    summaryList.innerHTML = rows
      .map(([label, value]) => `<li><small>${escapeHtml(label)}</small><span>${escapeHtml(value)}</span></li>`)
      .join("");

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
      "Nota DICO: la Dichiarazione di Conformita viene rilasciata solo per lavori eseguiti, installati o verificati in loco da Eletwave, secondo normativa applicabile.",
    ];

    const message = messageLines.join("\n");
    const encodedMessage = encodeURIComponent(message);
    whatsappLink.href = `https://wa.me/393930036372?text=${encodedMessage}`;
    emailLink.href = `mailto:info@eletwave.com?subject=${encodeURIComponent("Richiesta preventivo ELETWAVE")}&body=${encodedMessage}`;
    document.querySelectorAll("[data-send='whatsapp']").forEach((link) => {
      link.href = whatsappLink.href;
    });
    document.querySelectorAll("[data-send='email']").forEach((link) => {
      link.href = emailLink.href;
    });
  }

  stage.addEventListener("click", (event) => {
    const info = event.target.closest(".option-info");
    if (info) {
      event.preventDefault();
      event.stopPropagation();
      const card = info.closest(".option-card");
      stage.querySelectorAll(".option-card.is-info-open").forEach((openCard) => {
        if (openCard !== card) {
          openCard.classList.remove("is-info-open");
        }
      });
      card?.classList.toggle("is-info-open");
      return;
    }

    const option = event.target.closest(".option-card");
    if (!option) {
      return;
    }

    if (option.classList.contains("option-card--check")) {
      event.preventDefault();
      const checkbox = option.querySelector("input[type='checkbox']");
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
        option.classList.toggle("is-selected", checkbox.checked);
        saveCurrentInputs();
        updateSummary();
      }
      return;
    }

    const value = option.dataset.value;

    if (current === "category") {
      selectedCategory = value;
      selectedSubcategory = "";
      Object.keys(answers).forEach((key) => delete answers[key]);
      answers.Categoria = branches[value].label;
      answers.CategoriaValue = value;
      updateSummary();
      window.setTimeout(goNext, 140);
      return;
    }

    if (current === "subcategory") {
      selectedSubcategory = value;
      const branch = getBranch();
      Object.keys(answers).forEach((key) => {
        if (!["Categoria", "CategoriaValue"].includes(key)) {
          delete answers[key];
        }
      });
      answers.Sottocategoria = branch.label;
      answers.SottocategoriaValue = value;
      updateSummary();
      window.setTimeout(goNext, 140);
      return;
    }

    if (current === "question") {
      const question = getQuestion();
      answers[question.key] = value;
      stage.querySelectorAll(".option-card").forEach((card) => card.classList.toggle("is-selected", card === option));
      updateSummary();
      if (question.key === "Upload disponibili") {
        render();
        return;
      }
      window.setTimeout(goNext, 140);
    }
  });

  stage.addEventListener("keydown", (event) => {
    if ((event.key === "Enter" || event.key === " ") && event.target.matches(".option-info")) {
      event.preventDefault();
      event.target.click();
    }
  });

  stage.addEventListener("change", (event) => {
    if (event.target.matches("input[type='checkbox']")) {
      const card = event.target.closest(".option-card");
      card?.classList.toggle("is-selected", event.target.checked);
      saveCurrentInputs();
      updateSummary();
      return;
    }

    updateSummary();
  });

  stage.addEventListener("input", updateSummary);

  prevButton.addEventListener("click", () => {
    const snapshot = history.pop();
    if (!snapshot) return;
    restore(snapshot);
    render();
  });

  nextButton.addEventListener("click", goNext);

  render();
})();
