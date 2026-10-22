# Iglesia Maranatha — Sitio web

Sitio estático (HTML + CSS + JS) listo para publicarse gratis con **GitHub Pages**.

## Qué incluye
- **Palabra del día**: versículo, reflexión, oración y lectura bíblica que cambian solos cada día (a medianoche), con flechas para ver días anteriores/siguientes, copiar y compartir por WhatsApp.
- **Tema del día** según el día de la semana.
- **Cuenta regresiva** al próximo servicio.
- **Horarios** (resalta el servicio de hoy), **Nosotros**, **Ministerios**.
- **Eventos**: los pasados se ocultan automáticamente.
- **Peticiones de oración** (abre el correo del visitante), **Ofrendas**, **Contacto** con mapa.
- Diseño responsive (celular, tablet y PC).

## Estructura
```
index.html
css/styles.css
js/data.js   <- AQUÍ editas versículos, horarios, eventos y correo
js/main.js   <- lógica (no necesitas tocarlo)
```

## Publicar en GitHub Pages
1. Crea un repositorio nuevo en GitHub (por ejemplo `maranatha`), público.
2. Sube **todos** los archivos manteniendo las carpetas (`Add file > Upload files` y arrastra el contenido de la carpeta).
3. Ve a **Settings > Pages**.
4. En *Source* elige **Deploy from a branch**, rama **main**, carpeta **/ (root)** y guarda.
5. En 1–2 minutos tu sitio estará en `https://TU-USUARIO.github.io/maranatha/`.

## Personalizar
- **Dirección, teléfono, correo, redes, banco**: en `index.html` (busca los textos de ejemplo).
- **Mapa**: en `index.html`, cambia `q=Guatemala` por la dirección de la iglesia.
- **Versículos, oraciones, horarios y eventos**: en `js/data.js`. Puedes agregar cuantos quieras; la rotación se ajusta sola.
- **URL para compartir**: en `js/data.js`, pon tu dirección de GitHub Pages en `CONFIG.urlSitio`.
