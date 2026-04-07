# Sesión 3 - Práctica 3.1

Escena en Three.js con dos cubos para comparar:

- Cubo izquierdo: textura base (`map`).
- Cubo derecho: textura base + mapa topológico (`bumpMap`) con control de `bumpScale`.

La escena incluye:

- Rotación animada de ambos cubos sobre eje `y`.
- Iluminación para apreciar relieve.
- Controles de cámara (orbitales).
- Diferencia visual clara con `bumpScale` fijo en el cubo derecho.

## Uso

1. Instalar dependencias:
   - `npm install`
2. Compilar:
   - `npm run build`
3. Ejecutar servidor de desarrollo:
   - `npm start`

Abrir `prac3-1.html`.

## Práctica 3.2 - Textura de vídeo

Escena con un plano texturizado con vídeo usando:

- Elemento `<video>` oculto en HTML.
- Canvas intermedio (`480x204`) para copiar cada frame.
- Textura de Three.js actualizada en animación (`texture.needsUpdate = true`).
- Overlay con botón para cumplir la restricción de interacción del navegador antes de `video.play()`.

Recursos:

- `videos/sintel.mp4`
- `videos/sintel.ogv`

Abrir `prac3-2.html`.
