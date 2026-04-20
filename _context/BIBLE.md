# XPN Builder — BIBLE

**Última actualización:** 2026-04-20
**Autor:** Mrvs (Martín, Santiago)

---

## 1. Qué es XPN

Generador de expansions para Akai MPC. Distribuido como macOS .dmg via Gumroad bajo la marca Pad Works. Primer proyecto de Martín.

### Dos flujos de producto (decisión 2026-04-20)

**Flujo principal — Expansion Pack (classic way):**
Formato oficial de la industria MPC. El usuario crea múltiples kits curados con nombre propio, cada uno con su .xpm, su sequence vinculada, su preview MP3, y tags para que la MPC los organice en el browser. Es lo que el 90% de productores conoce, compra y vende.

**Flujo secundario — Extended (A-H):**
Programa único que usa los 8 bancos A-H con 128 pads. El usuario arrastra samples, XPN los distribuye automáticamente. Útil para live sets largos y bancos masivos de sonidos. Opción accesible pero no protagonista en la UI.

Ambos flujos con mensajes instructivos sutiles que guíen sin estorbar. No son modos técnicos confusos — son dos productos distintos con workflows distintos desde el primer paso.

---

## 2. Stack

- **Runtime:** Electron
- **UI:** HTML5 + Vanilla JS (monolito en mpc_expansion_builder.html, ~436 KB)
- **Tests:** Jest, 64/64 passing
- **Dependencias CDN:** JSZip, html2canvas (pendiente bundlear offline)
- **Distribución:** .dmg macOS via Gumroad
- **Repo:** https://github.com/MARTINMRVS/xpn-builder (privado)

---

## 3. Estado actual (abril 2026)

### Git + GitHub
- Repo inicializado 2026-04-17
- Branch: main
- Autenticación: gh CLI con HTTPS
- 6 commits en historial

### Commits sesión 2026-04-17
1. `1ad78dd` Initial commit — XPN Builder
2. `32c038f` Fix: guard null on #activeModeName in renderModes()
3. (commit #3 docs 62→64)
4. (commit #4 remove debug flag xpn_setup_done)
5. (commit #5 limpiar CLAUDE.md)
6. (commit #6 crear BIBLE — este)

### Tests
- 64/64 passing
- Suite: tests/xpn.test.js

---

## 4. Decisiones de producto tomadas

### Eliminar modos como elección del usuario
XPN actualmente tiene 3 modos de distribución (Normal / Force Fill / Live). Decisión tomada 2026-04-17: eliminar la elección explícita y que XPN decida automáticamente según cantidad de samples:

- ≤16 samples → Bank A, resto vacío
- 17 a 127 samples → distribución inteligente sin duplicar
- 128+ samples → llenado optimizado de los 8 banks

Filosofía: "herramienta que no simplifica, estorba". Usuario arrastra samples, XPN hace lo correcto.

Impacto técnico: el bug de #activeModeName en el DOM queda irrelevante (ya no mostramos modo activo al usuario). Fix aplicado con guard null como solución temporal. Refactor real pendiente en Fase 5.

### Arquitectura de dos flujos (2026-04-20)
Reemplaza la idea de "modos" eliminados. El usuario al abrir XPN ve el camino clásico (Expansion Pack) como flujo principal. Extended queda como opción secundaria tipo "Advanced".
Diferencia con los modos anteriores: aquellos (Normal/Force Fill/Live) eran variaciones técnicas del mismo proceso que confundían. Estos son productos distintos con flujos distintos.

---

## 5. Investigación samplers — COMPLETADA (2026-04-20)

Investigación realizada desde WEB leyendo mpc_expansion_builder.html directamente (~8564 líneas).

### Resultado PASOS A-F:

**PASO A — Formato de exportación:**
Función buildPresetXml() (línea 5181). Genera XML con tag raíz MPCVObject. Soporta firmware 2.x (Version 2.8) y 3.x (Version 3.0).

**PASO B — Parámetros UI vs exportados (TODOS se exportan):**
- Volume → `<Volume>`
- Pitch → `<Pitch>`
- Pan → `<Pan>`
- SampleStart → `<SampleStart>`
- SampleEnd → `<SampleEnd>`
- FilterType → `<FilterType>`
- FilterCutoff → `<FilterCutoff>`
- FilterResonance → `<FilterResonance>`
- AmpAttack → `<AmpAttack>`
- AmpDecay → `<AmpDecay>`
- AmpSustain → `<AmpSustain>`
- AmpRelease → `<AmpRelease>`
- Layers (hasta 4) con VelLow/VelHigh por capa
- PadColor (hex convertido a decimal MPC)
- Effects chain por pad
- Firmware 3.x extras: PolyMode, MuteGroup, MuteTargets, LayerPlayStyle

NO hay parámetros huérfanos. Todo lo que ve el usuario se exporta.

**PASO C — Start/End point:**
Funcionan correctamente. Tienen drag listeners (líneas 3718-3752), actualizan el objeto pad, y se escriben al XML. No hay bug.

**PASO D — Filtro:**
Existen ambos controles: dropdown de tipo (padFilterType) + knobs de Cutoff y Resonance. Se exportan como FilterType, FilterCutoff, FilterResonance.

**PASO E — Preview de audio:**
Existe playback via Web Audio API (función playBuffer, línea 4135). La función previewPad() (línea 3392) aplica volume, pitch, pan, y respeta SampleStart/SampleEnd para trimming.
PROBLEMA DETECTADO: el preview NO aplica filtro ni ADSR. No hay BiquadFilterNode ni envelope en la cadena de Web Audio. El usuario escucha el sample crudo, no lo que la MPC hará con los parámetros. Los parámetros se GUARDAN bien pero no se ESCUCHAN en preview.

**PASO F — Formato MPC oficial:**
Ingeniería inversa parcial bien hecha. No hay documentación oficial citada, pero los tags XML (MPCVObject, SampleStart, FilterType, AmpAttack, etc.) coinciden con terminología real del formato .xpm de Akai. La MPC reconoce estos parámetros.

### Pendiente técnico derivado:
- Implementar filtro + ADSR en Web Audio preview para que el usuario escuche lo que realmente exporta.

---

## 5B. Arquitectura real de expansiones MPC (investigación 2026-04-20)

Investigación exhaustiva del formato oficial. Fuentes: Akai support, MPC-Tutor, Drum Broker, MPC Forums, manuales oficiales.

### Estructura de carpetas de una expansión oficial:

```
Mi_Expansion/
├── Expansion.xml        (metadata: nombre, autor, versión, identifier)
├── artwork.jpg           (cover 1000x1000px)
├── Samples/All/          (WAV 16/24-bit, 44.1 kHz)
├── Programs/             (.xpm = los "kits")
├── Sequences/            (.sxq o .mpcpattern vinculados por nombre)
└── [Previews]/           (MP3/WAV pre-renderizados para audición)
```

### Qué es un "Kit" (.xpm):
Archivo XML texto plano que contiene: asignación de samples a pads, hasta 4 capas por pad con rangos de velocidad, pitch/volume/pan por capa, SampleStart/SampleEnd, FilterType+Cutoff+Resonance por pad, Amp Envelope ADSR por pad, Voice Overlap/Mute Groups, Pad Colors.

### Sistema de tags y grupos:
Los nombres de archivo funcionan como tags. Estructura:
`GrupoPrimario-GrupoSecundario-NombreKit.xpm`
Ejemplo: `HipHop-Kit-Spooky Kit.xpm` → la MPC crea categorías automáticas "HipHop > Kit" y muestra "Spooky Kit".

### Sequences vinculadas al kit:
La secuencia demo debe tener exactamente el mismo nombre que el programa .xpm pero con extensión .sxq. El Expansion Builder de Akai detecta la correspondencia automáticamente.
Ejemplo: `HipHop-Kit-Epic Kit.xpm` → `HipHop-Kit-Epic Kit.sxq`

### Previews:
Son archivos MP3/WAV pre-renderizados, NO reproducción MIDI en tiempo real. El productor graba un beat usando el kit, lo exporta como audio, y lo pone en [Previews]/ con el nombre exacto del .xpm + .mp3. El patrón MIDI por sí solo no tiene preview integrado.

### Insert Effects:
Hasta 4 insert effects por pad. Los efectos son a nivel de proyecto (.xpj), no viajan dentro del .xpm estándar. Las expansiones de terceros generalmente no incluyen cadenas de efectos.

### Plugin presets (.xpl):
Nivel avanzado, solo expansiones premium oficiales de Akai. Fuera del alcance actual de XPN Builder.

### Comparativa XPN Builder actual vs formato oficial:

| Componente | Oficial | XPN actual | Estado |
|---|---|---|---|
| Expansion.xml metadata | Obligatorio | Manifest simplificado | PARCIAL |
| Artwork 1000x1000 | Si | Soporta | OK |
| Múltiples kits con nombre | Si, varios por expansión | 1 por banco A-H | FALTA |
| Naming/Tags para grupos | Sistema Grupo-Tipo-Nombre | No implementado | FALTA |
| Layers por pad (4) | Si | Si | OK |
| Filter + ADSR por pad | Si | Se exportan correctamente | OK |
| SampleStart/End | Si | Se exportan | OK |
| Sequences vinculadas | .sxq/.mpcpattern por nombre | Genera .mpcpattern sin vínculo | PARCIAL |
| Previews MP3 por kit | Carpeta [Previews] | Demo track general, no por kit | FALTA |
| Insert FX chains | Solo en .xpj | No soportado | FUERA DE ALCANCE |
| Plugin presets .xpl | Avanzado | No soportado | FUERA DE ALCANCE |

---

## 6. Roadmap de fases

- ✅ Fase 0 — Estabilizar tests (64/64)
- ✅ Fase 1 — Git init + GitHub
- ✅ Fase 2 — BIBLE + _context
- ⏳ Fase 3 — Respaldo en Obsidian vault
- ✅ Fase 4 — Remover debug flag
- ✅ Fase 5A — Investigación samplers (COMPLETADA 2026-04-20)
- ⏳ Fase 5B — Preview con filtro + ADSR en Web Audio
- ✅ Fase 5B-parcial — Fixes críticos Pattern Editor (B1 velocity playback, B2 renderPatternToWav, B4/B5 kit-awareness)
- ✅ Fase 6 — Implementar flujo Expansion Pack (classic way) — COMPLETADA 2026-04-20:
    - Múltiples kits con nombre propio
    - Sistema de tags/grupos en nombres de archivo
    - Carpeta [Previews] con MP3 por kit
    - Sequences vinculadas por nombre al kit
    - Expansion.xml completo con metadata oficial
- ⏳ Fase 7 — Refactor UI: pantalla inicial con dos caminos (Expansion Pack como principal, Extended como secundario) con mensajes instructivos no invasivos
- ⏳ Fase 8 — Modularización del monolito HTML
- ⏳ Fase 9 — Eliminar modos legacy del código (Normal/Force Fill/Live)

---

## 7. Pendientes técnicos menores

- Estructura anidada XPN-Builder-V1-Final/ en raíz
- Dependencias CDN a bundlear offline
- Build multiplataforma no configurado
- Sin CI/CD
- Archivos históricos duplicados en versions/, versiones /, .bak (limpiar en Fase 2)
- Nombres de carpeta con espacios/caracteres raros

---

## 8. Convenciones de trabajo

### Flujo Claude
- **WEB** (Claude.ai) = planificación, ARKI, decisiones
- **DECK CODE** (Claude Code) = ejecución, edición de archivos
- Martín copia órdenes de WEB a DECK CODE

### Skills disponibles
- WEB: ARKI, HELPER, SENIOR, QATEST

### Reglas
- Nunca API keys en código ni chat
- Backup antes de tocar archivos grandes
- Confirmación paso a paso entre acciones de DECK CODE
- Commits frecuentes con mensajes descriptivos

---

## 9. Historial de sesiones

### 2026-04-17
**Objetivo:** Git init + saneamiento base.
**Resultado:** 6 commits. Repo en GitHub. Bug #activeModeName fixeado (guard null). Debug flag xpn_setup_done removido. Docs actualizadas 62→64. BIBLE creado.
**Decisión clave:** Simplificar XPN eliminando modos como elección del usuario.
**Próxima sesión:** Investigación samplers (PASOS A-F) + refactor plan.

### 2026-04-20
**Objetivo:** Investigación profunda del formato MPC y arquitectura de expansiones oficiales.
**Resultado:**
- Investigación samplers PASOS A-F completada desde WEB (lectura directa de mpc_expansion_builder.html, 8564 líneas).
- Todos los parámetros del sampler editor se exportan correctamente al .xpm.
- Problema detectado: preview no aplica filtro ni ADSR (cosmético en playback).
- Formato de exportación es ingeniería inversa parcial bien hecha, no inventado.
- Investigación exhaustiva de la arquitectura real de expansiones MPC oficiales (estructura de carpetas, kits, sequences, previews, tags, effects).
- Tabla comparativa completa de lo que XPN tiene vs lo que falta.
- Decisión de producto: dos flujos — Expansion Pack (principal, classic way) y Extended (secundario, A-H 128 pads). No son modos confusos sino productos distintos.
- Roadmap actualizado con fases 5A-9.
**Decisión clave:** Incorporar formato oficial de expansiones MPC como flujo principal de XPN Builder.
**Próxima sesión:** Planificar implementación Fase 6 (flujo Expansion Pack).

### 2026-04-20 (continuación)
Fase 6 implementada y mergeada. 5 commits en branch
fase-6-expansion. PR #1 en GitHub. +554/-42 líneas.
64/64 tests passing. Flujo Expansion Pack funcional con
kit manager, welcome modal, export con Expansion.xml oficial.

Pattern Editor: 3 fixes críticos mergeados (PR #2). Velocity
ahora suena en playback. renderPatternToWav reescrito usando PE
real con velocity/swing/mutes. Pattern editor y export de
sequences ahora kit-aware en expansion mode. Score 6→8/10.
Bugs moderados B6-B10 pendientes para ronda de polish.
