# XPN Builder — BIBLE

**Última actualización:** 2026-04-17
**Autor:** Mrvs (Martín, Santiago)

---

## 1. Qué es XPN

Generador de expansions para Akai MPC. Toma una carpeta de samples y produce un kit MPC con Banks (A-H) y Pads (16 por banco = 128 pads totales). Distribuido como macOS .dmg via Gumroad bajo la marca **Pad Works**. Es el primer proyecto de Martín.

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

---

## 5. Pendientes investigación samplers

Dudas de Martín sobre si los parámetros del sampler editor realmente afectan el resultado exportado a MPC:

1. Pitch + filtro — ¿la MPC reconoce los cambios?
2. Start/End point (líneas roja y verde) — no se pueden mover
3. Sampler edit incompleto vs parámetros oficiales del formato MPC
4. Selector de filtros (dropdown) vs perilla
5. Previsualización de audio con cambios aplicados

**Plan de investigación pendiente (PASOS A-F):**
- A: Formato de exportación — qué se escribe al archivo
- B: Parámetros UI vs parámetros exportados (tabla)
- C: Start/End point — diagnóstico del bug
- D: Filtro — selector + perilla, tipos soportados
- E: Preview de audio — ¿existe?
- F: Formato MPC oficial — versión soportada

Retomar con esta investigación en próxima sesión.

---

## 6. Roadmap de fases

- ✅ **Fase 0** Estabilizar tests (64/64)
- ✅ **Fase 1** Git init + GitHub
- ⏳ **Fase 2** BIBLE + _context (en progreso — este archivo)
- ⏳ **Fase 3** Respaldo en Obsidian vault (/Users/mrvs/Documents/vault-martin)
- ✅ **Fase 4** Remover debug flag
- ⏳ **Fase 5** Refactor samplers + eliminar modos
- ⏳ **Fase 6** Modularización del monolito HTML

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
