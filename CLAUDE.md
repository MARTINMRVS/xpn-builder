# CLAUDE.md — XPN / Pad Works Project Rules

## Proyecto
- Ruta: /Users/mrvs/Documents/xpnfull
- Contexto: /Users/mrvs/Documents/xpnfull/_context/
- Vault: /Users/mrvs/Documents/vault-martin

## Reglas criticas
- NUNCA modificar el flag debug en produccion
- SIEMPRE backup antes de tocar archivos grandes
- Modulos independientes — un cambio no afecta otros

## Inicio de sesion
Lee _context/REGLAS.md
Lee _context/diagnostico_xpn.md para estado actual

## Skills automaticos
- Feature nueva o mas de 2 archivos → aplicar criterio ARKI
- Despues de implementar → aplicar criterio QATEST
- Antes de distribuir en Gumroad → aplicar criterio SENIOR

## Stack
Vanilla JS + HTML5 monolitico (~425KB)
Electron v33
64 Jest tests — deben pasar todos antes de distribuir

## Pendientes conocidos
- Modularizacion del archivo principal

## Distribucion
Gumroad como .dmg macOS
Marca: Pad Works

## Fin de sesion obligatorio
1. Verificar que 64 Jest tests siguen pasando
2. git commit si Git esta inicializado
3. Documentar cambios en _context/
