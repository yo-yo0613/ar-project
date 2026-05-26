import 'aframe';

if (typeof AFRAME !== 'undefined' && !AFRAME.components['dynamic-sprite']) {
  AFRAME.registerComponent('dynamic-sprite', {
    schema: {
      state: { type: 'string', default: 'idle' },
      front: { type: 'string', default: '/companion_idle.png' },
      side: { type: 'string', default: '/companion_idle.png' },
      back: { type: 'string', default: '/companion_idle.png' }
    },
    tick: function () {
      const cameraEl = this.el.sceneEl.camera.el;
      if (!cameraEl) return;
      
      const object3D = this.el.object3D;
      const camera3D = cameraEl.object3D;

      // Get camera position in local space of the marker
      const localCameraPos = object3D.worldToLocal(camera3D.position.clone());
      
      // Calculate angle in degrees
      const angle = Math.atan2(localCameraPos.x, localCameraPos.z);
      const angleDeg = angle * (180 / Math.PI);

      let currentView = 'front';
      
      // Determine which side of the marker the camera is looking from
      if (angleDeg > -45 && angleDeg <= 45) {
        currentView = this.data.front;
      } else if (angleDeg > 45 && angleDeg <= 135) {
        currentView = this.data.side; 
      } else if (angleDeg < -45 && angleDeg >= -135) {
        currentView = this.data.side; // Left side uses same side image for now
      } else {
        currentView = this.data.back;
      }

      // Update the material src only if it changes
      const currentSrc = this.el.getAttribute('material')?.src;
      if (currentSrc !== currentView) {
        this.el.setAttribute('material', 'src', currentView);
        // Optionally flip horizontally if on the left side
        if (angleDeg < -45 && angleDeg >= -135) {
           this.el.object3D.scale.set(-1, 1, 1);
        } else {
           this.el.object3D.scale.set(1, 1, 1);
        }
      }

      // Billboarding: Make the 2D plane always face the camera!
      this.el.object3D.lookAt(camera3D.position);
    }
  });
}
