  function initCrystal(canvasId, opts) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const mainSize = opts.mainSize || 2.1;
    const withShards = opts.withShards !== false;
    const camZ = opts.camZ || 7.5;

    let W = canvas.clientWidth || 300, H = canvas.clientHeight || 300;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, W/H, 0.1, 100);
    camera.position.set(0, 0, camZ);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H, false);

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const keyLight = new THREE.PointLight(0xC4335A, 3.2, 20);
    keyLight.position.set(4, 3, 5);
    scene.add(keyLight);
    const fillLight = new THREE.PointLight(0xE5A85C, 2.4, 20);
    fillLight.position.set(-4, -2, 4);
    scene.add(fillLight);
    if (withShards) {
      const rimLight = new THREE.PointLight(0xffffff, 1.6, 20);
      rimLight.position.set(0, 5, -5);
      scene.add(rimLight);
    }

    const group = new THREE.Group();
    scene.add(group);

    function makeCrystal(size, colorA) {
      const geo = new THREE.IcosahedronGeometry(size, 0);
      const mat = new THREE.MeshPhysicalMaterial({
        color: 0x1a0f12, transparent:true, opacity:0.42,
        roughness:0.08, metalness:0.05, clearcoat:1, clearcoatRoughness:0.05,
        side: THREE.DoubleSide, reflectivity:0.9
      });
      const mesh = new THREE.Mesh(geo, mat);
      const edges = new THREE.EdgesGeometry(geo);
      const lineMat = new THREE.LineBasicMaterial({ color: colorA, transparent:true, opacity:0.8 });
      const wire = new THREE.LineSegments(edges, lineMat);
      mesh.add(wire);
      return mesh;
    }

    const mainCrystal = makeCrystal(mainSize, 0xE5A85C);
    group.add(mainCrystal);

    let shard1, shard2;
    if (withShards) {
      shard1 = makeCrystal(mainSize * 0.26, 0xC4335A);
      shard1.position.set(-mainSize * 1.24, mainSize * 0.76, 1.2);
      group.add(shard1);
      shard2 = makeCrystal(mainSize * 0.19, 0xE5A85C);
      shard2.position.set(mainSize * 1.1, -mainSize * 0.67, -0.6);
      group.add(shard2);
    }

    group.rotation.x = 0.4;
    group.rotation.y = 0.6;

    let isVisible = true;
    let rafId = null;

    function animate() {
      rafId = requestAnimationFrame(animate);
      if (!isVisible) return;
      group.rotation.y += 0.0032;
      group.rotation.x += 0.0008;
      if (shard1) shard1.rotation.y -= 0.006;
      if (shard2) shard2.rotation.x += 0.005;
      renderer.render(scene, camera);
    }
    animate();

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { isVisible = entry.isIntersecting; });
      }, { threshold: 0.01 });
      observer.observe(canvas);
    }

    function resize() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      if (!W || !H) return;
      camera.aspect = W / H; camera.updateProjectionMatrix();
      renderer.setSize(W, H, false);
    }
    window.addEventListener('resize', resize);
    setTimeout(resize, 50);
  }

