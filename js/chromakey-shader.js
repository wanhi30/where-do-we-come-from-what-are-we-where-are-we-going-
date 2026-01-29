AFRAME.registerShader('chromakey', {
  schema: {
    src: {type: 'map', is: 'uniform'},
    color: {type: 'vec3', default: {x: 0.0, y: 1.0, z: 0.0}, is: 'uniform'},
    threshold: {type: 'float', default: 0.1, is: 'uniform'},
    smoothness: {type: 'float', default: 0.1, is: 'uniform'}
  },

  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,

  fragmentShader: `
    precision mediump float;
    uniform sampler2D src;
    uniform vec3 color;
    uniform float threshold;
    uniform float smoothness;
    varying vec2 vUv;

    void main() {
      vec4 texel = texture2D(src, vUv);
      
      // Calculate distance between pixel color and key color
      vec3 diff = texel.rgb - color;
      float dist = length(diff);
      
      // Smooth alpha blending to avoid jagged edges
      float alpha = smoothstep(threshold, threshold + smoothness, dist);
      
      // Optimization: Discard fully transparent pixels to save depth buffer
      if (alpha < 0.02) discard;

      // Output the pixel with calculated alpha
      gl_FragColor = vec4(texel.rgb, texel.a * alpha);
    }
  `
});
