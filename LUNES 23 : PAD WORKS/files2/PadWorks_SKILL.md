# PAD WORKS XPN — SKILL DE SESIÓN
> Última actualización: 23 Marzo 2026 · Versión activa en desarrollo

---

## IDENTIDAD DEL PROYECTO
- **Producto:** Pad Works XPN — MPC Expansion Builder
- **Creador:** MRVS · Marca: Pad Works · padworks.com
- **Stack:** HTML/CSS/JS monolítico + Electron · Node.js v24
- **Archivo principal:** `mpc_expansion_builder.html`
- **Ruta:** `~/Downloads/xpn full/XPN-Builder-V1-Final/`
- **Tests:** 64/64 passing
- **Backups:** `./versions/` — usar `./save.sh` para guardar checkpoints

---

## REGLAS DE DESARROLLO — LEER ANTES DE CADA CAMBIO

1. **Un archivo** — todo vive en `mpc_expansion_builder.html`. No separar.
2. **Backup primero** — antes de cualquier cambio grande: `cp mpc_expansion_builder.html ./versions/xpn_$(date +"%H%M").html`
3. **Prompts específicos** — mencionar nombre de función, elemento HTML o línea. Nunca "arregla lo que no funciona".
4. **Verificar en DOM** — confirmar que el elemento existe Y que el event listener está conectado. Código existente ≠ código funcionando.
5. **No romper lo existente** — implementaciones nuevas son ADITIVAS. No tocar export, sampler, sequencer.
6. **Tests después de cada cambio** — `npm test` → debe mantener 64/64.
7. **Modelo recomendado** — Opus 4.6 1M context para cambios grandes. `/model claude-opus-4-5`

---

## ARQUITECTURA DEL SOFTWARE

### Modos disponibles
`BEAT` · `DRUM` · `LIVE` · `HIPHOP` · `ELEC` · `CSTM`

### Estructura de pads
- 8 bancos (A-H) × 16 pads = 128 pads por expansión
- Categorías: KICK · SNARE · CLAP · RIM · HH CL · HH OP · HH PD · TOM · CYMBAL · PERC · BASS · SMPLR · FX

### Colores de categoría (XPN_CAT_COLORS)
```
KICK:#E8651A · SNARE:#E8D81A · RIM:#1AE8D8 · CLAP:#E81AB5
HH CL:#1AE84B · HH OP:#8BE81A · HH PD:#1A8BE8
TOM:#7B1AE8 · CYMBAL:#E81A7B · PERC:#E81A1A
BASS:#1A4BE8 · SMPLR:#1AE8E8 · FX:#888888
```

### Mode Layouts (XPN_MODE_LAYOUTS)
```
BEAT:   KICK/SNARE/RIM/CLAP · KICK/HH CL/HH OP/HH CL · SMPLR/TOM/CYM/CYM · PERC/PERC/SMP/SMP
DRUM:   KICK/KICK/SNR/SNR · TOM×4 · HH CL/HH OP/HH PD/CYM · PERC/PERC/CLP/RIM
LIVE:   igual que BEAT
HIPHOP: KICK/SNR/RIM/CLP · HH CL/HH OP/HH CL/PERC · SMP×4 · PERC/PERC/CYM/TOM
ELEC:   KICK×2/SNR/CLP · HH CL/HH OP/RIM/PERC · BASS×2/SMP×2 · FX×2/CYM/PERC
```

### Export MPC
- **MPC 2.x y 3.x:** botones separados — tags XPM distintos por firmware
- **Estructura ZIP:** Programs/ · Samples/All/ · Sequences/ · Previews/
- **PadColor:** `R*65536 + G*256 + B` — función `hexToMPCColor(hex)`
- **Preview audio:** `[KitName].xpm.mp3` en Previews/

---

## FEATURES IMPLEMENTADOS — NO RE-IMPLEMENTAR

### Core
- Smart Auto-assign: LONG / KIT / FILL + botón Dismiss
- Pattern sequencer: swing, velocity/step, 8 secuencias/banco
- Sampler edit: LEVEL/PAN/PITCH · ADSR · FILTER · LAYERS · VOICES
- Voices firmware-aware: parámetros distintos MPC 2.x vs 3.x
- MPC Live 3 Quad Split: 4 cuadrantes/pad para layers
- Waveform editor: markers start/end arrastrables + campos ms

### UI/UX
- 15 skins · transición 200ms · persiste en localStorage
- Pad colors: overlay semitransparente por categoría
- Layout presets: KIT / EDIT / SEQ
- Undo/Redo: Cmd+Z / Cmd+Shift+Z · 20 acciones
- Keyboard shortcuts: Cmd+S · Cmd+E · Space · F · +/- · ?
- Auto-assign toggle ON/OFF en topbar
- AUTO ASSIGN como dropdown en topbar (colapsado)
- REORDER como dropdown en topbar (colapsado)

### Conectividad
- MIDI: Web MIDI API · Ch1 C3 cromático · 16 slots todos los bancos
- Screenshot: Cmd+Shift+S → PNG via html2canvas

### Nuevo hoy (23 Mar 2026)
- Welcome modal: selección MPC + modo al primer arranque
- Template editor: arrastrar tags sobre pads, colores custom, guardar
- Mini pad preview en selector de modo (reemplaza renderModePreview())
- Ícono dot-grid 512x512 para .dmg (icon.png)
- package.json actualizado con icon para electron-builder

---

## SISTEMA DE VERSIONES
```
./save.sh                             # guarda copia con timestamp
./versions/xpn_1240_checkpoint.html   # checkpoint 12:40 hoy
./versions/xpn_pre_template.html      # antes del template system
```

---

## COMPATIBILIDAD MPC
| Formato     | Live 1/2 | One/X | Live 3 | Force |
|-------------|----------|-------|--------|-------|
| .xpm        | ✅ | ✅ | ✅ | ✅ |
| .wav 44.1kHz| ✅ | ✅ | ✅ | ✅ |
| .mpcpattern | ✅ | ✅ | ✅ | ✅ |
| .mid        | ✅ | ✅ | ✅ | ✅ |
| Preview .mp3| ✅ | ✅ | ✅ | ✅ |

---

## MODELO DE NEGOCIO
| Tier | Precio | Incluye |
|------|--------|---------|
| Free | $0 | Export con watermark, 1 banco |
| Core | $19 | Sin watermark, 8 bancos, todos los modos |
| Pro  | $39 | + Slice Mode, BPM detector, mute groups auto |

**Venta:** Gumroad (issue pagos Chile) → alternativa Lemon Squeezy
**Precio lanzamiento:** $29 USD

---

## BRAND
- **Colores:** `#0D0F14` negro · `#C8A96E` gold · `#F8F6F0` cream
- **Tipografía:** Helvetica Bold display · Courier técnico
- **Tagline:** "Built by musicians. For musicians."
- **Handle redes:** @padworks
- **Ícono:** dot grid 3×3 gold sobre fondo negro

---

## PENDIENTES PRIORITARIOS
- [ ] Verificar template system + welcome modal en browser
- [ ] Test en hardware MPC con samples reales
- [ ] Compilar .dmg con ícono nuevo
- [ ] Resolver pagos → activar Lemon Squeezy
- [ ] Lanzamiento producto

---

## CÓMO USAR ESTE SKILL
Al inicio de cada sesión nueva sube este archivo y escribe:
> "Lee el SKILL antes de responder. Continúa desarrollo de Pad Works XPN."
