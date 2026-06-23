// Custom Interactive 3D Card Tilt Effect
(function() {
  const maxTilt = 15; // Max angle of rotation in degrees
  const scale = 1.03; // Card scaling on hover

  class TiltCard {
    constructor(element) {
      this.element = element;
      this.width = 0;
      this.height = 0;
      this.left = 0;
      this.top = 0;
      
      // Create glare overlay
      this.glare = document.createElement('div');
      this.glare.className = 'card-glare';
      this.element.appendChild(this.glare);

      // Bind events
      this.onMouseEnter = this.onMouseEnter.bind(this);
      this.onMouseMove = this.onMouseMove.bind(this);
      this.onMouseLeave = this.onMouseLeave.bind(this);

      this.init();
    }

    init() {
      this.element.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s ease';
      this.element.style.transformStyle = 'preserve-3d';
      
      // Ensure children have nested 3D capabilities if needed
      Array.from(this.element.children).forEach(child => {
        if (child !== this.glare) {
          child.style.transform = 'translateZ(20px)';
          child.style.transformStyle = 'preserve-3d';
        }
      });

      this.element.addEventListener('mouseenter', this.onMouseEnter);
      this.element.addEventListener('mousemove', this.onMouseMove);
      this.element.addEventListener('mouseleave', this.onMouseLeave);
    }

    updateDimensions() {
      const rect = this.element.getBoundingClientRect();
      this.width = rect.width;
      this.height = rect.height;
      this.left = rect.left;
      this.top = rect.top;
    }

    onMouseEnter() {
      this.updateDimensions();
      this.element.style.transition = 'transform 0.1s ease, box-shadow 0.3s ease';
      this.glare.style.opacity = '1';
    }

    onMouseMove(event) {
      // Calculate mouse coordinates relative to the card (ranges from -0.5 to 0.5)
      const mouseX = event.clientX - this.left;
      const mouseY = event.clientY - this.top;
      
      const xPercent = (mouseX / this.width) - 0.5;
      const yPercent = (mouseY / this.height) - 0.5;

      // Calculate tilt angles (rotateX depends on Y coordinate, rotateY on X coordinate)
      const tiltX = (yPercent * -maxTilt).toFixed(2);
      const tiltY = (xPercent * maxTilt).toFixed(2);

      // Apply 3D transform and scaling
      this.element.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(${scale}, ${scale}, ${scale})`;

      // Move the glare highlight matching the mouse
      const glareAngle = Math.atan2(mouseY - this.height / 2, mouseX - this.width / 2) * (180 / Math.PI);
      const glareOpacity = 0.15; // Limit brightness of reflection
      
      this.glare.style.background = `linear-gradient(${glareAngle - 180}deg, rgba(255, 255, 255, ${glareOpacity}) 0%, rgba(255, 255, 255, 0) 80%)`;
      this.glare.style.transform = `translateZ(10px)`;
    }

    onMouseLeave() {
      // Reset card rotation smoothly
      this.element.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.6s ease';
      this.element.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      this.glare.style.opacity = '0';
    }

    destroy() {
      this.element.removeEventListener('mouseenter', this.onMouseEnter);
      this.element.removeEventListener('mousemove', this.onMouseMove);
      this.element.removeEventListener('mouseleave', this.onMouseLeave);
      this.glare.remove();
    }
  }

  // Expose initialization function globally
  window.initTiltEffect = function(selector) {
    const cards = document.querySelectorAll(selector);
    cards.forEach(card => {
      // Avoid binding tilt multiple times
      if (!card.classList.contains('tilt-initialized')) {
        card.classList.add('tilt-initialized');
        new TiltCard(card);
      }
    });
  };
})();
