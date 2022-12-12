attribute float size;
attribute float opacity;
attribute vec3 color;

varying float vOpacity;
varying vec3 vColor;

void main() {
    // Color
    vColor = color;

    // Opacity
    vOpacity = opacity;

    // Position
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size;
    gl_Position = projectionMatrix * mvPosition;
}
