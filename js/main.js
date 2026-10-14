/* ZOIA · interacciones de la landing (sin dependencias) */
(() => {
  const root = document.documentElement;
  const isAgro = root.dataset.entry === "agro";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- WhatsApp: un mensaje precargado por botón ---------- */
  const WA_NUMBER = "5492345478090";
  const WA_MESSAGES = {
    agro: "¡Hola Rosa! Vi la lona de Seguros Agrícolas y quiero cotizar mis lotes 🌱",
    rosa: "¡Hola Rosa! Quiero hacerte una consulta sobre mis seguros",
    hogar: "¡Hola! Quiero cotizar el seguro de mi casa 🏠",
    auto: "¡Hola! Quiero cotizar el seguro de mi auto o moto 🚗",
    maquinaria: "¡Hola! Quiero asegurar maquinaria agrícola o drones 🚜",
    comercio: "¡Hola! Quiero cotizar un seguro para mi comercio",
    transporte: "¡Hola! Quiero cotizar el seguro de mi camión 🚛",
    vida: "¡Hola! Quiero info sobre vida o accidentes personales",
    general: "¡Hola! Llegué desde la web de ZOIA y quiero hacer una consulta",
  };
  const waLink = (key) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGES[key] || WA_MESSAGES.general)}`;

  document.querySelectorAll("[data-wa]").forEach((el) => {
    let key = el.dataset.wa;
    // El botón flotante usa el mensaje agro cuando la visita llega desde el QR de la lona
    if (key === "float") key = isAgro ? "agro" : "general";
    el.href = waLink(key);
    el.target = "_blank";
    el.rel = "noopener";
    el.addEventListener("click", () => {
      // Evento de medición por botón (GA4 / Meta Pixel leen el dataLayer cuando se instalen)
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "whatsapp_click", wa_button: el.dataset.track || key, entry: isAgro ? "agro" : "general" });
    });
  });

  /* ---------- Titulares: separar palabras para animarlas ---------- */
  document.querySelectorAll(".split").forEach((el) => {
    let index = 0;
    const wrapWords = (node) => {
      [...node.childNodes].forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(" "); return; }
            const outer = document.createElement("span");
            outer.className = "w";
            const inner = document.createElement("span");
            inner.textContent = part;
            inner.style.setProperty("--wi", index++);
            outer.append(inner);
            frag.append(outer);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          wrapWords(child);
        }
      });
    };
    el.setAttribute("aria-label", el.textContent.trim());
    wrapWords(el);
    el.querySelectorAll(".w").forEach((w) => w.setAttribute("aria-hidden", "true"));
  });

  document.querySelectorAll("[data-hero-fade]").forEach((el, i) => el.style.setProperty("--fi", i));
  document.querySelectorAll(".hero-mosaic > *").forEach((el, i) => el.style.setProperty("--mi", i));

  /* ---------- Revelado al entrar en pantalla ---------- */
  document.querySelectorAll("[data-stagger]").forEach((group) => {
    [...group.children].forEach((child, i) => {
      child.style.setProperty("--i", i);
      if (!child.hasAttribute("data-reveal")) child.setAttribute("data-reveal", group.dataset.stagger || "");
    });
  });

  const revealTargets = document.querySelectorAll("[data-reveal], .steps, .section-head");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Barra superior y botón flotante según el hero ---------- */
  const nav = document.querySelector(".nav");
  const fab = document.querySelector(".fab");
  const hero = [...document.querySelectorAll(".hero")].find((h) => h.offsetParent !== null);
  if (hero && "IntersectionObserver" in window) {
    let pulsed = false;
    new IntersectionObserver(
      ([entry]) => {
        const past = !entry.isIntersecting;
        nav.dataset.state = past ? "solid" : "clear";
        fab.classList.toggle("is-visible", past);
        if (past && !pulsed && !reduceMotion) {
          pulsed = true;
          fab.classList.add("pulse");
        }
      },
      { rootMargin: "-80px 0px 0px 0px", threshold: 0.02 }
    ).observe(hero.querySelector(".hero__actions") || hero);
  } else if (fab) {
    fab.classList.add("is-visible");
  }

  /* ---------- Preguntas frecuentes (acordeón accesible) ---------- */
  document.querySelectorAll(".acc-item").forEach((item, i) => {
    const trigger = item.querySelector(".acc-trigger");
    const panel = item.querySelector(".acc-panel");
    const id = `faq-panel-${i}`;
    panel.id = id;
    trigger.setAttribute("aria-controls", id);
    trigger.setAttribute("aria-expanded", item.dataset.open === "true" ? "true" : "false");
    trigger.addEventListener("click", () => {
      const open = item.dataset.open !== "true";
      item.dataset.open = String(open);
      trigger.setAttribute("aria-expanded", String(open));
    });
  });

  /* ---------- Marquee: duplica la pista para un loop sin cortes ---------- */
  document.querySelectorAll(".marquee").forEach((m) => {
    const track = m.querySelector(".marquee__track");
    const clone = track.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    m.append(clone);
  });

  /* ---------- Año del pie ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
