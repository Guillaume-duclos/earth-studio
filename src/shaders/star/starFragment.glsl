uniform vec3 color;
varying vec3 vColor;
varying float vOpacity;

void main() {
    gl_FragColor = vec4(color * vColor, vOpacity);
}
