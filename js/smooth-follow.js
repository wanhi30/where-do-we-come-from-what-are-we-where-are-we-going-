AFRAME.registerComponent('smooth-follow', {
  schema: {
    target: {type: 'selector'},
    damping: {type: 'number', default: 0.1}, // Lower = Smoother/Heavier
    rotDamping: {type: 'number', default: 0.05} 
  },

  init: function () {
    this.targetVisible = false;
    
    // Listen for tracking events
    if (this.data.target) {
      this.data.target.addEventListener('targetFound', () => {
        this.targetVisible = true;
        // Snap immediately on first find to avoid "flying in"
        this.snapToTarget(); 
        this.el.object3D.visible = true;
      });
      
      this.data.target.addEventListener('targetLost', () => {
        this.targetVisible = false;
        // Don't hide immediately! Let video-controller handle the hiding.
      });
    }
  },

  snapToTarget: function () {
    const targetObj = this.data.target.object3D;
    this.el.object3D.position.copy(targetObj.position);
    this.el.object3D.quaternion.copy(targetObj.quaternion);
    this.el.object3D.scale.copy(targetObj.scale);
  },

  tick: function (t, dt) {
    if (!this.data.target) return;

    // Only move if tracking is active
    if (this.targetVisible) {
      const targetObj = this.data.target.object3D;
      const myObj = this.el.object3D;

      // Interpolate Position (LERP)
      myObj.position.lerp(targetObj.position, this.data.damping);

      // Interpolate Rotation (SLERP)
      myObj.quaternion.slerp(targetObj.quaternion, this.data.rotDamping);

      // Interpolate Scale
      myObj.scale.lerp(targetObj.scale, this.data.damping);
    }
    // If target is lost, we stop updating position. 
    // The video "freezes" in mid-air (Ghosting), just like Artivive.
  }
});
