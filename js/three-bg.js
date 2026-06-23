// Three.js Interactive 3D Background Scene
(function() {
  let scene, camera, renderer;
  let particleSystem, globeMesh;
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;
  const particleCount = 400;
  
  // Theme-specific colors
  const themes = {
    dark: {
      particleColor: 0x00f2fe, // Neon cyan
      globeColor: 0x7b2cbf,    // Bright purple
      ambientLight: 0xffffff
    },
    light: {
      particleColor: 0x4f46e5, // Deep Indigo
      globeColor: 0x0ea5e9,    // Sky Blue
      ambientLight: 0xffffff
    }
  };

  let currentTheme = 'dark';

  function init() {
    const container = document.getElementById('three-bg-container');
    if (!container) return;

    // Detect initial theme from document element
    currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';

    // 1. Scene setup
    scene = new THREE.Scene();

    // 2. Camera setup
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 85;

    // 3. Renderer setup - transparent to let CSS background show
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(themes[currentTheme].ambientLight, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1.2, 500);
    pointLight.position.set(50, 50, 50);
    scene.add(pointLight);

    // 5. Build Background Particle Dust
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = [];

    for (let i = 0; i < particleCount; i++) {
      // Position particles in a large sphere / box around the camera
      particlePositions[i * 3] = (Math.random() - 0.5) * 200;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 200;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 150 - 50;
      
      // Speed values for drift animation
      particleSpeeds.push({
        x: (Math.random() - 0.5) * 0.05,
        y: (Math.random() - 0.5) * 0.05,
        z: Math.random() * 0.05 + 0.02
      });
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    
    // Create soft round particle texture using HTML canvas
    const particleTexture = createCircleTexture(themes[currentTheme].particleColor);

    const particleMaterial = new THREE.PointsMaterial({
      size: 1.5,
      map: particleTexture,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
    particleSystem.userData.speeds = particleSpeeds;

    // 6. Build Neural/Globe Object in center-right (offset on desktop)
    const globeGeometry = new THREE.IcosahedronGeometry(28, 2);
    
    // Wireframe structure with glow
    const globeMaterial = new THREE.MeshBasicMaterial({
      color: themes[currentTheme].globeColor,
      wireframe: true,
      transparent: true,
      opacity: currentTheme === 'dark' ? 0.25 : 0.15
    });

    globeMesh = new THREE.Mesh(globeGeometry, globeMaterial);
    
    // Adjust starting position depending on screen width
    positionGlobe();
    scene.add(globeMesh);

    // Event Listeners
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
    
    // Expose theme toggling trigger globally
    window.updateThreeTheme = updateTheme;

    animate();
  }

  // Helper to draw soft circular texture dynamically
  function createCircleTexture(colorValue) {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    
    // Convert hex hex-number to CSS rgb
    const r = (colorValue >> 16) & 255;
    const g = (colorValue >> 8) & 255;
    const b = colorValue & 255;
    
    grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`);
    grad.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.5)`);
    grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);
    
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  }

  function positionGlobe() {
    if (window.innerWidth > 992) {
      globeMesh.position.set(25, 0, 0); // Position to the right on desktop to align with typography
    } else {
      globeMesh.position.set(0, 10, -10); // Center on mobile / tablets
    }
  }

  function onMouseMove(event) {
    // Standardize mouse positions to -1 to 1 coordinates
    targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
    targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    positionGlobe();
  }

  // Handle theme transitions dynamically from app.js
  function updateTheme(themeName) {
    if (themeName !== 'dark' && themeName !== 'light') return;
    currentTheme = themeName;

    // Transition globe color
    if (globeMesh) {
      globeMesh.material.color.setHex(themes[themeName].globeColor);
      globeMesh.material.opacity = themeName === 'dark' ? 0.25 : 0.15;
    }

    // Recreate particle texture to reflect theme color
    if (particleSystem) {
      const newTexture = createCircleTexture(themes[themeName].particleColor);
      particleSystem.material.map = newTexture;
      particleSystem.material.needsUpdate = true;
    }
  }

  function animate() {
    requestAnimationFrame(animate);

    // 1. Slow rotation of globe mesh
    if (globeMesh) {
      globeMesh.rotation.y += 0.002;
      globeMesh.rotation.x += 0.001;
    }

    // 2. Slow particle system movement
    if (particleSystem) {
      const positions = particleSystem.geometry.attributes.position.array;
      const speeds = particleSystem.userData.speeds;
      
      for (let i = 0; i < particleCount; i++) {
        // Apply drifting speed
        positions[i * 3] += speeds[i].x;
        positions[i * 3 + 1] += speeds[i].y;
        positions[i * 3 + 2] += speeds[i].z;

        // Reset particle if it drifts past the camera view
        if (positions[i * 3 + 2] > 70) {
          positions[i * 3] = (Math.random() - 0.5) * 200;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 200;
          positions[i * 3 + 2] = -100;
        }
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;
      particleSystem.rotation.y += 0.0003;
    }

    // 3. Smooth mouse tracking camera lag (inertia)
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    camera.position.x = mouseX * 25;
    camera.position.y = mouseY * 25;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  // Wait for scripts and content loading
  window.addEventListener('DOMContentLoaded', init);
})();
