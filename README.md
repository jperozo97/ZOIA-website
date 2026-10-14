# ZOIA | Asesores de Seguros · Landing

Landing de una página para ZOIA, la productora asesora de seguros de María Rosa Zoia en Norberto de la Riestra. Objetivo único: que el visitante toque "Escribinos por WhatsApp".

Diseño: "Landing bento" del lienzo "ZOIA · Landing page" en Claude, con los tokens de "ZOIA · Sistema de diseño".

Sitio estático (HTML, CSS y JS sin dependencias ni build), publicado con GitHub Pages en https://jperozo97.github.io/ZOIA-website/.

## Estructura

| Archivo | Qué es |
|---|---|
| `index.html` | La landing bento: hero, línea de la campaña, cómo cotizar, Rosa y por qué ZOIA, coberturas, preguntas, cierre y pie |
| `agro/index.html` | Entrada del QR de la lona: redirige a `/?v=agro`, que muestra el hero agro |
| `design-system.html` | Documentación visual del design system |
| `css/tokens.css` | Tokens: colores, tipografía, espaciado, radios, sombras, movimiento, modo oscuro |
| `css/styles.css` | Componentes y animaciones |
| `js/main.js` | Links de WhatsApp, revelado al hacer scroll, acordeón, barra y botón flotante |
| `assets/` | Fotos y logos |

## Dos entradas, una página

- `/` o `/?v=general`: hero general (Instagram, Google).
- `/agro/` o `/?v=agro`: hero agro (QR de la lona "Seguros Agrícolas"). El botón flotante usa el mensaje agro.

## WhatsApp y medición

Cada botón tiene `data-wa` (clave del mensaje precargado, definido en `js/main.js`) y `data-track` (nombre del botón). Cada clic empuja un evento `whatsapp_click` al `dataLayer`, listo para GA4 o Meta Pixel.

## Ver en local

```bash
python3 -m http.server 4173
```

Abrir http://localhost:4173 (o http://localhost:4173/?v=agro).

## Pendientes antes de publicar

- [ ] **Legal:** número de matrícula SSN y leyenda obligatoria de la SSN (pie). Buscar `[pendiente]`.
- [ ] Autorización y logos en monocromo de Federación Patronal, Segurometal, San Cristóbal y Sancor (hoy van como texto).
- [ ] Confirmar "emisión en el día" para agro, descuento por contratación temprana y "cliente integral".
- [ ] Dominio (por ejemplo, zoia.com.ar) y URL del QR de la lona.
- [ ] Licencia web de la tipografía Mont (hoy se usa Montserrat).
