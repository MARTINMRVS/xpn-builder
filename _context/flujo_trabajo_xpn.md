# FLUJO DE TRABAJO — XPN SOFTWARE
_Actualizado: 2026-03-27_

---

## DESCRIPCIÓN DEL PROYECTO

**XPN Builder** (marca: Pad Works) es una app desktop para productores musicales.
Permite construir y exportar **expansion packs** de samples para samplers **Akai MPC**
(Live, X, One). Se distribuye como aplicación macOS vía Gumroad.

---

## STACK TECNOLÓGICO

```
Frontend:    HTML5 + CSS3 + Vanilla JavaScript (sin frameworks)
Desktop:     Electron v33
Build:       electron-builder v25 → .dmg universal (arm64 + x86_64)
Testing:     Jest v30 + jsdom
Libs:        JSZip 3.10.1, html2canvas 1.4.1
Audio:       Web Audio API
```

---

## ESTADO ACTUAL (v1.0.0 — Marzo 2026)

✅ App funcional y distribuible  
✅ 62/62 tests passing  
✅ .dmg universal generado  
✅ Manual trilingüe (ES/EN/FR)  
✅ Assets de marketing listos (Gumroad covers, logos)  

⚠️ Sin Git inicializado  
⚠️ Debug activo en producción (localStorage)  
⚠️ Arquitectura monolítica (single HTML file ~425 KB)  

---

## FLUJO DE TRABAJO RECOMENDADO

### Antes de cada sesión
1. Confirmar con el usuario: **"¿Trabajamos en XPN o Wattai hoy?"**
2. Revisar este archivo para contexto rápido
3. NUNCA tocar `/Users/mrvs/Documents/WattAI`

### Para cambios en la app principal
1. **Backup primero**: copiar `mpc_expansion_builder.html` a `versions/` con fecha
   - Ejemplo: `versions/xpn_YYYYMMDD_descripcion.html`
2. Realizar el cambio
3. Correr tests: `cd XPN-Builder-V1-Final && npm test`
4. Confirmar que los 62 tests siguen en verde
5. Probar la app en Chrome o con Electron (`npm start`)

### Para construir el .dmg
```bash
cd /Users/mrvs/Documents/xpnfull/XPN-Builder-V1-Final
npm run build
# Output: dist/XPN Builder-1.0.0.dmg
```

### Para correr los tests
```bash
cd /Users/mrvs/Documents/xpnfull/XPN-Builder-V1-Final
npm test
# Resultado esperado: 62/62 PASS
```

### Para abrir la app en desarrollo
```bash
cd /Users/mrvs/Documents/xpnfull/XPN-Builder-V1-Final
npm start
# O simplemente abrir mpc_expansion_builder.html en Chrome
```

---

## PENDIENTES (v1.1 y siguiente)

### Técnicos urgentes
- [ ] Inicializar Git con `.gitignore` adecuado
- [ ] Remover `localStorage.removeItem('xpn_setup_done')` del boot (debug en prod)
- [ ] Mover dependencias CDN (JSZip, html2canvas) a archivos locales

### Features pendientes
- [ ] Auto-updater (electron-updater desde GitHub Releases o Gumroad)
- [ ] Menú nativo Electron (File, Help, About)
- [ ] Build para Windows (target `nsis` en package.json)
- [ ] Modularización del HTML monolito (separar JS en módulos)

### Marketing / Negocio
- [ ] Publicar en Gumroad con assets disponibles
- [ ] Estrategia de contenido según `PadWorks_ContentStrategy.pdf`

---

## BUENAS PRÁCTICAS DEL EQUIPO

### Código
- Funciones pequeñas con una sola responsabilidad
- Nombres descriptivos en español o inglés (consistente por módulo)
- Comentar bloques complejos con `// ──` como separador visual
- Sin código duplicado — si algo se repite 2 veces, extraer función

### Proceso
- Backup con fecha antes de cualquier cambio grande
- Tests en verde antes de hacer release
- Confirmar con el usuario antes de ejecutar cambios destructivos
- Modularidad: un cambio en el Pattern Editor no debe romper el Export

### Arquitectura actual
- Toda la app vive en `mpc_expansion_builder.html`
- El estado global se maneja con variables JS a nivel de `window`
- La persistencia usa `localStorage` del navegador/Electron
- El export genera un `.zip` en memoria con JSZip y lo descarga

---

## CONTACTO / HERRAMIENTAS

| Herramienta | Uso |
|---|---|
| Este chat (Claude.ai) | Pensar, diseñar, redactar instrucciones |
| Claude Desktop + MCP (xpn) | Ejecutar cambios en archivos |
| Chrome / Electron | Probar la app |
| npm test | Verificar que no se rompió nada |
