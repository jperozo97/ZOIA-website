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
    // Los botones flotantes usan el mensaje agro cuando la visita llega desde el QR de la lona
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
            outer.setAttribute("aria-hidden", "true");
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
  });

  /* ---------- Orden de entrada del hero ---------- */
  document.querySelectorAll(".hero > .tile").forEach((el, i) => el.style.setProperty("--i", i));
  [...document.querySelectorAll(".hero [data-fade]")]
    .filter((el) => getComputedStyle(el).display !== "none")
    .forEach((el, i) => el.style.setProperty("--fi", i));

  /* ---------- Revelado al entrar en pantalla ---------- */
  document.querySelectorAll("[data-stagger]").forEach((group) => {
    [...group.children].forEach((child, i) => {
      child.style.setProperty("--i", i);
      child.setAttribute("data-reveal", "");
    });
  });

  const revealTargets = document.querySelectorAll("[data-reveal], .linea-tiempo, .ciclo, .pasos, .venn, .cierre, .rosa");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Barra superior y WhatsApp flotante según el hero ---------- */
  const nav = document.querySelector(".nav");
  const floating = document.querySelectorAll(".flotante, .barra-movil");
  const heroText = document.querySelector(".hero__ctas");
  if (heroText && "IntersectionObserver" in window) {
    let pulsed = false;
    new IntersectionObserver(
      ([entry]) => {
        const past = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        nav.dataset.scrolled = String(past);
        floating.forEach((el) => el.classList.toggle("is-visible", past));
        if (past && !pulsed && !reduceMotion) {
          pulsed = true;
          document.querySelector(".flotante").classList.add("pulso");
        }
      },
      { rootMargin: "-72px 0px 0px 0px" }
    ).observe(heroText);
  } else {
    floating.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Preguntas frecuentes (acordeón accesible) ---------- */
  document.querySelectorAll(".preg").forEach((item, i) => {
    const trigger = item.querySelector(".preg__btn");
    const panel = item.querySelector(".preg__panel");
    panel.id = `preg-${i}`;
    trigger.setAttribute("aria-controls", panel.id);
    trigger.setAttribute("aria-expanded", item.dataset.open === "true" ? "true" : "false");
    trigger.addEventListener("click", () => {
      const open = item.dataset.open !== "true";
      item.dataset.open = String(open);
      trigger.setAttribute("aria-expanded", String(open));
    });
  });
})();
