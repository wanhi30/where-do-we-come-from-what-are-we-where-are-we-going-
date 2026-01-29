AFRAME.registerComponent('video-controller', {
  schema: {
    target: {type: 'selector'},
    video: {type: 'selector'},
    persistence: {type: 'number', default: 1000} // Time in ms to stay visible after lost
  },

  init: function() {
    this.video = this.data.video;
    this.lostTimer = null;
    
    // Bind Methods
    this.onFound = this.onFound.bind(this);
    this.onLost = this.onLost.bind(this);

    // Event Listeners
    this.data.target.addEventListener('targetFound', this.onFound);
    this.data.target.addEventListener('targetLost', this.onLost);
    
    // Start hidden
    this.el.object3D.visible = false;
  },

  onFound: function() {
    // Clear any pending hide timers
    if (this.lostTimer) clearTimeout(this.lostTimer);
    
    // Make visible and play
    this.el.object3D.visible = true;
    this.el.setAttribute('animation', 'property: opacity; to: 1; dur: 300; easing: easeOutQuad');
    
    // Try to play (will work if user clicked Start button)
    this.video.play().catch(e => console.log("Autoplay blocked waiting for interaction"));
  },

  onLost: function() {
    // Wait before hiding (Persistence)
    this.lostTimer = setTimeout(() => {
      this.video.pause();
      this.el.object3D.visible = false;
    }, this.data.persistence);
  },

  tick: function() {
    // TEXTURE FIX: Force Three.js to update the video texture every frame
    // This prevents the "Black Screen" bug on many Android devices
    const mesh = this.el.querySelector('#video-plane').getObject3D('mesh');
    if (mesh && mesh.material.map) {
      mesh.material.map.needsUpdate = true;
    }
  }
});
