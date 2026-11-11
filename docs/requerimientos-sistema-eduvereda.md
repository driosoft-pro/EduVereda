# Especificación de Requerimientos del Sistema: EduVereda

## 1. Visión General del Sistema
El sistema **EduVereda** es un ecosistema tecnológico y pedagógico de innovación frugal concebido para superar la brecha digital en las escuelas rurales de Colombia. Compuesto por **EduVereda App** (módulo interactivo para estudiantes) y **EduVereda Docente / VeredaSync** (módulo de evaluación asincrónica y consolidación de notas), el sistema opera bajo una arquitectura *Offline-First* que no requiere conexión a internet, paquetes de datos móviles ni servidores en la nube.

Para garantizar portabilidad real en dispositivos móviles rurales y facilidad de validación, el sistema se construye como una **aplicación multiplataforma en React Native (con Expo y React Native Web)**. En su primera fase se despliega como una **Demo Web interactiva** ejecutada sobre el mismo framework y código base, permitiendo su prueba inmediata en navegador antes del empaquetado nativo (Android/iOS), gestionando todo el entorno de desarrollo de forma reproducible mediante **Nix (`flake.nix`)**.

---

## 2. Módulo A — Requerimientos Funcionales del Estudiante (EduVereda App)

### 2.1 Carga y Persistencia Local
* **RF-E01 (Carga Instantánea Offline Multiplataforma):** La aplicación debe compilarse desde una base de código única en **React Native** hacia Web (PWA/SPA mediante `react-native-web`) y dispositivos móviles nativos (Android), manteniendo un peso ultra ligero (menor a 15 MB) capaz de ejecutarse al 100% de manera local en dispositivos de gama baja y compartidos.
* **RF-E02 (Banner de Estado y Alto Contraste):** La interfaz principal debe incluir un banner permanente en la parte superior en color azul marino (`#1B365D`) con el texto explícito **«Progreso Seguro en SQLite»**, diseñado para garantizar legibilidad bajo luz solar directa en entornos abiertos.

### 2.2 Misiones y Gamificación (Cultura Snack)
* **RF-E03 (Cápsulas de Microaprendizaje):** La app ofrecerá misiones gamificadas de 5 minutos (*Cultura Snack*) en áreas fundamentales del conocimiento, alineadas con los Estándares Básicos de Competencias del Ministerio de Educación Nacional.
* **RF-E04 (Almacenamiento Local Transaccional):** Cada respuesta y puntaje obtenido se guardará en la base de datos relacional embebida **SQLite** (`expo-sqlite` con soporte WebAssembly/`IndexedDB` o `AsyncStorage` en la demo web de React Native), garantizando la persistencia de datos ante apagados repentinos del dispositivo.

### 2.3 Sincronización Óptica
* **RF-E05 (Tarjeta de Logro):** Al culminar la misión, la pantalla mostrará la tarjeta destacada **«¡Misión Cumplida! - Progreso Seguro en Memoria»**.
* **RF-E06 (Generación de QR Dinámico):** La interfaz dispondrá de un botón ampliado de 60 píxeles de alto (`Pressable` / `TouchableOpacity`) en color verde manzana (`#7CB342`) con la instrucción explícita **«Toca aquí para mostrar a tu profe»**. Al presionar este botón, la app comprimirá el registro académico (ID estudiante, grado, materia, calificación, fecha y firma digital de integridad) en un Código QR dinámico de alta densidad renderizado con `react-native-qrcode-svg`.

---

## 3. Módulo B — Requerimientos Funcionales de la Docente (EduVereda Docente / VeredaSync)

### 3.1 Captura y Lectura Óptica
* **RF-D01 (Visor de Escaneo Óptico):** La aplicación de la docente accederá a la cámara del dispositivo (tableta, smartphone o webcam en la demo web mediante `expo-camera` / `html5-qrcode`) desplegando un marco de enfoque para la lectura visual de Códigos QR.
* **RF-D02 (Decodificación Asincrónica Veloz):** La app debe decodificar el Código QR dinámico en un tiempo promedio menor a **1.8 a 2.4 segundos**, sin emitir tráfico de red ni requerir conectividad 3G/4G o Wi-Fi.

### 3.2 Retroalimentación Multisensorial en Aula
* **RF-D03 (Confirmación Auditiva y Háptica):** Al decodificar correctamente la nota del estudiante, el dispositivo debe activar de forma simultánea tres respuestas multiplataforma:
  1. Notificación visual verde en pantalla (*"Nota de Mateo registrada"*).
  2. Alerta auditiva de tono claro (**«¡Pip!»** mediante `expo-audio` / `expo-av` y síntesis por Web Audio API en navegador).
  3. Vibración háptica activa (`expo-haptics` / `Vibration.vibrate()` en React Native y `navigator.vibrate()` en Web), permitiendo a la docente evaluar a sus 25 alumnos en un aula multigrado ruidosa sin necesidad de mirar fijamente la pantalla en cada captura.

### 3.3 Gestión de Calificaciones y Toma de Asistencia Local
* **RF-D04 (Consolidado Automático del Aula):** Las notas capturadas se registrarán automáticamente en una tabla local estructurada (`FlatList` / tabla responsiva en SQLite) con las columnas: *Nombre del Alumno*, *Grado*, *Materia*, *Calificación (%)* y *Fecha/Hora*.
* **RF-D05 (Exportación Local):** Permitir la exportación del registro acumulado a archivos de datos abiertos (CSV o JSON) almacenados en la memoria del dispositivo (`expo-file-system` + `expo-sharing` en nativo, o descarga directa de `Blob` en React Native Web) para su posterior integración con los sistemas oficiales del colegio.
* **RF-D06 (Toma de Asistencia Escolar Híbrida QR + Manual):** Al escanear el Código QR de un estudiante, el sistema lo marcará automáticamente como **PRESENTE (`QR_OPTICO`)** en la planilla del día. Adicionalmente, la docente dispondrá de una pestaña de **Toma de Asistencia** para marcar manualmente **Presente (✅)**, **Tardanza (🕒)** o **Ausente (❌)** a cada alumno o a todo el salón con un solo toque.

---

## 3B. Módulo Administrativo — Rol Administrador y Gestión CRUD (Offline-First)

* **RF-A01 (CRUD Completo de Estudiantes en SQLite):** El rol **Administrador (`ADMIN`)** permitirá Crear, Listar, Editar/Actualizar y Eliminar perfiles de estudiantes rurales (*ID, Nombre, Grado, Vereda y Avatar*) persistidos localmente en la tabla `students_roster`.
* **RF-A02 (CRUD Completo de Maestros en SQLite):** El rol **Administrador (`ADMIN`)** permitirá Crear, Listar, Editar/Actualizar, Asignar como Docente Titular en la Tableta y Eliminar perfiles de docentes (*ID, Nombre, Especialidad/Materias, Sede Rural y Avatar*) en la tabla `teachers_roster`.
* **RF-A03 (Catálogo de Materias Básicas MEN):** El sistema debe incluir cápsulas gamificadas de 4 opciones (`A`, `B`, `C`, `D`) para las materias fundamentales: **Matemáticas**, **Español**, **Inglés**, **Química** y **Estadística Rural**.

---

## 4. Módulo C — Requerimientos No Funcionales (RNF)

| Código | Categoría | Descripción del Requerimiento |
| :--- | :--- | :--- |
| **RNF-01** | **Arquitectura** | 100% *Offline-First*, desacoplada de servidores en la nube y redes externas. |
| **RNF-02** | **Multiplataforma** | Código base único en **React Native + Expo** con soporte para **Demo Web (`react-native-web`)** y compilación nativa a Android/iOS. |
| **RNF-03** | **Rendimiento** | Peso total del empaquetado inferior a 15 MB para ejecución fluida en teléfonos de gama baja (1-2 GB RAM). |
| **RNF-04** | **Costo Operativo** | 0% consumo de datos móviles ($0 COP en recargas) y cero emisión de tráfico de red. |
| **RNF-05** | **Usabilidad (SUS)** | Puntaje en la Escala de Usabilidad del Sistema mayor a 88.5/100, con acceso en menos de 3 toques/clics promedio. |
| **RNF-06** | **Accesibilidad** | Interfaces con contraste de color superior (WCAG AAA) legibles bajo luz solar y adaptadas a estudiantes de 14 años y docentes. |
| **RNF-07** | **Privacidad y Ética** | Almacenamiento local de datos sin rastreo ni transmisión a servidores comerciales de terceros. |
| **RNF-08** | **Reproducibilidad** | Entorno de construcción y dependencias declarativas gestionadas mediante **Nix Flakes (`flake.nix`)**. |

---

## 5. Módulo D — Stack Tecnológico Multiplataforma (React Native + Web)

Para cumplir con la naturaleza multiplataforma comenzando por un prototipo funcional en la web y escalando sin reescritura a dispositivos móviles rurales, se define el siguiente stack tecnológico:

### 5.1 Tecnologías Principales
| Capa | Tecnología / Librería | Rol en la Demo Web (`react-native-web`) | Rol en App Nativa (Android / iOS) |
| :--- | :--- | :--- | :--- |
| **Core & UI** | **React Native + Expo SDK** | Renderizado de componentes nativos (`View`, `Text`, `Pressable`) a DOM/HTML5 semántico. | Renderizado nativo de alto rendimiento en Android/iOS. |
| **Lenguaje** | **TypeScript** | Tipado estático para el contrato del payload QR, modelos SQLite y estados de misión. | Prevención de errores en tiempo de compilación. |
| **Motor Web** | **`react-native-web` + Metro** | Compilador y bundler SPA/PWA para ejecutar la demo directamente en el navegador. | N/A (usa Metro Bundler + Hermes Engine). |
| **Persistencia** | **`expo-sqlite` / `AsyncStorage`** | Almacenamiento transaccional local vía WebAssembly (`wa-sqlite`) e `IndexedDB`. | Base de datos SQLite embebida en el sistema de archivos nativo. |
| **Generador QR** | **`react-native-qrcode-svg` + `react-native-svg`** | Renderizado vectorial SVG de alta nitidez en pantalla para lectura óptica. | Renderizado SVG nativo sin pérdida de resolución. |
| **Lector QR** | **`expo-camera` / `html5-qrcode`** | Acceso a cámara web (`MediaDevices.getUserMedia`) + decodificación en worker local. | Escaneo nativo acelerado por hardware de cámara. |
| **Audio y Háptica** | **`expo-audio` + `expo-haptics`** | Síntesis del tono *«¡Pip!»* con Web Audio API y vibración con `navigator.vibrate(200)`. | APIs nativas de sonido de baja latencia y motor háptico. |
| **Seguridad & Cripto** | **`expo-crypto` + `expo-secure-store`** | Firma HMAC-SHA256 vía `SubtleCrypto` (Web Crypto API) y almacenamiento aislado por origen. | Criptografía nativa y bóveda segura del sistema (Keystore / Keychain). |
| **Exportación** | **`expo-file-system` + `expo-sharing`** | Generación de archivo descargable `.csv` / `.json` sanitizado en el navegador. | Guardado en almacenamiento interno y hoja de compartir nativa. |
| **Gestor Paquetes** | **`pnpm` (con `node-linker=hoisted`)** | Resolución determinista y rápida compatible con Metro Bundler y `react-native-web`. | Gestión eficiente del árbol `node_modules` para compilación nativa. |

### 5.2 Formato del Payload del Código QR y Esquemas de Seguridad Offline
El código QR generado por **EduVereda App** y leído por **EduVereda Docente** codifica un objeto JSON compacto firmado criptográficamente de manera local para minimizar la densidad de módulos del QR, acelerar el escaneo (< 2 segundos) y blindar la integridad académica:

```json
{
  "v": 1,
  "tx": "e8b2-91c4",
  "id": "EST-104",
  "n": "Mateo Gómez",
  "g": "9°",
  "m": "Estadística Rural",
  "s": 100,
  "ts": 1762840800,
  "sig": "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
}
```
* `v`: Versión del protocolo VeredaSync (`1`).
* `tx`: Identificador único de transacción (*nonce* aleatorio generado con `expo-crypto`) para protección *Anti-Replay*.
* `id`: Identificador local del estudiante.
* `n`: Nombre o alias escolar del estudiante.
* `g`: Grado escolar.
* `m`: Materia o cápsula de microaprendizaje evaluada.
* `s`: Calificación porcentual obtenida (`0` a `100`).
* `ts`: Marca de tiempo Unix (segundos).
* `sig`: Firma criptográfica **HMAC-SHA256** calculada sobre la cadena canónica `v|tx|id|n|g|m|s|ts`.

### 5.3 Esquemas de Seguridad del Sistema (Seguridad por Diseño)
1. **Integridad y Autenticidad Criptográfica Offline (HMAC-SHA256):**
   - Cada cápsula completada se firma localmente utilizando `expo-crypto` (y `crypto.subtle` en la Demo Web) con una llave simétrica de aula provisionada en `expo-secure-store`.
   - Si un estudiante intenta modificar manualmente el contenido del QR (por ejemplo, alterar `"s": 60` a `"s": 100`), la verificación de firma en **EduVereda Docente** fallará inmediatamente y mostrará una alerta de registro inválido.
2. **Prevención de Ataques de Repetición (*Anti-Replay*):**
   - La tabla SQLite de la docente define el campo `tx` (y `sig`) con restricción `UNIQUE PRIMARY KEY`. Si un código QR intenta escanearse más de una vez o compartirse mediante captura de pantalla con otro compañero, el motor SQLite rechaza el duplicado e informa a la docente que esa misión ya fue registrada.
3. **Validación Estricta de Entrada y Sanitización (*Zero-Trust* en Lectura Óptica):**
   - El lector óptico valida el esquema JSON antes de procesarlo: tipos estrictos en TypeScript, rango de calificación `0 <= s <= 100`, longitud máxima de cadenas y ventana temporal razonable (`ts`).
   - **Prevención de Inyección SQL:** Todas las operaciones en `expo-sqlite` utilizan sentencias preparadas parametrizadas (`?`).
   - **Prevención de Inyección de Fórmulas CSV (*CSV Injection*):** Al exportar el consolidado para Excel/sistemas escolares, el módulo `exportCsv.ts` neutraliza cualquier celda que comience con caracteres ejecutables (`=`, `+`, `-`, `@`, `\t`, `\r`).
4. **Privacidad de Menores (Ley 1581 de 2012 / Habeas Data) y Aislamiento de Red:**
   - Cero telemetría y cero tráfico saliente (`EXPO_NO_TELEMETRY=1`).
   - En la Demo Web se aplica una cabecera / metaetiqueta **Content Security Policy (CSP)** estricta (`default-src 'self'; connect-src 'self'; img-src 'self' data: blob:; media-src 'self' blob:;`) que bloquea a nivel de navegador cualquier filtración de datos hacia servidores externos.
5. **Seguridad en la Cadena de Suministro (`pnpm` + Nix):**
   - Dependencias fijadas mediante `flake.lock` (entorno del sistema) y `pnpm-lock.yaml` (paquetes JS/TS), con configuración `.npmrc` auditada.

---

## 6. Módulo E — Arquitectura de la Demo Web en React Native

### 6.1 Estructura de Vista Doble (Split-Screen) y Diseño Adaptativo
Gracias a los hooks `useWindowDimensions` de React Native, la aplicación detecta el tamaño de pantalla:
* **Modo Demo Web en Escritorio (Split-Screen):** Muestra en paralelo los dos dispositivos simulados en una sola pantalla para demostrar el flujo completo extremo a extremo ante evaluadores.
* **Modo Dispositivo Móvil / Tableta:** Permite alternar mediante una barra superior entre el rol **«Vista Estudiante»** y **«Vista Docente»**.

1. **Simulador Estudiante (EduVereda App):**
   - Contenedor con marco de teléfono móvil y el banner superior `#1B365D` con texto blanco de alto contraste **«Progreso Seguro en SQLite»**.
   - Cápsula interactiva de 3 preguntas de opción múltiple con barra de avance, retroalimentación inmediata y guardado automático transaccional en SQLite/almacenamiento local.
   - Pantalla de logro **«¡Misión Cumplida! - Progreso Seguro en Memoria»** y botón verde manzana (`#7CB342`) de `minHeight: 60` píxeles con el texto **«Toca aquí para mostrar a tu profe»**.
   - Generación dinámica del Código QR firmado con `react-native-qrcode-svg` al presionar el botón, incluyendo además en la demo web un botón auxiliar de *"Simular acercamiento del teléfono a la cámara docente"* para pruebas sin cámara física adicional.

2. **Simulador Docente (EduVereda Docente / VeredaSync):**
   - Contenedor con marco de tableta escolar y visor de cámara en vivo (`expo-camera` / lector QR web) con guía visual de encuadre.
   - Al detectar el QR (por cámara real o por el puente de simulación en la demo), verifica la firma criptográfica `sig` y el `nonce` `tx` anti-replay, y dispara simultáneamente:
     1. Banner verde de confirmación: *"Nota de [Nombre] registrada (Firma verificada)"*.
     2. Tono agudo **«¡Pip!»** (880 Hz durante 180 ms).
     3. Pulso de vibración (`200 ms`).
   - Actualización en tiempo real del consolidado de calificaciones del grupo en SQLite local y botones para exportar de forma segura a **CSV** y **JSON**.

### 6.2 Estructura de Directorios del Proyecto (Clean Architecture)
El proyecto sigue los principios de **Clean Architecture**, separando estrictamente las entidades y contratos de negocio (`domain`), los casos de uso (`application`), las implementaciones técnicas (`infrastructure`) y la interfaz de usuario (`presentation`), manteniendo archivos modulares (< 350 líneas por archivo):

```text
demo/
├── flake.nix                         # Entorno reproducible Nix (Node.js 22, pnpm, SQLite, Watchman)
├── .npmrc                            # Ajuste de pnpm (node-linker=hoisted) y seguridad para Expo/RN
├── .envrc                            # Carga automática del flake con direnv
├── .gitignore                        # Exclusión de artefactos de compilación y cachés locales
├── README.md                         # Documentación técnica, Clean Architecture, roles y ejecución
├── app.json                          # Configuración multiplataforma de Expo (Web, Android, iOS)
├── package.json                      # Scripts con pnpm y dependencias de React Native + Web
├── pnpm-lock.yaml                    # Lockfile determinista de paquetes
├── tsconfig.json                     # Configuración estricta de TypeScript (strict: true)
├── index.ts                          # Registro raíz del componente en Expo
├── App.tsx                           # Proveedor de dependencias (DI) y contenedor raíz
└── src/
    ├── domain/                       # CAPA DE DOMINIO (Entidades puras e Interfaces/Contratos)
    │   ├── entities/
    │   │   ├── Role.ts               # Roles (SPLIT_DEMO, STUDENT, TEACHER) y permisos RBAC
    │   │   ├── StudentMission.ts     # Entidades de Misión ("Cultura Snack") y Progreso SQLite
    │   │   └── GradeRecord.ts        # Contrato QR VeredaSync v1 y Registro de Calificaciones
    │   ├── repositories/
    │   │   ├── IStudentRepository.ts # Contrato de persistencia local del estudiante
    │   │   └── ITeacherRepository.ts # Contrato de persistencia docente y control Anti-Replay
    │   └── services/
    │       ├── ISecurityService.ts   # Contrato de firma HMAC-SHA256, nonces y sanitización CSV
    │       ├── IFeedbackService.ts   # Contrato de alerta auditiva («¡Pip!») y vibración
    │       └── IExportService.ts     # Contrato de exportación local a CSV y JSON
    ├── application/                  # CAPA DE APLICACIÓN (Casos de Uso y Catálogo Pedagógico)
    │   ├── data/
    │   │   └── ruralMissionsCatalog.ts # Cápsulas MEN de 5 min y nómina de aula multigrado
    │   └── useCases/
    │       ├── CompleteMissionStepUseCase.ts   # Guardado transaccional de respuestas (RF-E04)
    │       ├── GenerateSignedQrUseCase.ts      # Generación y firma HMAC del QR (RF-E06)
    │       ├── ProcessScannedQrUseCase.ts      # Validación QR, Anti-Replay y alerta (RF-D01..04)
    │       └── ExportClassroomGradesUseCase.ts # Exportación segura de notas (RF-D05)
    ├── infrastructure/               # CAPA DE INFRAESTRUCTURA (Implementaciones Multiplataforma)
    │   ├── database/
    │   │   └── sqliteEngine.ts       # Motor transaccional local y bitácora SQL parametrizada
    │   ├── repositories/
    │   │   ├── SqliteStudentRepository.ts # Persistencia SQLite del estudiante
    │   │   └── SqliteTeacherRepository.ts # Persistencia SQLite docente con UNIQUE Anti-Replay
    │   ├── security/
    │   │   └── HmacSecurityService.ts     # Firma HMAC-SHA256 (expo-crypto) y sanitización CSV
    │   ├── feedback/
    │   │   └── MultisensoryFeedbackService.ts # Síntesis Web Audio API (880Hz) + expo-haptics
    │   └── export/
    │       └── LocalFileExportService.ts  # Descarga local de CSV/JSON (Blob Web y FileSystem)
    └── presentation/                 # CAPA DE PRESENTACIÓN (UI Accesible WCAG AAA en React Native)
        ├── theme/
        │   └── colors.ts             # Paleta solar (#1B365D azul marino, #7CB342 verde manzana)
        ├── context/
        │   └── AppContainerContext.tsx # Contenedor de Inyección de Dependencias y Estado Global
        ├── components/
        │   ├── common/
        │   │   ├── SolarBanner.tsx         # Banner permanente RF-E02 «Progreso Seguro en SQLite»
        │   │   └── RoleSwitcherBar.tsx     # Conmutador de Roles (Vista Doble, Estudiante, Docente)
        │   ├── student/
        │   │   ├── MissionQuestionCard.tsx # Preguntas interactivas y barra de progreso (RF-E03)
        │   │   └── AchievementQrCard.tsx   # Tarjeta de logro y botón 60px #7CB342 (RF-E05, RF-E06)
        │   └── teacher/
        │       ├── OpticalScannerCard.tsx   # Visor de cámara QR, latencia <1.8s y alerta (RF-D01..03)
        │       └── ClassroomGradesTable.tsx # Tabla consolidada, exportación y consola SQL (RF-D04..05)
        └── screens/
            ├── StudentScreen.tsx     # Simulador Estudiante en marco de smartphone
            ├── TeacherScreen.tsx     # Simulador Docente en marco de tableta escolar
            └── MainDemoScreen.tsx    # Layout adaptativo Split-Screen / Rol Individual
```

---

## 7. Módulo F — Entorno de Desarrollo Reproducible con Nix (`flake.nix`) y `pnpm`

Para garantizar que cualquier desarrollador o evaluador pueda ejecutar la demo web en React Native y compilar la aplicación usando exclusivamente **`pnpm`** sin conflictos de versiones ni fugas de telemetría, el proyecto utiliza **Nix Flakes** junto con una configuración `.npmrc` adaptada a Metro Bundler.

### 7.1 Configuración `.npmrc` para React Native + `pnpm`
Dado que Metro Bundler en React Native / Expo requiere una estructura plana de `node_modules` para resolver módulos nativos y de `react-native-web`, el proyecto incluye el archivo `.npmrc` preconfigurado:

```ini
node-linker=hoisted
strict-peer-dependencies=false
auto-install-peers=true
ignore-scripts=false
```

### 7.2 Archivo `flake.nix` del Proyecto

```nix
{
  description = "EduVereda - Entorno seguro y reproducible (React Native + Expo Web + pnpm)";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };
      in
      {
        devShells.default = pkgs.mkShell {
          name = "eduvereda-react-native-env";

          buildInputs = with pkgs; [
            # Runtime y gestor de paquetes exclusivo (pnpm) para React Native / Expo
            nodejs_22
            pnpm
            typescript
            typescript-language-server

            # Herramientas de monitoreo de archivos, base de datos local y criptografía
            watchman
            sqlite
            openssl

            # Utilidades de desarrollo y auditoría JSON
            git
            jq
          ];

          env = {
            # Privacidad y seguridad: desactiva telemetría externa y analíticas
            EXPO_NO_TELEMETRY = "1";
            DO_NOT_TRACK = "1";
            BROWSER = "none";
          };

          shellHook = ''
            # Asegura que .npmrc tenga node-linker=hoisted para compatibilidad de pnpm con Expo/Metro
            if [ ! -f .npmrc ]; then
              cat << 'EOF' > .npmrc
node-linker=hoisted
strict-peer-dependencies=false
auto-install-peers=true
EOF
            fi

            echo "======================================================================"
            echo "🌱 Entorno Seguro EduVereda (React Native + Expo Web + pnpm) activo"
            echo "======================================================================"
            echo "Node: $(node --version) | pnpm: $(pnpm --version) | SQLite: $(sqlite3 --version | cut -d' ' -f1)"
            echo "Seguridad: Telemetría desactivada (EXPO_NO_TELEMETRY=1, DO_NOT_TRACK=1)"
            echo ""
            echo "Comandos con pnpm para el proyecto:"
            echo "  • Instalar dependencias : pnpm install"
            echo "  • Iniciar Demo Web      : pnpm expo start --web"
            echo "  • Exportar PWA Offline  : pnpm expo export --platform web"
            echo "======================================================================"
          '';
        };
      }
    );
}
```

### 7.3 Comandos de Inicialización y Ejecución con `pnpm`

1. **Activar el entorno reproducible de Nix:**
   ```bash
   nix develop
   ```
   *(O automáticamente al entrar a la carpeta si tienes `direnv allow`).*

2. **Inicializar el proyecto React Native con `pnpm` (al comenzar el desarrollo):**
   ```bash
   pnpm dlx create-expo-app@latest . --template blank-typescript
   pnpm expo install react-native-web react-dom @expo/metro-runtime
   pnpm expo install expo-sqlite @react-native-async-storage/async-storage expo-crypto expo-secure-store react-native-svg react-native-qrcode-svg expo-camera expo-haptics expo-audio expo-file-system expo-sharing
   ```

3. **Ejecutar la Demo Web interactiva en desarrollo:**
   ```bash
   pnpm expo start --web
   ```

4. **Auditoría de seguridad y empaquetado estático ligero (< 15 MB) para despliegue Offline / PWA:**
   ```bash
   pnpm audit --prod
   pnpm expo export --platform web
   ```
