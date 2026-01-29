/* js/shaders.js */

// Register a custom shader for handling green screen video with transparency and opacity control
AFRAME.registerShader('chromakey', {
  schema: {
    src: { type: 'map', is: 'uniform' },
    // Default color is pure green. Adjust if your green screen is slightly different.
    color: { type: 'vec3', default: { x: 0.0, y: 1.0, z: 0.0 }, is: 'uniform' },
    // Similarity threshold: how close the pixel color must be to the key color to be transparent
    similarity: { type: 'float', default: 0.3, is: 'uniform' },
    // Smoothness: size of the transition edge to avoid jagged lines
    smoothness: { type: 'float', default: 0.1, is: 'uniform' },
    // Opacity: Global alpha multiplier for fade-in/out animations
    opacity: { type: 'float', default: 0.0, is: 'uniform' } 
  },

  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    uniform sampler2D src;
    uniform vec3 color;
    uniform float similarity;
    uniform float smoothness;
    uniform float opacity;
    varying vec2 vUv;

    void main() {
      // Sample the texture (video frame)
      vec4 texColor = texture2D(src, vUv);
      
      // Calculate Euclidean distance from the key color in RGB space
      float dist = length(texColor.rgb - color);
      
      // Create a mask: 0.0 if close to green, 1.0 if far from green
      // smoothstep creates a gradient between similarity and (similarity + smoothness)
      float mask = smoothstep(similarity, similarity + smoothness, dist);
      
      // Final color: Use original RGB, but multiply Alpha by the mask and the global opacity
      gl_FragColor = vec4(texColor.rgb, texColor.a * mask * opacity);
    }
  `
});