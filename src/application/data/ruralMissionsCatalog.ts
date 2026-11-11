/**
 * @file src/application/data/ruralMissionsCatalog.ts
 * @description Catálogo de Materias Básicas (Matemáticas, Español, Inglés, Química y Estadística),
 * Nómina Inicial de Estudiantes y Maestros para el Ecosistema EduVereda.
 *
 * Incluye los nombres y estilos visuales de los mockups en design/mockups.jpeg y design/style-mockups.jpeg.
 */

import { LearningMission } from '../../domain/entities/StudentMission';
import { StudentProfile, TeacherProfile } from '../../domain/entities/Role';

/**
 * Nómina semilla de estudiantes rurales (alineada con design/style-mockups.jpeg).
 */
export const INITIAL_STUDENTS_ROSTER: StudentProfile[] = [
  {
    id: 'EST-101',
    name: 'Mateo Gómez',
    grade: '9°',
    vereda: 'Vereda El Roblal',
    avatarEmoji: '👦🏽',
  },
  {
    id: 'EST-102',
    name: 'Sofia R.',
    grade: '9°',
    vereda: 'Vereda La Esperanza',
    avatarEmoji: '👧🏻',
  },
  {
    id: 'EST-103',
    name: 'Lucas M.',
    grade: '8°',
    vereda: 'Vereda San Isidro',
    avatarEmoji: '👦🏾',
  },
  {
    id: 'EST-104',
    name: 'Ana P.',
    grade: '8°',
    vereda: 'Vereda El Mirador',
    avatarEmoji: '👧🏽',
  },
  {
    id: 'EST-105',
    name: 'Diego T.',
    grade: '7°',
    vereda: 'Vereda Alto Bonito',
    avatarEmoji: '👦🏻',
  },
  {
    id: 'EST-106',
    name: 'Clara G.',
    grade: '9°',
    vereda: 'Vereda El Roblal',
    avatarEmoji: '👧🏾',
  },
];

/**
 * Nómina semilla de maestros rurales (incluye a la Profe Elena de design/style-mockups.jpeg).
 */
export const INITIAL_TEACHERS_ROSTER: TeacherProfile[] = [
  {
    id: 'DOC-01',
    name: 'Elena Vargas',
    specialty: 'Matemáticas y Estadística',
    ruralSchool: 'I.E.R. El Roblal - Sede Principal',
    avatarEmoji: '👩‍🏫',
    isActive: true,
  },
  {
    id: 'DOC-02',
    name: 'Carlos Trujillo',
    specialty: 'Química y Ciencias Naturales',
    ruralSchool: 'I.E.R. La Esperanza',
    avatarEmoji: '👨‍🔬',
    isActive: false,
  },
  {
    id: 'DOC-03',
    name: 'Diana Ortiz',
    specialty: 'Español e Inglés Rural',
    ruralSchool: 'I.E.R. San Isidro',
    avatarEmoji: '👩‍💼',
    isActive: false,
  },
];

/**
 * Catálogo de Misiones Gamificadas (4 opciones A, B, C, D por pregunta como en design/mockups.jpeg).
 */
export const RURAL_MISSIONS_CATALOG: LearningMission[] = [
  {
    id: 'MIS-MAT-01',
    title: 'Misión de Matemáticas',
    subject: 'Matemáticas',
    grade: '9°',
    estimatedMinutes: 5,
    iconEmoji: '📐',
    cardAccentColor: '#FBC02D',
    competencyStandard:
      'MEN Pensamiento Métrico y Numérico: Resuelvo problemas de áreas de cultivo, proporciones y fracciones.',
    questions: [
      {
        id: 'Q1',
        prompt:
          'Una parcela rectangular de plátano mide 25 metros de largo por 12 metros de ancho. ¿Cuál es el área total cultivada en metros cuadrados?',
        contextHint: 'Multiplica la longitud de la base por el ancho del terreno.',
        options: [
          { id: 'A', text: '250 m²' },
          { id: 'B', text: '300 m²' },
          { id: 'C', text: '37 m²' },
          { id: 'D', text: '74 m²' },
        ],
        correctOptionId: 'B',
        pedagogicalExplanation:
          '¡Correcto! El área de un rectángulo es Base × Altura: 25 m × 12 m = 300 m².',
      },
      {
        id: 'Q2',
        prompt:
          'Si para abonar 10 plantas de café se necesitan 2.5 kg de compost orgánico, ¿cuántos kilogramos se requieren para 40 plantas?',
        contextHint: 'Observa que 40 plantas es 4 veces la cantidad inicial.',
        options: [
          { id: 'A', text: '7.5 kg de compost' },
          { id: 'B', text: '10.0 kg de compost' },
          { id: 'C', text: '12.5 kg de compost' },
          { id: 'D', text: '15.0 kg de compost' },
        ],
        correctOptionId: 'B',
        pedagogicalExplanation:
          '¡Muy bien! Por regla de tres directa: (40 × 2.5) / 10 = 10 kg de compost.',
      },
      {
        id: 'Q3',
        prompt:
          'Un tanque comunitario de agua tiene capacidad de 1,200 litros y se encuentra lleno en sus 3/4 partes. ¿Cuántos litros de agua contiene?',
        contextHint: 'Divide 1,200 entre 4 y multiplica el resultado por 3.',
        options: [
          { id: 'A', text: '600 litros' },
          { id: 'B', text: '800 litros' },
          { id: 'C', text: '900 litros' },
          { id: 'D', text: '1,000 litros' },
        ],
        correctOptionId: 'C',
        pedagogicalExplanation:
          '¡Exacto! 1,200 / 4 = 300 litros por cuarto; 300 × 3 = 900 litros disponibles.',
      },
    ],
  },
  {
    id: 'MIS-ESP-02',
    title: 'Misión de Español',
    subject: 'Español',
    grade: '8°',
    estimatedMinutes: 5,
    iconEmoji: '📖',
    cardAccentColor: '#38BDF8',
    competencyStandard:
      'MEN Comprensión e Interpretación Textual: Identifico estructura narrativa, conectores lógicos y tradición oral.',
    questions: [
      {
        id: 'Q1',
        prompt:
          'En la oración: «Los campesinos protegieron la quebrada; POR CONSIGUIENTE, el agua siguió llegando limpia a la escuela», ¿qué función cumple el conector destacado?',
        contextHint: 'Indica el efecto o resultado de cuidar la quebrada.',
        options: [
          { id: 'A', text: 'Oposición o contraste' },
          { id: 'B', text: 'Causa o consecuencia' },
          { id: 'C', text: 'Enumeración temporal' },
          { id: 'D', text: 'Duda o hipótesis' },
        ],
        correctOptionId: 'B',
        pedagogicalExplanation:
          '¡Excelente! "Por consiguiente" es un conector consecutivo que introduce el efecto de la acción anterior.',
      },
      {
        id: 'Q2',
        prompt:
          'Las coplas, leyendas y relatos que los abuelos de la vereda transmiten de generación en generación pertenecen principalmente a:',
        contextHint: 'Se conserva a través de la voz y la memoria colectiva.',
        options: [
          { id: 'A', text: 'La tradición oral y cultural de la comunidad' },
          { id: 'B', text: 'El género periodístico informativo' },
          { id: 'C', text: 'Los textos científicos experimentales' },
          { id: 'D', text: 'Los manuales técnicos industriales' },
        ],
        correctOptionId: 'A',
        pedagogicalExplanation:
          '¡Correcto! La tradición oral preserva la identidad y saberes de las comunidades rurales.',
      },
      {
        id: 'Q3',
        prompt:
          '¿Cuál de las siguientes palabras lleva tilde por ser ESDRÚJULA?',
        contextHint: 'Las palabras esdrújulas llevan el acento en la antepenúltima sílaba.',
        options: [
          { id: 'A', text: 'Cafetal' },
          { id: 'B', text: 'Sembrío' },
          { id: 'C', text: 'Páramo' },
          { id: 'D', text: 'Cosechar' },
        ],
        correctOptionId: 'C',
        pedagogicalExplanation:
          '¡Así es! Pá-ra-mo tiene el acento en la antepenúltima sílaba (Pá), por lo que es esdrújula.',
      },
    ],
  },
  {
    id: 'MIS-ING-03',
    title: 'Misión de Inglés',
    subject: 'Inglés',
    grade: '9°',
    estimatedMinutes: 5,
    iconEmoji: '🌍',
    cardAccentColor: '#A78BFA',
    competencyStandard:
      'MEN Inglés (MCER A2): Comprendo vocabulario sobre medio ambiente, agricultura sostenible y expresiones cotidianas.',
    questions: [
      {
        id: 'Q1',
        prompt:
          'Choose the correct word to complete the sentence: "The farmers ______ fresh coffee every morning in the mountains."',
        contextHint: '"The farmers" es plural (they) en presente simple.',
        options: [
          { id: 'A', text: 'harvest' },
          { id: 'B', text: 'harvesting' },
          { id: 'C', text: 'harvested tomorrow' },
          { id: 'D', text: 'is harvest' },
        ],
        correctOptionId: 'A',
        pedagogicalExplanation:
          '¡Muy bien! Con sujeto plural ("The farmers") en Present Simple se usa el verbo base: "harvest" (cosechar).',
      },
      {
        id: 'Q2',
        prompt:
          'What is the meaning of the environmental phrase: "Protect the clean water of the river"?',
        contextHint: '"Clean water" significa agua limpia y "river" significa río.',
        options: [
          { id: 'A', text: 'Contaminar el agua del lago' },
          { id: 'B', text: 'Proteger el agua limpia del río' },
          { id: 'C', text: 'Cortar los árboles del bosque' },
          { id: 'D', text: 'Vender las frutas en el mercado' },
        ],
        correctOptionId: 'B',
        pedagogicalExplanation:
          '¡Exacto! "Protect" = proteger, "clean water" = agua limpia, "river" = río.',
      },
      {
        id: 'Q3',
        prompt:
          'A tourist visits the rural school and asks: "Where is the organic garden?" Which is the best answer?',
        contextHint: '"Where" pregunta por una ubicación o lugar.',
        options: [
          { id: 'A', text: 'It is behind the main classroom.' },
          { id: 'B', text: 'At seven o’clock in the morning.' },
          { id: 'C', text: 'Yes, I like apples very much.' },
          { id: 'D', text: 'My name is Mateo.' },
        ],
        correctOptionId: 'A',
        pedagogicalExplanation:
          '¡Correcto! "It is behind the main classroom" (Está detrás del salón principal) responde la ubicación.',
      },
    ],
  },
  {
    id: 'MIS-QUI-04',
    title: 'Misión de Química',
    subject: 'Química',
    grade: '9°',
    estimatedMinutes: 5,
    iconEmoji: '🧪',
    cardAccentColor: '#34D399',
    competencyStandard:
      'MEN Entorno Físico y Químico: Relaciono acidez (pH) del suelo agrícola, ciclos biogeoquímicos y mezclas.',
    questions: [
      {
        id: 'Q1',
        prompt:
          'Al medir el suelo de la huerta escolar con tiras indicadoras se obtiene un pH de 5.2. En la escala química de pH (0 a 14), este suelo se clasifica como:',
        contextHint: 'Un pH menor a 7 es ácido, igual a 7 es neutro y mayor a 7 es básico/alcalino.',
        options: [
          { id: 'A', text: 'Ligeramente ácido (ideal para café y mora)' },
          { id: 'B', text: 'Altamente alcalino o básico' },
          { id: 'C', text: 'Completamente neutro (pH 7.0)' },
          { id: 'D', text: 'Un gas noble inerte' },
        ],
        correctOptionId: 'A',
        pedagogicalExplanation:
          '¡Excelente! Un pH de 5.2 es ligeramente ácido, condición típica de los suelos volcánicos cafeteros de Colombia.',
      },
      {
        id: 'Q2',
        prompt:
          '¿Cuál es el símbolo químico del NITRÓGENO, elemento esencial que las plantas leguminosas (como el fríjol) fijan en el suelo?',
        contextHint: 'Revisa la tabla periódica: es la primera letra de su nombre.',
        options: [
          { id: 'A', text: 'Na (Sodio)' },
          { id: 'B', text: 'Ni (Níquel)' },
          { id: 'C', text: 'N (Nitrógeno)' },
          { id: 'D', text: 'K (Potasio)' },
        ],
        correctOptionId: 'C',
        pedagogicalExplanation:
          '¡Correcto! El símbolo del Nitrógeno es N (número atómico 7), fundamental en los fertilizantes NPK.',
      },
      {
        id: 'Q3',
        prompt:
          'Cuando filtramos agua de quebrada usando capas de grava, arena fina y carbón activado para retener partículas sólidas, aplicamos un método de:',
        contextHint: 'Separa sólidos insolubles suspendidos en un líquido.',
        options: [
          { id: 'A', text: 'Separación física de mezclas por filtración' },
          { id: 'B', text: 'Fusión nuclear de átomos' },
          { id: 'C', text: 'Combustión completa de hidrocarburos' },
          { id: 'D', text: 'Sublimación regresiva de metales' },
        ],
        correctOptionId: 'A',
        pedagogicalExplanation:
          '¡Así es! La filtración por lecho poroso retiene sólidos en suspensión sin alterar la fórmula del agua (H₂O).',
      },
    ],
  },
  {
    id: 'MIS-EST-05',
    title: 'Misión de Estadística Rural',
    subject: 'Estadística Rural',
    grade: '9°',
    estimatedMinutes: 5,
    iconEmoji: '📊',
    cardAccentColor: '#F97316',
    competencyStandard:
      'MEN Pensamiento Aleatorio: Interpreto media, mediana y moda en datos de producción agrícola veredal.',
    questions: [
      {
        id: 'Q1',
        prompt:
          'En la finca escolar se recolectaron 5 canastos de café con pesos de: 12 kg, 15 kg, 12 kg, 18 kg y 13 kg. ¿Cuál es el peso promedio (media aritmética)?',
        contextHint: 'Suma los 5 pesos (70 kg) y divide entre 5 canastos.',
        options: [
          { id: 'A', text: '12 kg' },
          { id: 'B', text: '14 kg' },
          { id: 'C', text: '15 kg' },
          { id: 'D', text: '18 kg' },
        ],
        correctOptionId: 'B',
        pedagogicalExplanation:
          '¡Exacto! (12 + 15 + 12 + 18 + 13) / 5 = 70 / 5 = 14 kg por canasto.',
      },
      {
        id: 'Q2',
        prompt:
          'Con los mismos datos (12 kg, 15 kg, 12 kg, 18 kg y 13 kg), ¿cuál es la MODA de la cosecha?',
        contextHint: 'Es el valor que se repite con mayor frecuencia.',
        options: [
          { id: 'A', text: '12 kg' },
          { id: 'B', text: '13 kg' },
          { id: 'C', text: '15 kg' },
          { id: 'D', text: '18 kg' },
        ],
        correctOptionId: 'A',
        pedagogicalExplanation:
          '¡Muy bien! 12 kg aparece dos veces en el registro de recolección.',
      },
      {
        id: 'Q3',
        prompt:
          'De 200 semillas de maíz criollo sembradas germinaron 170 plántulas. ¿Cuál es el porcentaje de germinación?',
        contextHint: 'Calcula (170 / 200) × 100.',
        options: [
          { id: 'A', text: '70%' },
          { id: 'B', text: '80%' },
          { id: 'C', text: '85%' },
          { id: 'D', text: '95%' },
        ],
        correctOptionId: 'C',
        pedagogicalExplanation:
          '¡Correcto! 170 de 200 equivale al 85% de éxito en germinación.',
      },
    ],
  },
];
