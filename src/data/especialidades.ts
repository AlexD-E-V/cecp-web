/**
 * Especialidades médicas: agregar/quitar una especialidad = editar SOLO este archivo.
 * Las tarjetas, los modales y el JSON-LD de médicos se generan desde aquí.
 */
import type { ImageMetadata } from 'astro';
// Las fotos se resuelven por nombre base (sin extensión): reemplazar un .jpg
// por un .webp del mismo nombre no requiere tocar este archivo.
import { img } from '../assets/img';

const espCardiologia = img('esp-cardiologia');
const espPediatria = img('esp-pediatria');
const espGinecologia = img('esp-ginecologia');
const espOdontologia = img('esp-odontologia');
const espMedicinaGeneral = img('esp-medicina-general');
const espGenetica = img('esp-genetica');
const equipoElectro = img('equipo-electrocardiografo');
const equipoHolterArritmias = img('equipo-holter-arritmias');
const equipoHolterPresion = img('equipo-holter-presion');
const equipoEcografo = img('equipo-ecografo-vscan');
const equipoDoppler = img('equipo-doppler-fetal');

export interface EquipoMedico {
  foto: ImageMetadata;
  alt: string;
  nombre: string;
}

export interface Procedimiento {
  icono: string;
  nombre: string;
}

export interface ModalProcedimientos {
  icono: string;
  intro: string;
  procedimientos: Procedimiento[];
  equiposTitulo?: string;
  equipos?: EquipoMedico[];
}

export interface Especialidad {
  id: string;
  nombre: string;
  doctor: string;
  /** Formación y títulos del profesional (línea fina bajo el nombre) */
  credenciales?: string;
  /** Especialidad según schema.org (para el JSON-LD de Physician) */
  schemaEspecialidad?: string;
  /** Tipo schema.org del profesional (Physician por defecto) */
  schemaTipo?: 'Physician' | 'Dentist';
  /** Puede contener <b> — se renderiza con set:html */
  descripcion: string;
  foto?: ImageMetadata;
  fotoAlt?: string;
  fotoPosicion?: string;
  /** Clase de color de la insignia 3D */
  badge: string;
  /** SVG interno de la insignia (trazado decorativo) */
  badgeSvg: string;
  /** Mensaje pre-llenado de WhatsApp; si hay modal, se usa dentro del modal */
  mensajeWhatsApp: string;
  modal?: ModalProcedimientos;
}

export const especialidades: Especialidad[] = [
  {
    id: 'cardio',
    nombre: 'Cardiología',
    doctor: 'Dr. Vicente Sánchez Crespo',
    credenciales:
      'Experto en Medicina Genética y Genómica (UCAM, España) · Enfermedades autoinmunes y gestión en salud pública (Johns Hopkins University) · Consultor sénior',
    schemaEspecialidad: 'Cardiovascular',
    descripcion:
      '¿Buscas un <b>cardiólogo en Guayaquil</b>? Prevención, diagnóstico y tratamiento de enfermedades del corazón: ECG, ecocardiograma, Holter 24h y estudios de cardiogenética.',
    foto: espCardiologia,
    fotoAlt: 'Dr. Vicente Sánchez Crespo, cardiólogo de CECP en Guayaquil, junto a un modelo anatómico del corazón en su consultorio',
    fotoPosicion: 'center 24%',
    badge: 'b-car',
    badgeSvg:
      '<svg viewBox="0 0 24 24"><path d="M12 21 C6 16 3 12 3 8.5 A4.5 4.5 0 0 1 12 6 A4.5 4.5 0 0 1 21 8.5 C21 12 18 16 12 21Z" fill="#fff"/></svg>',
    mensajeWhatsApp:
      'Hola CECP, quiero agendar una cita de cardiología con el Dr. Vicente Sánchez Crespo.',
    modal: {
      icono: '🫀',
      intro:
        'Diagnóstico cardiovascular con tecnología de última generación respaldada por inteligencia artificial.',
      procedimientos: [
        { icono: '🩺', nombre: 'Consulta cardiológica' },
        { icono: '📈', nombre: 'Electrocardiograma (ECG)' },
        { icono: '🫀', nombre: 'Ecocardiograma' },
        { icono: '⏱️', nombre: 'Holter de presión 24h' },
        { icono: '💓', nombre: 'Holter de arritmia 24h' },
        { icono: '🔬', nombre: 'Valoración de isquemias' },
        { icono: '🫁', nombre: 'Monitoreo cardiopulmonar' },
        { icono: '🧬', nombre: 'Cardiogenética y Amiloidosis' },
      ],
      equiposTitulo: 'Nuestra tecnología cardiovascular',
      equipos: [
        { foto: equipoElectro, alt: 'Electrocardiógrafo de 12 derivaciones con inteligencia artificial', nombre: 'Electrocardiógrafo con IA' },
        { foto: equipoHolterArritmias, alt: 'Holter de arritmias de 24 horas', nombre: 'Holter de arritmias 24h' },
        { foto: equipoHolterPresion, alt: 'Holter de presión arterial MAPA 24 horas', nombre: 'Holter de presión (MAPA)' },
        { foto: equipoEcografo, alt: 'Ecógrafo portátil GE Vscan', nombre: 'Ecógrafo GE Vscan' },
      ],
    },
  },
  {
    id: 'pediatria',
    nombre: 'Pediatría / Neonatología',
    doctor: 'Dra. Ana Tapia',
    schemaEspecialidad: 'Pediatric',
    descripcion:
      'Pediatra con <b>más de 30 años de experiencia</b>, dedicada a acompañar a las familias en el control de la salud, crecimiento y desarrollo de sus niños, desde el nacimiento hasta la adolescencia.',
    foto: espPediatria,
    fotoAlt: 'Dra. Ana Tapia, pediatra y neonatóloga de CECP en Guayaquil, en su consultorio',
    fotoPosicion: 'center 30%',
    badge: 'b-ped',
    badgeSvg:
      '<svg viewBox="0 0 24 24"><circle cx="12" cy="7.5" r="3.2" fill="#fff"/><rect x="8.5" y="10.4" width="7" height="4" rx="2" fill="#fff"/><circle cx="12" cy="17.2" r="3.3" fill="none" stroke="#fff" stroke-width="2.2"/></svg>',
    mensajeWhatsApp:
      'Hola CECP, quiero agendar una cita de pediatría o neonatología con la Dra. Ana Tapia.',
  },
  {
    id: 'gine',
    nombre: 'Ginecología / Obstetricia',
    doctor: 'Dra. Adriana Lema',
    schemaEspecialidad: 'Gynecologic',
    descripcion:
      'Control ginecológico, prenatal, Papanicolau, citología líquida, anticoncepción y salud de la mujer.',
    foto: espGinecologia,
    fotoAlt: 'Consulta de ginecología: explicación del sistema reproductor femenino',
    badge: 'b-gin',
    badgeSvg:
      '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4.6" fill="none" stroke="#fff" stroke-width="2.3"/><path d="M12 12.6V21M8.4 17.4h7.2" stroke="#fff" stroke-width="2.3" stroke-linecap="round"/></svg>',
    mensajeWhatsApp:
      'Hola CECP, quiero agendar una cita de ginecología u obstetricia con la Dra. Adriana Lema.',
    modal: {
      icono: '🌸',
      intro:
        'Atención integral de la salud de la mujer en cada etapa: prevención, embarazo, parto y planificación.',
      procedimientos: [
        { icono: '🩺', nombre: 'Consulta ginecológica' },
        { icono: '🤰', nombre: 'Consulta prenatal' },
        { icono: '👶', nombre: 'Partos y cesáreas' },
        { icono: '🧪', nombre: 'Citología líquida' },
        { icono: '🔬', nombre: 'Toma de Papanicolau' },
        { icono: '🧬', nombre: 'PCR ETS' },
        { icono: '🦠', nombre: 'Cultivo de secreción vaginal' },
        { icono: '💉', nombre: 'Vacuna VPH' },
        { icono: '🧬', nombre: 'Genotipificación VPH' },
        { icono: '➕', nombre: 'Colocación y retiro de implante subdérmico' },
        { icono: '⚕️', nombre: 'Colocación y retiro de T de cobre' },
        { icono: '💉', nombre: 'Métodos anticonceptivos inyectables' },
        { icono: '🤱', nombre: 'Pruebas de embarazo' },
        { icono: '🧫', nombre: 'TORCH' },
      ],
      equiposTitulo: 'Nuestro equipo de control prenatal',
      equipos: [
        { foto: equipoDoppler, alt: 'Doppler fetal para control del bienestar del bebé', nombre: 'Doppler fetal' },
      ],
    },
  },
  {
    id: 'odonto',
    nombre: 'Odontología',
    doctor: 'Dra. Karem Michelle Centeno German',
    schemaEspecialidad: 'Dentistry',
    schemaTipo: 'Dentist',
    descripcion:
      '<b>Odontología en Guayaquil</b>: limpieza, restauraciones, endodoncia, coronas, implantes, ortodoncia y blanqueamiento dental.',
    foto: espOdontologia,
    fotoAlt: 'Odontóloga mostrando un modelo dental en consulta de odontología en Guayaquil',
    badge: 'b-odo',
    badgeSvg:
      '<svg viewBox="0 0 24 24"><path d="M12 3.5c-3.6 0-5.6 2.2-5.6 5 0 1.8.7 2.9 1.3 4.2.5 1.1.7 3 .9 4.8.2 1.1 1.7 1.1 1.9 0 .3-1.6.7-3.1 1.5-3.1s1.2 1.5 1.5 3.1c.2 1.1 1.7 1.1 1.9 0 .2-1.8.4-3.7.9-4.8.6-1.3 1.3-2.4 1.3-4.2 0-2.8-2-5-5.6-5Z" fill="#fff"/></svg>',
    mensajeWhatsApp:
      'Hola CECP, quiero agendar una cita de odontología con la Dra. Karem Michelle Centeno German.',
    modal: {
      icono: '🦷',
      intro:
        'Cuidado integral de tu salud bucal, desde la prevención hasta tratamientos especializados.',
      procedimientos: [
        { icono: '🩺', nombre: 'Consulta odontológica' },
        { icono: '✨', nombre: 'Limpieza dental' },
        { icono: '🪥', nombre: 'Destartraje' },
        { icono: '🦷', nombre: 'Restauraciones' },
        { icono: '🔧', nombre: 'Exodoncias' },
        { icono: '⚕️', nombre: 'Endodoncias' },
        { icono: '👑', nombre: 'Coronas' },
        { icono: '😁', nombre: 'Prótesis' },
        { icono: '⚪', nombre: 'Blanqueamiento dental' },
        { icono: '🔪', nombre: 'Cirugía de tercer molar' },
        { icono: '🔩', nombre: 'Implantes' },
        { icono: '😬', nombre: 'Ortodoncia' },
      ],
    },
  },
  {
    id: 'pnl',
    nombre: 'Programación Neurolingüística y Estrés Oxidativo',
    doctor: 'Lcdo. David A. Sánchez Tapia',
    // PENDIENTE DE CONFIRMAR con el profesional: qué formación corresponde a
    // cada institución (el mensaje original solo listó las instituciones)
    credenciales:
      'Programación Neurolingüística (Esneca Business School, España) · Formación en Saval University',
    descripcion:
      'Acompañamiento en <b>programación neurolingüística (PNL)</b> y manejo del estrés oxidativo: herramientas para el bienestar emocional, los hábitos saludables y el equilibrio entre mente y cuerpo.',
    foto: img('esp-pnl'),
    fotoAlt: 'Lcdo. David A. Sánchez Tapia, especialista en programación neurolingüística de CECP',
    badge: 'b-pnl',
    badgeSvg:
      '<svg viewBox="0 0 24 24"><circle cx="12" cy="5.5" r="2.1" fill="#fff"/><circle cx="5.5" cy="12" r="2.1" fill="#fff"/><circle cx="18.5" cy="12" r="2.1" fill="#fff"/><circle cx="12" cy="18.5" r="2.1" fill="#fff"/><path d="M12 7.6v8.8M7.4 10.7l9.2 2.6M16.6 10.7l-9.2 2.6" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>',
    mensajeWhatsApp:
      'Hola CECP, quiero información sobre programación neurolingüística (PNL) con el Lcdo. David Sánchez Tapia.',
  },
  {
    id: 'digital',
    nombre: 'Transformación Digital en Salud',
    doctor: 'Lcdo. Alex D. Enriquez Vera',
    credenciales:
      'Licenciado en Sistemas y Tecnologías de la Información (UCSG, Ecuador) · Desarrollo de software · Administrador de la plataforma EAGLES VISION – Salud, Eficiencia e IA',
    descripcion:
      'Transformación digital de la atención médica: <b>historias clínicas electrónicas</b> gestionadas con rapidez, precisión y seguridad, apoyadas en inteligencia artificial para favorecer el diagnóstico precoz y mejorar la calidad de vida de los pacientes.',
    foto: img('esp-digital'),
    fotoAlt: 'Lcdo. Alex D. Enriquez Vera, responsable de transformación digital y de la plataforma EAGLES VISION en CECP',
    badge: 'b-dig',
    badgeSvg:
      '<svg viewBox="0 0 24 24"><rect x="8.5" y="8.5" width="7" height="7" rx="1.5" fill="#fff"/><path d="M10.5 4v3M13.5 4v3M10.5 17v3M13.5 17v3M4 10.5h3M4 13.5h3M17 10.5h3M17 13.5h3" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>',
    mensajeWhatsApp:
      'Hola CECP, quiero información sobre transformación digital en salud y la plataforma EAGLES VISION con el Lcdo. Alex Enriquez.',
    modal: {
      icono: '🩺',
      intro:
        'Innovación y desarrollo tecnológico al servicio de la atención médica: gestión clínica digital, segura y eficiente, con inteligencia artificial de apoyo.',
      procedimientos: [
        { icono: '📋', nombre: 'Historias clínicas electrónicas' },
        { icono: '🔒', nombre: 'Gestión segura de datos clínicos' },
        { icono: '🤖', nombre: 'IA de apoyo al diagnóstico precoz' },
        { icono: '🎯', nombre: 'Medicina de precisión' },
        { icono: '📊', nombre: 'Asesoría en gestión administrativa' },
        { icono: '🔗', nombre: 'Sistemas digitales multimodales' },
        { icono: '⚙️', nombre: 'Transformación digital de procesos' },
        { icono: '🦅', nombre: 'Plataforma EAGLES VISION' },
      ],
    },
  },
  {
    id: 'general',
    nombre: 'Medicina General e Integral',
    doctor: 'Equipo CECP',
    descripcion:
      'Consulta médica integral, chequeos preventivos y seguimiento continuo de tu salud.',
    foto: espMedicinaGeneral,
    fotoAlt: 'Toma de presión arterial en consulta de medicina general',
    badge: 'b-med',
    badgeSvg:
      '<svg viewBox="0 0 24 24"><rect x="9.5" y="4" width="5" height="16" rx="1.5" fill="#fff"/><rect x="4" y="9.5" width="16" height="5" rx="1.5" fill="#fff"/></svg>',
    mensajeWhatsApp: 'Hola CECP, quiero agendar una cita de medicina general.',
  },
  {
    id: 'genetica',
    nombre: 'Asesoría Genética',
    doctor: 'Equipo CECP',
    descripcion:
      'Orientación especializada sobre riesgos hereditarios y estudios genéticos para tu familia.',
    foto: espGenetica,
    fotoAlt: 'Representación 3D de cadenas de ADN, asesoría genética en CECP Guayaquil',
    badge: 'b-gen',
    badgeSvg:
      '<svg viewBox="0 0 24 24"><path d="M8 3c5 3.2 5 5.8 0 9 5 3.2 5 5.8 0 9M16 3c-5 3.2-5 5.8 0 9-5 3.2-5 5.8 0 9" fill="none" stroke="#fff" stroke-width="2.1" stroke-linecap="round"/><path d="M9.2 7h5.6M9.2 12h5.6M9.2 17h5.6" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>',
    mensajeWhatsApp: 'Hola CECP, quiero información sobre asesoría genética.',
  },
  {
    id: 'autoinmunes',
    nombre: 'Enfermedades Autoinmunes',
    doctor: 'Equipo CECP',
    descripcion:
      'Diagnóstico y acompañamiento en condiciones autoinmunes con enfoque multidisciplinario.',
    badge: 'b-aut',
    badgeSvg:
      '<svg viewBox="0 0 24 24"><path d="M12 3l7 2.6v5c0 4.6-2.8 7.6-7 9.4-4.2-1.8-7-4.8-7-9.4v-5Z" fill="none" stroke="#fff" stroke-width="2.1" stroke-linejoin="round"/><path d="M9 11.5l2 2 4-4.2" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    mensajeWhatsApp: 'Hola CECP, quiero información sobre enfermedades autoinmunes.',
  },
];
