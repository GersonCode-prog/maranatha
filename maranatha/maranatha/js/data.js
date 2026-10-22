/* =========================================================
   DATOS DEL SITIO - Iglesia Maranatha
   Edita este archivo para cambiar versículos, horarios y eventos.
   ========================================================= */

/* ---------- VERSÍCULOS + REFLEXIÓN (uno por día, rotan solos) ---------- */
const VERSICULOS = [
  { texto: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.", cita: "Juan 3:16",
    reflexion: "El amor de Dios no es una idea lejana: tiene nombre, Jesús. Hoy recuerda que fuiste amado primero, antes de hacer nada para merecerlo." },
  { texto: "Jehová es mi pastor; nada me faltará.", cita: "Salmos 23:1",
    reflexion: "Un buen pastor conoce, guía y protege a sus ovejas. Entrega hoy tus preocupaciones a quien cuida de ti con fidelidad." },
  { texto: "Todo lo puedo en Cristo que me fortalece.", cita: "Filipenses 4:13",
    reflexion: "Tu fuerza no depende de tus circunstancias, sino de Cristo en ti. Lo que enfrentes hoy, no lo enfrentas solo." },
  { texto: "Fíate de Jehová de todo tu corazón, y no te apoyes en tu propia prudencia. Reconócelo en todos tus caminos, y él enderezará tus veredas.", cita: "Proverbios 3:5-6",
    reflexion: "Confiar es soltar el control. Antes de cada decisión de hoy, haz una pausa e invita a Dios a dirigir tu camino." },
  { texto: "Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que vayas.", cita: "Josué 1:9",
    reflexion: "La valentía no es ausencia de miedo, es avanzar sabiendo que Dios va contigo. Da hoy ese paso que has estado posponiendo." },
  { texto: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.", cita: "Mateo 11:28",
    reflexion: "Jesús no te pide que llegues fuerte, te invita a llegar cansado. En Él hay descanso verdadero para tu alma." },
  { texto: "Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados.", cita: "Romanos 8:28",
    reflexion: "Aun lo que no entiendes hoy, Dios lo puede usar para tu bien. Su propósito es más grande que tu momento." },
  { texto: "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.", cita: "Isaías 41:10",
    reflexion: "Dios no promete un camino sin dificultades, pero sí Su presencia en cada paso. Su mano te sostiene." },
  { texto: "El Señor no retarda su promesa, según algunos la tienen por tardanza, sino que es paciente para con nosotros, no queriendo que ninguno perezca.", cita: "2 Pedro 3:9",
    reflexion: "Maranatha: el Señor viene. Su aparente demora es misericordia. Aprovecha hoy para compartir Su amor con alguien." },
  { texto: "Clama a mí, y yo te responderé, y te enseñaré cosas grandes y ocultas que tú no conoces.", cita: "Jeremías 33:3",
    reflexion: "La oración es una puerta abierta. Dios desea hablarte; dedica unos minutos hoy a escucharle en silencio." },
  { texto: "El que habita al abrigo del Altísimo morará bajo la sombra del Omnipotente.", cita: "Salmos 91:1",
    reflexion: "Habitar es permanecer. No se trata de visitar a Dios de vez en cuando, sino de vivir cerca de Él cada día." },
  { texto: "Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias.", cita: "Filipenses 4:6",
    reflexion: "Cambia la preocupación por oración y la queja por gratitud. La paz de Dios guardará tu corazón." },
  { texto: "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.", cita: "Jeremías 29:11",
    reflexion: "Dios piensa en ti con bondad. Tu futuro está en manos de quien te ama." },
  { texto: "Lámpara es a mis pies tu palabra, y lumbrera a mi camino.", cita: "Salmos 119:105",
    reflexion: "La Palabra no siempre ilumina todo el camino, pero sí el próximo paso. Léela hoy y deja que te guíe." },
  { texto: "Mas el fruto del Espíritu es amor, gozo, paz, paciencia, benignidad, bondad, fe, mansedumbre, templanza.", cita: "Gálatas 5:22-23",
    reflexion: "El fruto crece cuando permanecemos unidos a Cristo. ¿Qué fruto necesita florecer hoy en tu vida?" },
  { texto: "Así que, si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas.", cita: "2 Corintios 5:17",
    reflexion: "Tu pasado no define tu identidad. En Cristo eres una nueva creación; vive hoy como tal." },
  { texto: "Jesucristo es el mismo ayer, y hoy, y por los siglos.", cita: "Hebreos 13:8",
    reflexion: "Todo cambia a tu alrededor, pero Jesús permanece. Su fidelidad de ayer es la misma de hoy." },
  { texto: "Pero los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas; correrán, y no se cansarán; caminarán, y no se fatigarán.", cita: "Isaías 40:31",
    reflexion: "Esperar en Dios no es pasividad, es confianza activa. Él renueva tus fuerzas cuando las tuyas se agotan." },
  { texto: "Amarás al Señor tu Dios con todo tu corazón, y con toda tu alma, y con toda tu mente. Y amarás a tu prójimo como a ti mismo.", cita: "Mateo 22:37-39",
    reflexion: "Amar a Dios y amar al prójimo van juntos. Busca hoy una forma concreta de mostrar amor a alguien." },
  { texto: "Porque por gracia sois salvos por medio de la fe; y esto no de vosotros, pues es don de Dios.", cita: "Efesios 2:8",
    reflexion: "La salvación es un regalo, no un premio. Vive agradecido, no tratando de ganar lo que ya te fue dado." },
  { texto: "Yo soy el camino, y la verdad, y la vida; nadie viene al Padre, sino por mí.", cita: "Juan 14:6",
    reflexion: "En un mundo de muchas voces, Jesús es la verdad que da dirección y vida a todo lo demás." },
  { texto: "Deléitate asimismo en Jehová, y él te concederá las peticiones de tu corazón.", cita: "Salmos 37:4",
    reflexion: "Cuando Dios es tu mayor gozo, tus deseos se alinean con los Suyos. Busca primero Su presencia." },
  { texto: "Mas buscad primeramente el reino de Dios y su justicia, y todas estas cosas os serán añadidas.", cita: "Mateo 6:33",
    reflexion: "Las prioridades revelan el corazón. Pon hoy a Dios en primer lugar en tu agenda." },
  { texto: "La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da. No se turbe vuestro corazón, ni tenga miedo.", cita: "Juan 14:27",
    reflexion: "La paz de Cristo no depende de que todo esté bien afuera, sino de que Él esté presente adentro." },
  { texto: "Cercano está Jehová a los quebrantados de corazón; y salva a los contritos de espíritu.", cita: "Salmos 34:18",
    reflexion: "Si hoy tu corazón está herido, Dios no está lejos. Está más cerca de lo que imaginas." },
  { texto: "Velad, pues, porque no sabéis a qué hora ha de venir vuestro Señor.", cita: "Mateo 24:42",
    reflexion: "Vivir velando es vivir con propósito, sabiendo que Cristo regresa. Que hoy te encuentre fiel." },
  { texto: "Encomienda a Jehová tu camino, y confía en él; y él hará.", cita: "Salmos 37:5",
    reflexion: "Encomendar es poner en Sus manos. Tú das el paso de fe; Dios se encarga del resultado." },
  { texto: "El amor es sufrido, es benigno; el amor no tiene envidia, el amor no es jactancioso, no se envanece.", cita: "1 Corintios 13:4",
    reflexion: "El verdadero amor se ve en la paciencia y la bondad diaria. Practícalo hoy en casa." },
  { texto: "Si confesamos nuestros pecados, él es fiel y justo para perdonar nuestros pecados, y limpiarnos de toda maldad.", cita: "1 Juan 1:9",
    reflexion: "No hay culpa que el perdón de Dios no pueda limpiar. Acércate a Él con sinceridad." },
  { texto: "Este es el día que hizo Jehová; nos gozaremos y alegraremos en él.", cita: "Salmos 118:24",
    reflexion: "Hoy es un regalo de Dios. Elige el gozo y agradece por lo que tienes." },
  { texto: "He aquí, yo estoy a la puerta y llamo; si alguno oye mi voz y abre la puerta, entraré a él, y cenaré con él, y él conmigo.", cita: "Apocalipsis 3:20",
    reflexion: "Jesús busca comunión contigo. Abre hoy tu corazón y disfruta de Su compañía." },
  { texto: "Bienaventurados los de limpio corazón, porque ellos verán a Dios.", cita: "Mateo 5:8",
    reflexion: "Un corazón limpio busca a Dios sin dobleces. Pide que Él purifique tus intenciones." },
  { texto: "Dios es nuestro amparo y fortaleza, nuestro pronto auxilio en las tribulaciones.", cita: "Salmos 46:1",
    reflexion: "En la tormenta, Dios es refugio seguro. Corre a Él antes que a cualquier otra cosa." },
  { texto: "Ciertamente vengo en breve. Amén; sí, ven, Señor Jesús.", cita: "Apocalipsis 22:20",
    reflexion: "Esta es nuestra esperanza y nuestro nombre: ¡Maranatha! Vive hoy con los ojos puestos en Su venida." },
  { texto: "Instruye al niño en su camino, y aun cuando fuere viejo no se apartará de él.", cita: "Proverbios 22:6",
    reflexion: "Lo que sembramos en la familia da fruto por generaciones. Ora hoy por los niños de tu casa y tu iglesia." },
  { texto: "Pedid, y se os dará; buscad, y hallaréis; llamad, y se os abrirá.", cita: "Mateo 7:7",
    reflexion: "Dios es un Padre que escucha. No te canses de pedir, buscar y llamar." },
  { texto: "Crea en mí, oh Dios, un corazón limpio, y renueva un espíritu recto dentro de mí.", cita: "Salmos 51:10",
    reflexion: "La renovación comienza con un corazón dispuesto. Haz de este versículo tu oración hoy." },
  { texto: "Porque donde están dos o tres congregados en mi nombre, allí estoy yo en medio de ellos.", cita: "Mateo 18:20",
    reflexion: "La fe se vive en comunidad. Te esperamos en la casa de Dios para adorar juntos." }
];

/* ---------- ORACIONES (rotan con otro ritmo para variar combinaciones) ---------- */
const ORACIONES = [
  "Señor, gracias por un nuevo día. Guía mis pasos, guarda mi familia y úsame para bendecir a otros. En el nombre de Jesús, amén.",
  "Padre, entrego en Tus manos mis preocupaciones. Dame Tu paz que sobrepasa todo entendimiento. Amén.",
  "Jesús, ayúdame a amar como Tú amas, a perdonar como Tú perdonas y a servir con humildad. Amén.",
  "Espíritu Santo, llena mi vida de Tu presencia. Que mis palabras y acciones reflejen a Cristo hoy. Amén.",
  "Dios, te pido por los enfermos, los que sufren y los que no te conocen. Muéstrales Tu amor. Amén.",
  "Señor, dame sabiduría para mis decisiones y un corazón dispuesto a obedecer Tu voluntad. Amén.",
  "Padre, bendice a mi iglesia, a nuestros pastores y líderes. Que seamos luz en nuestra comunidad. Amén.",
  "Señor Jesús, mantén mi corazón despierto esperando Tu venida. ¡Maranatha, ven pronto! Amén.",
  "Dios de toda provisión, gracias por el pan de cada día. Enséñame a ser generoso con lo que me das. Amén.",
  "Padre, sana las heridas de mi corazón y renueva mis fuerzas. Confío en Ti. Amén.",
  "Señor, te pido por mi nación: por sus autoridades, sus familias y su paz. Amén.",
  "Jesús, que mi hogar sea un lugar donde Tú reines. Une a mi familia en Tu amor. Amén.",
  "Dios, gracias por Tu Palabra. Abre mi entendimiento para conocerte más cada día. Amén."
];

/* ---------- LECTURA BÍBLICA (un capítulo diario; cicla por libros) ---------- */
const LECTURAS = [
  { libro: "Juan", caps: 21 },
  { libro: "Salmos", caps: 30 },
  { libro: "Proverbios", caps: 31 },
  { libro: "Hechos", caps: 28 },
  { libro: "Romanos", caps: 16 },
  { libro: "Filipenses", caps: 4 },
  { libro: "Santiago", caps: 5 },
  { libro: "Marcos", caps: 16 },
  { libro: "Efesios", caps: 6 },
  { libro: "1 Tesalonicenses", caps: 5 }
];

/* ---------- TEMA SEGÚN EL DÍA DE LA SEMANA (0 = domingo) ---------- */
const TEMAS_SEMANA = [
  "Domingo: día de adoración y comunión",
  "Lunes: comienza la semana en las manos de Dios",
  "Martes: fe que se pone en acción",
  "Miércoles: día de oración e intercesión",
  "Jueves: crecemos en la Palabra",
  "Viernes: gratitud por la fidelidad de Dios",
  "Sábado: familia y descanso en el Señor"
];

/* ---------- HORARIOS DE SERVICIO (dia: 0=domingo ... 6=sábado; hora 24h) ---------- */
const HORARIOS = [
  { dia: 0, nombre: "Culto de Adoración", hora: "09:00", descripcion: "Alabanza, Palabra y escuela dominical para niños." },
  { dia: 0, nombre: "Culto Evangelístico", hora: "17:00", descripcion: "Un servicio para toda la familia." },
  { dia: 3, nombre: "Culto de Oración", hora: "19:00", descripcion: "Intercesión y estudio bíblico." },
  { dia: 5, nombre: "Reunión de Jóvenes", hora: "19:00", descripcion: "Alabanza, enseñanza y comunión." },
  { dia: 6, nombre: "Ministerio Femenil", hora: "16:00", descripcion: "Mujeres que crecen en la fe." }
];

/* ---------- EVENTOS (formato fecha: AAAA-MM-DD). Los pasados se ocultan solos ---------- */
const EVENTOS = [
  { fecha: "2026-10-31", hora: "18:00", titulo: "Noche de Alabanza", descripcion: "Una noche especial de adoración para toda la iglesia." },
  { fecha: "2026-11-15", hora: "09:00", titulo: "Santa Cena", descripcion: "Celebramos juntos la Cena del Señor." },
  { fecha: "2026-11-28", hora: "08:00", titulo: "Retiro de Jóvenes", descripcion: "Un día de convivencia, juegos y Palabra." },
  { fecha: "2026-12-13", hora: "17:00", titulo: "Cantata Navideña", descripcion: "Celebramos el nacimiento de Jesús con música y teatro." },
  { fecha: "2026-12-31", hora: "20:00", titulo: "Culto de Fin de Año", descripcion: "Damos gracias a Dios por el año y recibimos el nuevo en Su presencia." },
  { fecha: "2027-01-10", hora: "09:00", titulo: "Ayuno y Oración", descripcion: "Iniciamos el año buscando el rostro de Dios." }
];

/* ---------- CONFIGURACIÓN ---------- */
const CONFIG = {
  // Correo donde llegan las peticiones de oración
  correoOracion: "contacto@maranatha.org",
  // URL del sitio (para compartir). Ej: "https://tuusuario.github.io/maranatha/"
  urlSitio: ""
};
