/* =========================================================
   LÓGICA DEL SITIO - Iglesia Maranatha
   ========================================================= */
(function () {
  'use strict';

  var DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  var MESES_CORTOS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- Utilidades de fecha ---------- */
  // Número de día absoluto (local) — cambia exactamente a medianoche
  function numeroDia(fecha) {
    return Math.floor(Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()) / 86400000);
  }
  function mod(n, m) { return ((n % m) + m) % m; }
  function fechaLarga(fecha) {
    return fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }
  function hora12(hhmm) {
    var p = hhmm.split(':'), h = parseInt(p[0], 10), m = p[1];
    var suf = h >= 12 ? 'p. m.' : 'a. m.';
    h = h % 12 || 12;
    return h + ':' + m + ' ' + suf;
  }

  /* ---------- Toast ---------- */
  var toastTimer;
  function toast(msg) {
    var t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2500);
  }

  /* =========================================================
     PALABRA DEL DÍA
     ========================================================= */
  var desplazamiento = 0; // 0 = hoy, -1 = ayer, +1 = mañana...

  // Lista plana de capítulos para la lectura diaria
  var capitulos = [];
  LECTURAS.forEach(function (l) {
    for (var c = 1; c <= l.caps; c++) capitulos.push({ libro: l.libro, cap: c, total: l.caps });
  });

  function contenidoDelDia(fecha) {
    var n = numeroDia(fecha);
    return {
      verso: VERSICULOS[mod(n, VERSICULOS.length)],
      oracion: ORACIONES[mod(n, ORACIONES.length)],
      lectura: capitulos[mod(n, capitulos.length)],
      tema: TEMAS_SEMANA[fecha.getDay()]
    };
  }

  function pintarPalabra() {
    var fecha = new Date();
    fecha.setDate(fecha.getDate() + desplazamiento);
    var d = contenidoDelDia(fecha);

    var bloque = $('verseText');
    bloque.classList.add('fade');
    setTimeout(function () {
      bloque.textContent = '\u201C' + d.verso.texto + '\u201D';
      $('verseRef').textContent = '\u2014 ' + d.verso.cita;
      bloque.classList.remove('fade');
    }, 200);

    $('reflexion').textContent = d.verso.reflexion;
    $('oracion').textContent = d.oracion;
    $('lectura').textContent = d.lectura.libro + ' ' + d.lectura.cap;
    $('lecturaNota').textContent = 'Capítulo ' + d.lectura.cap + ' de ' + d.lectura.total + ' de ' + d.lectura.libro + '.';
    $('temaDia').textContent = d.tema;

    if (desplazamiento === 0) $('verseDate').textContent = 'Hoy · ' + fechaLarga(fecha);
    else if (desplazamiento === -1) $('verseDate').textContent = 'Ayer · ' + fechaLarga(fecha);
    else if (desplazamiento === 1) $('verseDate').textContent = 'Mañana · ' + fechaLarga(fecha);
    else $('verseDate').textContent = fechaLarga(fecha);

    $('todayBtn').hidden = desplazamiento === 0;

    var textoCompartir = '\u201C' + d.verso.texto + '\u201D \u2014 ' + d.verso.cita + '\n\nIglesia Maranatha' + (CONFIG.urlSitio ? '\n' + CONFIG.urlSitio : '');
    $('shareWhatsapp').href = 'https://wa.me/?text=' + encodeURIComponent(textoCompartir);
    $('copyVerse').dataset.texto = textoCompartir;
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

  function initPalabra() {
    $('prevDay').addEventListener('click', function () { desplazamiento--; pintarPalabra(); });
    $('nextDay').addEventListener('click', function () { desplazamiento++; pintarPalabra(); });
    $('todayBtn').addEventListener('click', function () { desplazamiento = 0; pintarPalabra(); });

    $('copyVerse').addEventListener('click', function () {
      copiarTexto(this.dataset.texto).then(function () { toast('Versículo copiado'); });
    });

    $('shareVerse').addEventListener('click', function () {
      var texto = $('copyVerse').dataset.texto;
      if (navigator.share) {
        navigator.share({ title: 'Versículo del día - Maranatha', text: texto }).catch(function () {});
      } else {
        copiarTexto(texto).then(function () { toast('Copiado para compartir'); });
      }
    });

    pintarPalabra();

    // Si la página queda abierta, se actualiza sola al pasar la medianoche
    var diaActual = numeroDia(new Date());
    setInterval(function () {
      var hoy = numeroDia(new Date());
      if (hoy !== diaActual) {
        diaActual = hoy;
        desplazamiento = 0;
        pintarPalabra();
        pintarFecha();
        pintarHorarios();
        pintarEventos();
      }
    }, 60000);
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
      return '<div class="schedule-item reveal' + (esHoy ? ' today' : '') + '">' +
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
      var dif = mod(s.dia - ahora.getDay(), 7);
      f.setDate(f.getDate() + dif);
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
      return '<div class="event reveal">' +
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
      $('formMsg').textContent = 'Gracias. Estaremos orando por ti. \uD83D\uDE4F';
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
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });

    var secciones = document.querySelectorAll('section[id]');
    function onScroll() {
      var y = window.scrollY;
      header.classList.toggle('scrolled', y > 60);
      toTop.classList.toggle('show', y > 600);
      secciones.forEach(function (s) {
        var link = menu.querySelector('a[href="#' + s.id + '"]');
        if (!link) return;
        var top = s.offsetTop - 120;
        link.classList.toggle('active', y >= top && y < top + s.offsetHeight);
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('visible'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { obs.observe(el); });
  }

  /* ---------- Inicio ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    $('year').textContent = new Date().getFullYear();
    pintarFecha();
    pintarHorarios();
    pintarEventos();
    initPalabra();
    initCountdown();
    initFormulario();
    initNav();
    initReveal(); // al final, para incluir los elementos generados por JS
  });
})();
