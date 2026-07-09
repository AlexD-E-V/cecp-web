/**
 * Reseñas reales de Google. Agregar una reseña = agregar un objeto aquí.
 */
export interface Testimonio {
  nombre: string;
  inicial: string;
  color: string;
  texto: string;
}

export const testimonios: Testimonio[] = [
  {
    nombre: 'Gabriela Patiño',
    inicial: 'G',
    color: '#1B6FAE',
    texto:
      '"Muy buena atención. Excelente por su diagnóstico con inteligencia artificial. Lo mejor 👍 recomendadísimo 🫶✨"',
  },
  {
    nombre: 'Darwin Torres',
    inicial: 'D',
    color: '#19B5A5',
    texto:
      '"Excelente atención profesional la que brinda el Dr. Vicente Sánchez, su equipo para realizar el electrocardiograma con Inteligencia Artificial es de gran eficacia, nos ahorramos tiempo y trámites en el proceso. Vale la pena recalcar que este equipo moderno tiene una precisión del 96% de efectividad convirtiéndolo en una técnica confiable. Mi tío, quien es paciente del Dr. Sánchez, y yo quedamos satisfechos con la atención."',
  },
  {
    nombre: 'Cazamar',
    inicial: 'C',
    color: '#3FAE8C',
    texto:
      '"Quiero expresarle mi más sincero agradecimiento al Dr. Vicente Sánchez por su profesionalismo y dedicación durante mi tratamiento. Gracias a su excelente atención, me siento mucho mejor. Le estoy muy agradecido y lo recomiendo sin duda alguna."',
  },
  {
    nombre: 'Gretty Valencia',
    inicial: 'G',
    color: '#7A5FD0',
    texto:
      '"Excelente atención con calidad y calidez, atención integral, combinando alto nivel de conocimiento científico y diagnóstico inmediato con tecnología de punta. Dr. Vicente Sánchez, Dios multiplique ese don especial que tiene, excelente profesional 🤝🙏"',
  },
  {
    nombre: 'Damaris Ruiz',
    inicial: 'D',
    color: '#E8843C',
    texto:
      '"Acudí a una consulta con el Dr. Vicente Sánchez, con inteligencia artificial cardiológica; mostró los resultados con mucha precisión de manera inmediata. Es sin duda un gran avance que permite evitar riesgos en nuestra salud. ¡Felicitaciones al Dr., un excelente profesional!"',
  },
];
