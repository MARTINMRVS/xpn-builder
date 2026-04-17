# DIAGNÓSTICO — XPN SOFTWARE
_Generado: 2026-03-27_

---

## ¿QUÉ HACE EL SOFTWARE?

**XPN Builder** (nombre comercial: **Pad Works XPN**) es una herramienta desktop para 
productores musicales que permite crear y exportar **expansion packs** compatibles con 
samplers MPC de Akai (MPC Live, MPC X, MPC One).

### Funcionalidades principales
- **128 pads** organizados en 8 bancos × 16 pads
- **5 modos de layout**: DRUM · BEAT · LIVE · H·HOP · ELEC
- **Modo CSTM** con editor drag & drop personalizable
- **Creador de nuevos tipos de slot** (+) con detección de sinónimos
- **Smart auto-assign**: asignación automática inteligente de samples
- **Pattern Editor**: secuenciador en tiempo real
- **Demo preview track**: carga de audio o auto-generación
- **Cadena de efectos** por pad (6 tipos de efectos)
- **Export .zip** en formato MPC-compatible
- **Suite de 64 tests integrados** (100% passing)
- Manual trilingüe incluido (ES / EN / FR)

### Producto comercial
- Se distribuye como app macOS universal (.dmg)
- Marca: Pad Works — distribuye en Gumroad
- Ya tiene assets de marketing (covers, logos, PDFs de estrategia de contenido)

---

## TECNOLOGÍAS Y LENGUAJES

| Capa | Tecnología |
|---|---|
| Lenguaje principal | JavaScript (Vanilla JS, sin frameworks) |
| UI/Estilos | HTML5 + CSS3 (CSS custom properties) |
| Desktop wrapper | **Electron** v33 |
| Empaquetado | **electron-builder** v25 |
| Compresión/ZIP | **JSZip** v3.10.1 (via CDN + local para tests) |
| Captura de pantalla | **html2canvas** v1.4.1 (CDN) |
| Testing | **Jest** v30 + **jest-environment-jsdom** |
| Fuentes | Google Fonts (IBM Plex Mono, IBM Plex Sans, Playfair Display, Bebas Neue, Pacifico) |
| Audio API | Web Audio API (mocked en tests) |
| Build target | macOS Universal (arm64 + x86_64) |

---

## ESTRUCTURA DE CARPETAS

```
xpnfull/
├── _context/                    ← (NUEVO) Documentación y contexto del proyecto
│   ├── REGLAS.md
│   ├── diagnostico_xpn.md
│   └── flujo_trabajo_xpn.md
│
├── XPN-Builder-V1-Final/        ← NÚCLEO DEL PROYECTO (app principal)
│   ├── mpc_expansion_builder.html  ← App completa (~425 KB, single-file)
│   ├── mpc_expansion_builder.html.bak  ← Backup de versión anterior
│   ├── xpn_manual_v1.html       ← Manual trilingüe de la app
│   ├── main.js                  ← Entrada Electron (BrowserWindow)
│   ├── package.json             ← Config del proyecto + build
│   ├── jest.config.js           ← Config de tests
│   ├── icon.png                 ← Ícono de la app
│   ├── README.txt               ← Instrucciones de uso básicas
│   ├── dist/                    ← Build compilado (macOS .dmg)
│   │   └── XPN Builder-1.0.0.dmg
│   ├── tests/
│   │   └── xpn.test.js          ← Test suite Jest (64 tests)
│   ├── versions/                ← Versiones anteriores (vacío actualmente)
│   └── node_modules/            ← Dependencias
│
├── LUNES 23 : PAD WORKS/        ← Assets de marketing
│   ├── PadWorks_ContentStrategy.pdf
│   ├── padworks_gumroad_cover.png
│   ├── padworks_logo_dark.png/.svg
│   ├── cover gunroad/
│   ├── files/ + files2/         ← Assets empaquetados
│   └── *.zip
│
├── versions/                    ← Checkpoints históricos
│   └── xpn_1240_checkpoint.html
│
├── xpn_manual_trilingual.html   ← Manual trilingüe (raíz, versión standalone)
└── XPN-Builder-V1-Final.zip     ← Zip del release final
```

---

## ESTADO ACTUAL (por módulo, escala 1–10)

| Módulo | Estado | Notas |
|---|---|---|
| **Core App (HTML single-file)** | 9/10 | Funcional, probado, 64/64 tests |
| **Electron wrapper** | 8/10 | Funcional, configuración mínima pero correcta |
| **Build / Distribución macOS** | 8/10 | .dmg universal generado correctamente |
| **Suite de tests** | 9/10 | 64/64 passing, bien estructurada |
| **Manual trilingüe** | 8/10 | ES/EN/FR, bien documentado |
| **Assets de marketing** | 7/10 | Covers y logos existen, estrategia documentada |
| **Organización del repo** | 5/10 | Carpetas con nombres irregulares, sin .gitignore |
| **Versioning / historial** | 4/10 | Solo un checkpoint, sin git visible |
| **Build para Windows/Linux** | 1/10 | No configurado (solo macOS) |
| **CI/CD** | 1/10 | No existe pipeline de automatización |

**Estado general del proyecto: 7/10** — App funcional y distribuible, con deuda técnica en organización y proceso.

---

## PROBLEMAS DETECTADOS

### 🔴 Críticos
1. **Monolito de ~425 KB en un solo .html** — toda la lógica, CSS y JS en un archivo. Difícil de mantener a medida que crece.
2. **Sin control de versiones (Git)** — no se detecta `.git` en la carpeta. El historial es solo archivos `.bak` y carpetas `versions/`.

### 🟡 Medios
3. **Dependencias externas via CDN** — JSZip y html2canvas se cargan desde CDN externo. Si hay cambio de URL o sin internet, la app falla (aunque el test suite tiene workaround local).
4. **Carpetas con nombres inconsistentes** — `"LUNES 23 : PAD WORKS"`, `versiones` vs `versions`, mezcla de idiomas en nombres.
5. **localStorage usado para persistencia de estado** — el test suite incluye un reset de `xpn_setup_done`. Señal de que el debug está "activo" en producción.
6. **No hay .gitignore** — `node_modules/` y `dist/` potencialmente se incluirían en commits.

### 🟢 Menores
7. **Debug activo en producción**: `localStorage.removeItem('xpn_setup_done')` en el boot hace que el welcome modal aparezca siempre.
8. **main.js sin menu personalizado** — la app Electron no tiene menú nativo (File, Edit, etc.).
9. **Sin versión para Windows/Linux** — `package.json` solo construye `.dmg`.

---

## OPORTUNIDADES DE MEJORA

1. **Separar el código**: dividir el monolito HTML en módulos JS separados (pad-engine, pattern-editor, export, ui, effects). Mantenible a largo plazo.
2. **Inicializar Git** con `.gitignore` apropiado — historial real desde ahora.
3. **Activar build multiplataforma** — agregar targets `win` y `linux` en package.json si se desea distribución más amplia.
4. **Auto-updater** — electron-builder soporta `electron-updater` para actualizaciones automáticas desde Gumroad o GitHub Releases.
5. **Remover debug de producción** — eliminar `localStorage.removeItem('xpn_setup_done')` del boot antes de próxima release.
6. **Bundlar dependencias offline** — copiar JSZip y html2canvas localmente para que la app funcione 100% offline.
7. **Mejorar main.js** — agregar menú nativo (File > Export, Help > Manual), splash screen, y manejo de errores.

---

## DEUDA TÉCNICA

| Ítem | Impacto | Esfuerzo |
|---|---|---|
| Git init + historial | Alto | Bajo |
| .gitignore | Alto | Muy bajo |
| Debug en producción (localStorage) | Medio | Muy bajo |
| Dependencias CDN → local | Medio | Bajo |
| Modularización del HTML monolito | Alto | Alto |
| Build Windows/Linux | Bajo | Bajo |
| Auto-updater | Medio | Medio |
| Menú nativo Electron | Bajo | Bajo |
