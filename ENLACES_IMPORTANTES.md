# Enlaces y Recursos de InteliBalance

Este documento contiene los enlaces importantes que debes configurar en el proyecto antes del despliegue.

## 🤖 Bot de Telegram

**Ubicación en el código:**

- `src/pages/Landing.jsx` - líneas 85, 221
- `src/pages/Login.jsx` - (opcional, si decides agregarlo)

**URL actual (placeholder):**

```
https://t.me/your_bot_username
```

**Pasos para configurar:**

1. Crea tu bot usando [@BotFather](https://t.me/botfather) en Telegram
2. Obtén el nombre de usuario del bot (ej: `@InteliBalanceBot`)
3. Reemplaza `your_bot_username` con el nombre real en todos los archivos
4. Configura los comandos del bot:
   - `/balance [valvula]` - Consultar balance de una válvula
   - `/alertas` - Ver alertas pendientes
   - `/ayuda` - Mostrar comandos disponibles

## 📄 Documentación PDF

**Ubicación en el código:**

- `src/pages/Landing.jsx` - línea 206
- Footer - línea 246

**URL actual (placeholder):**

```
/documentacion/funcionamiento-completo.pdf
```

**Pasos para configurar:**

1. Crea un PDF detallado con:
   - Arquitectura del sistema
   - Flujo de datos
   - Explicación de modelos ML (XGBoost, Prophet)
   - Guía de uso por rol
   - Interpretación de métricas
2. Coloca el PDF en la carpeta `public/documentacion/`
3. Nombra el archivo como `funcionamiento-completo.pdf`

## 🐙 GitHub Repository

**Ubicación en el código:**

- Footer en `src/pages/Landing.jsx` - línea 230

**URL actual (placeholder):**

```
https://github.com/your-repo/intelibalance
```

**Pasos para configurar:**

1. Crea un repositorio público en GitHub
2. Reemplaza `your-repo/intelibalance` con tu usuario/nombre-repo real
3. Asegúrate de incluir en el repo:
   - README.md completo
   - Licencia apropiada
   - .gitignore para node_modules
   - Instrucciones de instalación

## 🌐 Enlaces EPM

Estos enlaces ya están configurados y funcionan:

- **Sitio oficial EPM:** https://www.epm.com.co/
- **Revisiones de Gas:** https://aplicaciones.epm.com.co/revisionesgas/#/
- **Sostenibilidad:** https://www.epm.com.co/site/home/sostenibilidad

## ⚙️ Búsqueda Global de Enlaces

Para encontrar y actualizar todos los enlaces placeholder en el proyecto, ejecuta:

```bash
# Buscar enlaces a Telegram bot
grep -r "t.me/your_bot_username" src/

# Buscar referencias a GitHub
grep -r "github.com/your-repo" src/

# Buscar referencias al PDF
grep -r "funcionamiento-completo.pdf" src/
```

O en PowerShell:

```powershell
Select-String -Path "src\**\*.jsx" -Pattern "your_bot_username"
Select-String -Path "src\**\*.jsx" -Pattern "your-repo"
Select-String -Path "src\**\*.jsx" -Pattern "funcionamiento-completo.pdf"
```

## 📋 Checklist Pre-Despliegue

- [ ] Bot de Telegram creado y configurado
- [ ] PDF de documentación completo en `public/documentacion/`
- [ ] Repositorio de GitHub creado y público
- [ ] Todos los placeholders reemplazados en el código
- [ ] Enlaces probados manualmente
- [ ] Build de producción generado (`npm run build`)
- [ ] Verificar que el PDF es accesible en producción

## 🎨 Recursos Adicionales Opcionales

Si deseas mejorar la landing page, considera agregar:

1. **Logo de EPM:** Coloca el logo oficial en `public/` y actualiza el icono placeholder en Hero section
2. **Screenshots:** Capturas del dashboard para mostrar en la sección "Qué es InteliBalance"
3. **Video demo:** URL a YouTube/Vimeo con demo del sistema
4. **Testimoniales:** Quotes de usuarios EPM (si aplica)

---

**Nota:** Recuerda actualizar este documento cuando realices cambios en los enlaces o agregues nuevos recursos.
