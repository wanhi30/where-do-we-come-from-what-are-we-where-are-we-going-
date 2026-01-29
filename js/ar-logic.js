/* js/ar-logic.js */

AFRAME.registerComponent('ar-controller', {
  init: function () {
    // Cache references to DOM elements for performance
    const video = document.querySelector("#ar-video");
    const target = document.querySelector("#ar-target");
    const displayEntity = document.querySelector("#video-display");

    // Ensure video is ready for inline playback
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    // --- EVENT: TARGET FOUND ---
    target.addEventListener("targetFound", event => {
      console.log("Target Found: Starting playback sequence");
      
      // 1. Attempt to play the video
      video.play().catch(e => {
        console.warn("Autoplay blocked or failed:", e);
        // In a strict 'no UI' environment, we can't do much if blocked, 
        // but 'muted' usually allows it.
      });

      // 2. Trigger Fade-In Animation
      // We animate the 'opacity' uniform of our custom shader
      displayEntity.removeAttribute('animation__fadeout');
      displayEntity.setAttribute('animation__fadein', {
        property: 'material.opacity',
        from: 0.0,
        to: 1.0,
        dur: 1500,           // 1.5 second fade for smoothness
        easing: 'easeInOutQuad',
        startEvents: 'startFadeIn' // We will trigger this manually
      });
      
      displayEntity.emit('startFadeIn');
    });

    // --- EVENT: TARGET LOST ---
    target.addEventListener("targetLost", event => {
      console.log("Target Lost: Pausing sequence");
      
      // 1. Pause video
      video.pause();

      // 2. Trigger Fade-Out (optional, but cleaner than snapping off)
      displayEntity.removeAttribute('animation__fadein');
      displayEntity.setAttribute('animation__fadeout', {
        property: 'material.opacity',
        from: 1.0,
        to: 0.0,
        dur: 300,            // Faster fade out
        easing: 'linear',
        startEvents: 'startFadeOut'
      });
      
      displayEntity.emit('startFadeOut');
    });
  }
});