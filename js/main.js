/* =========================================================
   LÓGICA DEL SITIO - Iglesia Maranatha
   ========================================================= */
(function () {
  'use strict';

  var DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  var MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- Utilidades ---------- */
  // Número de día absoluto (local): cambia exactamente a medianoche
  function numeroDia(fecha) {
    return Math.floor(Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()) / 86400000);
  }
  function mod(n, m) { return ((n % m) + m) % m; }
  function mcd(a, b) { return b ? mcd(b, a % b) : a; }
  function fechaLarga(fecha) {
    return fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
  function hora12(hhmm) {
    var p = hhmm.split(':'), h = parseInt(p[0], 10), m = p[1];
    var suf = h >= 12 ? 'p. m.' : 'a. m.';
    h = h % 12 || 12;
    return h + ':' + m + ' ' + suf;
  }

  var toastTimer;
  function toast(msg) {
    var t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2500);
  }

  function leerLocal(clave) {
    try { return localStorage.getItem(clave); } catch (e) { return null; }
  }
  function guardarLocal(clave, valor) {
    try { localStorage.setItem(clave, valor); } catch (e) { /* sin almacenamiento */ }
  }
  function leerCache(clave) {
    var v = leerLocal(clave);
    try { return v ? JSON.parse(v) : null; } catch (e) { return null; }
  }
  function guardarCache(clave, valor) {
    guardarLocal(clave, JSON.stringify(valor));
  }

  function limpiarTexto(html) {
    var div = document.createElement('div');
    div.innerHTML = String(html).replace(/<S>\d+<\/S>/gi, '').replace(/<sup>.*?<\/sup>/gi, '');
    return (div.textContent || '').replace(/\s+/g, ' ').trim();
  }

  /* ---------- API bíblica (bolls.life) con caché ---------- */
  // Devuelve una promesa con [{ n: número, t: texto }, ...]
  function obtenerCapitulo(trad, libroId, cap) {
    var clave = 'maranatha_' + trad + '_' + libroId + '_' + cap;
    var enCache = leerCache(clave);
    if (enCache) return Promise.resolve(enCache);

    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 10000);
    var url = CONFIG.apiBiblia + '/get-text/' + trad + '/' + libroId + '/' + cap + '/';

    return fetch(url, ctrl ? { signal: ctrl.signal } : {})
      .then(function (r) { clearTimeout(timer); if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (datos) {
        var versos = (datos || []).map(function (v) { return { n: v.verse, t: limpiarTexto(v.text) }; })
          .filter(function (v) { return v.t; });
        if (!versos.length) throw new Error('Capítulo vacío');
        guardarCache(clave, versos);
        return versos;
      });
  }

  function traduccionGuardada() {
    return leerLocal('maranatha_trad') || CONFIG.traduccionDefecto;
  }
  function nombreTraduccion(codigo) {
    var sel = $('traduccion');
    for (var i = 0; i < sel.options.length; i++) {
      if (sel.options[i].value === codigo) return sel.options[i].text;
    }
    return codigo;
  }

  /* =========================================================
     PALABRA DEL DÍA  (solo el día de hoy, sin repeticiones)
     ========================================================= */
  var peticionActual = 0;
  var lecturaHoy = null; // { libroId, cap, verso }

  var CAPITULOS = [];
  LIBROS_API.forEach(function (l) {
    for (var c = 1; c <= l.caps; c++) CAPITULOS.push({ id: l.id, libro: l.nombre, cap: c, total: l.caps });
  });

  /* Permutación sin repetición: para n = 0..N-1 devuelve cada índice
     exactamente una vez. Cada vuelta completa usa un orden distinto. */
  function permutar(n, N) {
    var ciclo = Math.floor(n / N), i = mod(n, N);
    var a = Math.floor(N * 0.618) + ciclo * 7;
    while (mcd(a, N) !== 1) a++;
    var b = (ciclo * 97 + 13) % N;
    return (a * i + b) % N;
  }

  // Generador pseudoaleatorio con semilla (mismo resultado para todos los visitantes)
  function aleatorio(semilla) {
    var t = (semilla + 0x6D2B79F5) | 0;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  function pintarVerso(texto, cita) {
    var bloque = $('verseText');
    bloque.classList.add('fade');
    setTimeout(function () {
      bloque.textContent = '\u201C' + texto + '\u201D';
      $('verseRef').textContent = '\u2014 ' + cita;
      bloque.classList.remove('fade');
    }, 200);

    var textoCompartir = '\u201C' + texto + '\u201D \u2014 ' + cita + '\n\nIglesia Maranatha' + (CONFIG.urlSitio ? '\n' + CONFIG.urlSitio : '');
    $('shareWhatsapp').href = 'https://wa.me/?text=' + encodeURIComponent(textoCompartir);
    $('copyVerse').dataset.texto = textoCompartir;
  }

  function pintarPalabra() {
    var hoy = new Date();
    var n = numeroDia(hoy);
    var trad = traduccionGuardada();
    var miPeticion = ++peticionActual;
    var ch = CAPITULOS[permutar(n, CAPITULOS.length)];

    // Contenido local (no necesita internet)
    var local = VERSICULOS[permutar(n, VERSICULOS.length)];
    $('reflexion').textContent = local.reflexion;
    $('oracion').textContent = ORACIONES[permutar(n, ORACIONES.length)];
    $('temaDia').textContent = TEMAS_SEMANA[hoy.getDay()];
    $('verseDate').textContent = 'Hoy \u00B7 ' + fechaLarga(hoy);
    $('lectura').textContent = ch.libro + ' ' + ch.cap;

    $('verseText').textContent = 'Cargando versículo...';
    $('verseRef').textContent = '';

    obtenerCapitulo(trad, ch.id, ch.cap).then(function (versos) {
      if (miPeticion !== peticionActual) return;
      // Preferimos versículos de tamaño legible para la tarjeta
      var buenos = versos.filter(function (v) { return v.t.length >= 50 && v.t.length <= 320; });
      if (!buenos.length) buenos = versos;
      var ciclo = Math.floor(n / CAPITULOS.length);
      var elegido = buenos[Math.floor(aleatorio(n * 31 + ciclo) * buenos.length)];

      pintarVerso(elegido.t, ch.libro + ' ' + ch.cap + ':' + elegido.n);
      lecturaHoy = { libroId: ch.id, cap: ch.cap, verso: elegido.n };
      $('lecturaNota').textContent = 'El capítulo de donde viene el versículo de hoy.';
      $('leerEnBiblia').hidden = false;
      $('apiCredit').textContent = 'Texto bíblico: ' + nombreTraduccion(trad) + ' \u00B7 vía bolls.life';
    }).catch(function () {
      if (miPeticion !== peticionActual) return;
      // Respaldo local si la API no responde
      pintarVerso(local.texto, local.cita);
      lecturaHoy = { libroId: ch.id, cap: ch.cap, verso: null };
      $('lecturaNota').textContent = 'Lee este capítulo en la sección Biblia.';
      $('leerEnBiblia').hidden = false;
      $('apiCredit').textContent = 'Versículo sin conexión (respaldo local).';
    });
  }

  function copiarTexto(texto) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(texto);
    }
    return new Promise(function (resolve) {
      var ta = document.createElement('textarea');
      ta.value = texto;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) { /* sin soporte */ }
      document.body.removeChild(ta);
      resolve();
    });
  }

  function cambiarTraduccion(codigo) {
    guardarLocal('maranatha_trad', codigo);
    $('traduccion').value = codigo;
    $('bTraduccion').value = codigo;
    pintarPalabra();
    cargarBiblia();
  }

  function initPalabra() {
    $('traduccion').value = traduccionGuardada();
    if (!$('traduccion').value) $('traduccion').value = CONFIG.traduccionDefecto;
    $('traduccion').addEventListener('change', function () { cambiarTraduccion(this.value); });

    $('copyVerse').addEventListener('click', function () {
      if (!this.dataset.texto) return;
      copiarTexto(this.dataset.texto).then(function () { toast('Versículo copiado'); });
    });

    $('shareVerse').addEventListener('click', function () {
      var texto = $('copyVerse').dataset.texto;
      if (!texto) return;
      if (navigator.share) {
        navigator.share({ title: 'Versículo del día - Maranatha', text: texto }).catch(function () {});
      } else {
        copiarTexto(texto).then(function () { toast('Copiado para compartir'); });
      }
    });

    // Abre el capítulo del día en la sección Biblia
    $('leerEnBiblia').addEventListener('click', function () {
      if (!lecturaHoy) return;
      irA(lecturaHoy.libroId, lecturaHoy.cap, lecturaHoy.verso);
      $('biblia').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    pintarPalabra();

    // Si la página queda abierta, se actualiza sola al pasar la medianoche
    var diaActual = numeroDia(new Date());
    setInterval(function () {
      var hoy = numeroDia(new Date());
      if (hoy !== diaActual) {
        diaActual = hoy;
        pintarPalabra();
        pintarFecha();
        pintarHorarios();
        pintarEventos();
      }
    }, 60000);
  }

  /* =========================================================
     BIBLIA (lector completo: 66 libros)
     ========================================================= */
  var biblia = { libro: 1, cap: 1, destacado: null, peticion: 0, testamento: 'AT' };

  function guardarPosicion() {
    guardarLocal('maranatha_biblia', biblia.libro + ':' + biblia.cap);
  }

  function llenarLibros() {
    var sel = $('bLibro');
    var html = '<optgroup label="Antiguo Testamento">';
    BIBLIA.forEach(function (b, i) {
      if (i === 39) html += '</optgroup><optgroup label="Nuevo Testamento">';
      html += '<option value="' + (i + 1) + '">' + b[0] + '</option>';
    });
    sel.innerHTML = html + '</optgroup>';
  }

  function llenarCapitulos() {
    var total = BIBLIA[biblia.libro - 1][1];
    var html = '';
    for (var c = 1; c <= total; c++) html += '<option value="' + c + '">' + c + '</option>';
    $('bCapitulo').innerHTML = html;
  }

  function pintarCuadricula() {
    var desde = biblia.testamento === 'AT' ? 0 : 39;
    var hasta = biblia.testamento === 'AT' ? 39 : 66;
    var html = '';
    for (var i = desde; i < hasta; i++) {
      html += '<button class="book-btn' + (i + 1 === biblia.libro ? ' active' : '') + '" data-libro="' + (i + 1) + '">' + BIBLIA[i][0] + '</button>';
    }
    $('bookGrid').innerHTML = html;
    var tabs = document.querySelectorAll('.tab-btn');
    for (var t = 0; t < tabs.length; t++) {
      tabs[t].classList.toggle('active', tabs[t].getAttribute('data-testamento') === biblia.testamento);
    }
  }

  function irA(libro, cap, destacado) {
    biblia.libro = libro;
    biblia.cap = cap;
    biblia.destacado = destacado || null;
    biblia.testamento = libro <= 39 ? 'AT' : 'NT';
    $('bLibro').value = libro;
    llenarCapitulos();
    $('bCapitulo').value = cap;
    pintarCuadricula();
    guardarPosicion();
    cargarBiblia();
  }

  function moverCapitulo(paso) {
    var libro = biblia.libro, cap = biblia.cap + paso;
    if (cap < 1) {
      if (libro === 1) return;
      libro--;
      cap = BIBLIA[libro - 1][1];
    } else if (cap > BIBLIA[libro - 1][1]) {
      if (libro === 66) return;
      libro++;
      cap = 1;
    }
    irA(libro, cap);
    var top = $('bTitulo').getBoundingClientRect().top + window.pageYOffset - 100;
    window.scrollTo({ top: top, behavior: 'smooth' });
  }

  function actualizarBotones() {
    var alInicio = biblia.libro === 1 && biblia.cap === 1;
    var alFinal = biblia.libro === 66 && biblia.cap === BIBLIA[65][1];
    $('bPrev').disabled = alInicio; $('bPrev2').disabled = alInicio;
    $('bNext').disabled = alFinal; $('bNext2').disabled = alFinal;
    $('bPrev').style.visibility = alInicio ? 'hidden' : 'visible';
    $('bNext').style.visibility = alFinal ? 'hidden' : 'visible';
    $('bPrev2').style.visibility = alInicio ? 'hidden' : 'visible';
    $('bNext2').style.visibility = alFinal ? 'hidden' : 'visible';
  }

  function cargarBiblia() {
    var miPeticion = ++biblia.peticion;
    var trad = $('bTraduccion').value || CONFIG.traduccionDefecto;
    var cont = $('bTexto');
    $('bTitulo').textContent = BIBLIA[biblia.libro - 1][0] + ' ' + biblia.cap;
    cont.innerHTML = '<p class="muted">Cargando...</p>';
    actualizarBotones();

    obtenerCapitulo(trad, biblia.libro, biblia.cap).then(function (versos) {
      if (miPeticion !== biblia.peticion) return;
      cont.innerHTML = '';
      var marcado = null;
      versos.forEach(function (v) {
        var p = document.createElement('p');
        var sup = document.createElement('sup');
        sup.textContent = v.n;
        p.appendChild(sup);
        var span = document.createElement('span');
        span.textContent = v.t;
        if (v.n === biblia.destacado) { span.className = 'hl'; marcado = p; }
        p.appendChild(span);
        cont.appendChild(p);
      });
      if (marcado) {
        setTimeout(function () { marcado.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 600);
      }
    }).catch(function () {
      if (miPeticion !== biblia.peticion) return;
      cont.innerHTML = '<p class="muted">No se pudo cargar el capítulo. Revisa tu conexión a internet e inténtalo de nuevo.</p>';
    });
  }

  function initBiblia() {
    llenarLibros();
    $('bTraduccion').value = traduccionGuardada();
    if (!$('bTraduccion').value) $('bTraduccion').value = CONFIG.traduccionDefecto;

    // Recordar dónde se quedó leyendo el visitante
    var pos = (leerLocal('maranatha_biblia') || '1:1').split(':');
    var libro = parseInt(pos[0], 10), cap = parseInt(pos[1], 10);
    if (!(libro >= 1 && libro <= 66)) libro = 1;
    if (!(cap >= 1 && cap <= BIBLIA[libro - 1][1])) cap = 1;

    $('bLibro').addEventListener('change', function () { irA(parseInt(this.value, 10), 1); });
    $('bCapitulo').addEventListener('change', function () { irA(biblia.libro, parseInt(this.value, 10)); });
    $('bTraduccion').addEventListener('change', function () { cambiarTraduccion(this.value); });

    $('bookGrid').addEventListener('click', function (ev) {
      var btn = ev.target.closest('.book-btn');
      if (btn) irA(parseInt(btn.getAttribute('data-libro'), 10), 1);
    });

    var tabs = document.querySelectorAll('.tab-btn');
    for (var t = 0; t < tabs.length; t++) {
      tabs[t].addEventListener('click', function () {
        biblia.testamento = this.getAttribute('data-testamento');
        pintarCuadricula();
      });
    }

    $('bPrev').addEventListener('click', function () { moverCapitulo(-1); });
    $('bPrev2').addEventListener('click', function () { moverCapitulo(-1); });
    $('bNext').addEventListener('click', function () { moverCapitulo(1); });
    $('bNext2').addEventListener('click', function () { moverCapitulo(1); });

    irA(libro, cap);
  }

  /* =========================================================
     FECHA, HORARIOS Y CUENTA REGRESIVA
     ========================================================= */
  function pintarFecha() {
    $('fechaHoy').textContent = fechaLarga(new Date());
  }

  function pintarHorarios() {
    var hoy = new Date().getDay();
    var ordenados = HORARIOS.slice().sort(function (a, b) {
      return a.dia - b.dia || a.hora.localeCompare(b.hora);
    });
    $('scheduleGrid').innerHTML = ordenados.map(function (s) {
      var esHoy = s.dia === hoy;
      return '<div class="schedule-item reveal visible' + (esHoy ? ' today' : '') + '">' +
        '<p class="day">' + DIAS[s.dia] + '</p>' +
        '<h3>' + s.nombre + '</h3>' +
        '<p class="time">' + hora12(s.hora) + '</p>' +
        '<p class="muted" style="color:rgba(255,255,255,.7)">' + s.descripcion + '</p>' +
        (esHoy ? '<span class="badge-today">Hoy</span>' : '') +
        '</div>';
    }).join('');
  }

  function proximoServicio() {
    var ahora = new Date();
    var mejor = null;
    HORARIOS.forEach(function (s) {
      var p = s.hora.split(':');
      var f = new Date(ahora);
      f.setHours(parseInt(p[0], 10), parseInt(p[1], 10), 0, 0);
      f.setDate(f.getDate() + mod(s.dia - ahora.getDay(), 7));
      if (f <= ahora) f.setDate(f.getDate() + 7);
      if (!mejor || f < mejor.fecha) mejor = { fecha: f, servicio: s };
    });
    return mejor;
  }

  function initCountdown() {
    if (!HORARIOS.length) { $('countdown').style.display = 'none'; return; }
    function tick() {
      var p = proximoServicio();
      var ms = p.fecha - new Date();
      $('nextServiceName').textContent = p.servicio.nombre + ' \u00B7 ' + DIAS[p.servicio.dia] + ' ' + hora12(p.servicio.hora);
      $('cdDias').textContent = Math.floor(ms / 86400000);
      $('cdHoras').textContent = Math.floor(ms / 3600000) % 24;
      $('cdMin').textContent = Math.floor(ms / 60000) % 60;
      $('cdSeg').textContent = Math.floor(ms / 1000) % 60;
    }
    tick();
    setInterval(tick, 1000);
  }

  /* =========================================================
     EVENTOS
     ========================================================= */
  function pintarEventos() {
    var hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    var proximos = EVENTOS.map(function (e) {
      var p = e.fecha.split('-');
      return { e: e, f: new Date(+p[0], +p[1] - 1, +p[2]) };
    }).filter(function (x) { return x.f >= hoy; })
      .sort(function (a, b) { return a.f - b.f; })
      .slice(0, 5);

    if (!proximos.length) {
      $('eventsList').innerHTML = '<p class="no-events">Pronto anunciaremos nuevos eventos. ¡Mantente atento!</p>';
      return;
    }

    $('eventsList').innerHTML = proximos.map(function (x) {
      var dias = Math.round((x.f - hoy) / 86400000);
      var cuando = dias === 0 ? '¡Es hoy!' : dias === 1 ? 'Mañana' : 'En ' + dias + ' días';
      return '<div class="event reveal visible">' +
        '<div class="event-date"><span class="d">' + x.f.getDate() + '</span><span class="m">' + MESES_CORTOS[x.f.getMonth()] + '</span></div>' +
        '<div><p class="when">' + cuando + ' \u00B7 ' + DIAS[x.f.getDay()] + ' ' + hora12(x.e.hora) + '</p>' +
        '<h3>' + x.e.titulo + '</h3><p>' + x.e.descripcion + '</p></div>' +
        '</div>';
    }).join('');
  }

  /* =========================================================
     FORMULARIO DE ORACIÓN (abre el correo del visitante)
     ========================================================= */
  function initFormulario() {
    $('prayerForm').addEventListener('submit', function (ev) {
      ev.preventDefault();
      var nombre = $('pfNombre').value.trim() || 'Anónimo';
      var peticion = $('pfPeticion').value.trim();
      if (!peticion) return;
      var asunto = 'Petición de oración - ' + nombre;
      var cuerpo = 'Nombre: ' + nombre + '\n\nPetición:\n' + peticion;
      window.location.href = 'mailto:' + CONFIG.correoOracion +
        '?subject=' + encodeURIComponent(asunto) + '&body=' + encodeURIComponent(cuerpo);
      $('formMsg').textContent = 'Gracias. Estaremos orando por ti.';
      this.reset();
    });
  }

  /* =========================================================
     NAVEGACIÓN, SCROLL Y ANIMACIONES
     ========================================================= */
  function initNav() {
    var toggle = $('navToggle'), menu = $('navMenu'), header = $('header'), toTop = $('toTop');

    toggle.addEventListener('click', function () {
      var abierto = menu.classList.toggle('open');
      toggle.classList.toggle('open', abierto);
      toggle.setAttribute('aria-expanded', abierto);
    });
    var enlaces = menu.querySelectorAll('a');
    for (var i = 0; i < enlaces.length; i++) {
      enlaces[i].addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    }

    var secciones = document.querySelectorAll('section[id]');
    function onScroll() {
      var y = window.pageYOffset;
      header.classList.toggle('scrolled', y > 60);
      toTop.classList.toggle('show', y > 600);
      for (var s = 0; s < secciones.length; s++) {
        var link = menu.querySelector('a[href="#' + secciones[s].id + '"]');
        if (!link) continue;
        var top = secciones[s].offsetTop - 120;
        link.classList.toggle('active', y >= top && y < top + secciones[s].offsetHeight);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  function initReveal() {
    var items = document.querySelectorAll('.reveal:not(.visible)');
    if (!('IntersectionObserver' in window)) {
      for (var i = 0; i < items.length; i++) items[i].classList.add('visible');
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('visible'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    for (var j = 0; j < items.length; j++) obs.observe(items[j]);
  }

  /* ---------- Inicio ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    $('year').textContent = new Date().getFullYear();
    pintarFecha();
    pintarHorarios();
    pintarEventos();
    initPalabra();
    initBiblia();
    initCountdown();
    initFormulario();
    initNav();
    initReveal();
  });
})();
