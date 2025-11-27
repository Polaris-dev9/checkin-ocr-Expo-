# Check-in OCR (React Native + Expo)

## Demo pública

- Web: https://frolicking-paletas-28a0ba.netlify.app/
- EAS Dashboard: https://expo.dev/accounts/polaris525/projects/checkin-ocr

---

Mini-flujo de check-in online que permite:

- Escanear la parte delantera y trasera de un documento de identidad.
- Enviar ambas imágenes a Mindee (modelo de documentos de identidad) para extraer datos por OCR.
- Pre-rellenar formularios de:
  - Datos personales.
  - Datos del documento.
- Permitir que el huésped revise y edite los datos antes de finalizar.

## Stack y librerías

- Expo (SDK 54, proyecto TypeScript).
- React Navigation (`@react-navigation/native`, `@react-navigation/native-stack`).
- Cámara: `expo-camera`.
- Formularios: `react-hook-form`.
- Validación: `zod` + `@hookform/resolvers`.
- HTTP: `axios`.
- Tests: `jest` + `ts-jest`.

## Estructura principal

- `App.tsx`: envuelve la app con `CheckinProvider` y el `StackNavigator`.
- `src/navigation/StackNavigator.tsx`: 6 pantallas del flujo:
  1. `ScanFront`
  2. `ScanFrontChecked`
  3. `ScanBack`
  4. `ScanBackChecked`
  5. `PersonalData`
  6. `DocumentData`
- `src/context/CheckinContext.tsx`:
  - Estado compartido del flujo:
    - `frontImageUri`, `backImageUri`.
    - `personalData`, `documentData`.
- `src/services/mindeeClient.ts`:
  - `analyzeIdCard(frontUri, backUri)`: llama a la API de Mindee con ambas imágenes.
- `src/services/ocrMapper.ts`:
  - `mapMindeeToCheckinData(front, back)`: mapea el JSON de Mindee a los modelos internos.
- `src/forms/*.ts`: esquemas `zod` para validación de formularios.
- `src/screens/*.tsx`: pantallas de cámara, confirmación y formularios.

## Configuración de Mindee

1. Crear cuenta en [`mindee.com`](https://www.mindee.com/) y obtener una API Key del modelo de documentos de identidad.
2. Definir la variable de entorno (modo desarrollo):

```bash
set EXPO_PUBLIC_MINDEE_API_KEY=TU_API_KEY
```

En sistemas tipo Unix:

```bash
export EXPO_PUBLIC_MINDEE_API_KEY=TU_API_KEY
```

> En producción, esta clave debería protegerse y, preferiblemente, llamarse a Mindee desde un backend intermedio.

## Ejecutar el proyecto

```bash
cd checkin-ocr
npm install  # si no se ha hecho aún
npm run android    # o npm run web / npm run ios
```

- En móvil físico, usar Expo Go para escanear el QR que muestra la terminal.

## Flujo funcional

1. ScanFront:
   - Muestra vista de cámara.
   - Checklist de calidad (marco, reflejos, legibilidad).
   - Botón de escaneo deshabilitado hasta marcar los puntos.
2. ScanFrontChecked:
   - Muestra la foto tomada.
   - Checklist con todos los puntos validados.
   - Botones para repetir foto o continuar.
3. ScanBack / ScanBackChecked:
   - Igual que el frontal pero para la parte trasera.
   - En la pantalla `ScanBackChecked`, al pulsar Continuar:
     - Se llama a `analyzeIdCard(frontUri, backUri)`.
     - Se mapea la respuesta con `mapMindeeToCheckinData`.
     - Se guarda en el contexto y se navega a `PersonalData`.
     - Si falla el OCR, se muestra un mensaje y los formularios se rellenan vacíos.
4. PersonalData:
   - Formulario `react-hook-form` + `zod`:
     - Nombre, apellidos, género, fecha de nacimiento, email.
   - Pre-rellenado con los datos extraídos por OCR.
   - Validaciones mínimas (obligatoriedad, formato de fecha, email).
5. DocumentData:
   - Formulario con:
     - Nacionalidad (texto + bandera opcional).
     - Tipo de documento.
     - Número de documento.
     - Número de soporte.
     - Fechas de emisión y caducidad.
   - También validado con `zod`.
   - Al pulsar Finalizar se actualiza el contexto y se muestra un mensaje de éxito.

## Tests

- Configurado Jest con `ts-jest` (`jest.config.cjs`).
- Test de ejemplo en `__tests__/ocrMapper.test.ts`:
  - Verifica que `mapMindeeToCheckinData`:
    - Mapea los campos básicos (nombre, apellidos, fecha de nacimiento, nº documento, país).
    - Utiliza el dorso del documento como respaldo si faltan campos en el frontal.

Ejecutar tests:

```bash
npm test
```

## Demo pública

### EAS Update (Expo Go / Development Builds)

La aplicación ha sido publicada usando EAS Update:

- EAS Dashboard: https://expo.dev/accounts/polaris525/projects/checkin-ocr
- Update ID: `632d7fd4-600d-48fa-97f5-154ffb2fc60f`
- Runtime Version: `1.0.0`

Para acceder:
1. Instalar Expo Go en tu dispositivo móvil (iOS/Android).
2. Abrir Expo Go y buscar el proyecto: `@polaris525/checkin-ocr`
3. O usar el desarrollo local: `npx expo start` y escanear el QR code.

### Web Build (Demo pública)

La aplicación web está disponible en:

Demo Web: https://frolicking-paletas-28a0ba.netlify.app/

Esta versión web permite probar el flujo completo en cualquier navegador. Nota: la funcionalidad de cámara puede estar limitada en algunos navegadores, pero el resto del flujo (formularios, validación, navegación) funciona completamente.

Para regenerar el build web:

```bash
npx expo export --platform web
```

Esto genera una carpeta `dist` que se puede subir a cualquier hosting estático (Netlify, Vercel, GitHub Pages, etc.).

## Publicación

La app fue publicada usando:

```bash
eas update --branch production --message "Initial release"
```

## Decisiones de diseño y trade-offs

- Se ha utilizado Context API para el estado del flujo (en vez de Redux u otras librerías) por simplicidad, dado el alcance reducido.
- La integración con Mindee se realiza directamente desde el cliente por claridad en la prueba; en un entorno real se recomienda un backend proxy para proteger la API Key.
- La validación de fechas y campos se ha mantenido simple (formato ISO básico) para no sobrecargar la prueba.
- i18n reducido: textos principales en español con un pequeño helper `t()` para facilitar una futura extensión a otros idiomas.