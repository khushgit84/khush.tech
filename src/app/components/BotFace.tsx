import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

// Floating white companion bot: oval head with glowing screen face, egg body, paddle arms.
// The head and eyes follow the cursor, it blinks, bobs and waves. Pauses off-screen.
export const BotFace = ({ className = '' }: { className?: string }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isMobile = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 2 : 1.5));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = !isMobile;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.02).texture;
    scene.environment = envTex;

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0.15, 10);
    camera.lookAt(0, 0.15, 0);

    // Studio lighting: soft sky/ground fill, warm key, cool fill, subtle colored rims
    scene.add(new THREE.HemisphereLight(0xdfe8f5, 0x2a2440, 0.6));
    const key = new THREE.DirectionalLight(0xfff4e8, 2.2);
    key.position.set(3, 4, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.radius = 4;
    key.shadow.bias = -0.0005;
    const fill = new THREE.DirectionalLight(0xc7d7ff, 0.7);
    fill.position.set(-4, 1, 3);
    scene.add(fill);
    scene.add(key);
    const rimA = new THREE.PointLight(0x8b5cf6, 18, 20);
    rimA.position.set(-4, 2, -2);
    const rimB = new THREE.PointLight(0x22d3ee, 14, 20);
    rimB.position.set(4, -1, -2);
    scene.add(rimA, rimB);

    // Materials: glossy white plastic, chrome trim, dark seams
    const shell = new THREE.MeshStandardMaterial({ color: 0xeef0f3, metalness: 0.05, roughness: 0.2, envMapIntensity: 1.4 });
    const joint = new THREE.MeshStandardMaterial({ color: 0x8a929c, metalness: 1, roughness: 0.38 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x1f2329, metalness: 0.3, roughness: 0.5 });

    const robot = new THREE.Group();
    scene.add(robot);
    const head = new THREE.Group();
    head.position.y = 1.05;
    robot.add(head);

    // Head: wide, soft oval shell
    const skull = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 96), shell);
    skull.scale.set(1.3, 1.05, 1.05);
    skull.castShadow = true;
    head.add(skull);

    // Screen face: dark glossy oval set into the front of the head
    const screenMat = new THREE.MeshStandardMaterial({ color: 0x0b0e16, metalness: 0.3, roughness: 0.08, envMapIntensity: 0.6 });
    // Project a point (x, y) onto the front of the head ellipsoid (1.3 x 1.05 x 1.05)
    const surfZ = (x: number, y: number, lift: number) =>
      1.05 * Math.sqrt(Math.max(0, 1 - (x / 1.3) ** 2 - (y / 1.05) ** 2)) + lift;
    const screenShape = new THREE.RingGeometry(0, 1, 128, 24);
    screenShape.scale(0.98, 0.66, 1);
    const sp = screenShape.getAttribute('position');
    for (let i = 0; i < sp.count; i++) sp.setZ(i, surfZ(sp.getX(i), sp.getY(i), 0.006));
    screenShape.computeVertexNormals();
    const screen = new THREE.Mesh(screenShape, screenMat);
    head.add(screen);

    // Gradient bezel (violet to blue) around the screen
    const bezelGeo = new THREE.TorusGeometry(1, 0.035, 16, 160);
    const cols: number[] = [];
    const pos = bezelGeo.getAttribute('position');
    const cA = new THREE.Color(0xa855f7), cB = new THREE.Color(0x38bdf8), tmp = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const k = (pos.getX(i) + pos.getY(i) * 0.5 + 1.5) / 3;
      tmp.copy(cA).lerp(cB, Math.min(1, Math.max(0, k)));
      cols.push(tmp.r * 2.2, tmp.g * 2.2, tmp.b * 2.2);
    }
    bezelGeo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    bezelGeo.scale(1.0, 0.68, 1);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), dz = pos.getZ(i);
      pos.setZ(i, surfZ(x, y, 0.012) + dz);
    }
    bezelGeo.computeVertexNormals();
    const bezel = new THREE.Mesh(bezelGeo, new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false }));
    head.add(bezel);

    // Glowing "happy" arc eyes (^ ^) that drift with the cursor
    const eyeGlow = new THREE.MeshBasicMaterial({ color: 0x9cc8ff, toneMapped: false });
    const lenses: THREE.Group[] = [];
    const eyeGroups: THREE.Group[] = [];
    const face = new THREE.Group();
    face.position.z = 0;
    head.add(face);
    [-0.36, 0.36].forEach((x) => {
      const g = new THREE.Group();
      g.position.set(x, 0.02, surfZ(x, 0.02, 0.02));
      g.rotation.y = Math.asin(x / 1.3) * 0.9;
      const arc = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.035, 12, 48, Math.PI), eyeGlow);
      arc.rotation.z = 0;
      const halo = new THREE.Mesh(
        new THREE.CircleGeometry(0.28, 32),
        new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false })
      );
      halo.position.set(0, 0.06, -0.01);
      g.add(halo, arc);
      face.add(g);
      eyeGroups.push(g);
    });
    lenses.push(face);
    const screenLight = new THREE.PointLight(0x7aa7ff, 1.5, 2.5);
    screenLight.position.set(0, 0, 1.6);
    head.add(screenLight);

    // Body: egg-shaped lower half with flat top and chrome band
    const bodyGeo = new THREE.SphereGeometry(1, 96, 64, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const body = new THREE.Mesh(bodyGeo, shell);
    body.scale.set(1.15, 1.45, 1.05);
    body.position.y = -0.35;
    body.castShadow = true;
    robot.add(body);
    const lid = new THREE.Mesh(new THREE.CircleGeometry(1, 96), shell);
    lid.rotation.x = -Math.PI / 2;
    lid.scale.set(1.15, 1.05, 1);
    lid.position.y = -0.35;
    robot.add(lid);
    const band = new THREE.Mesh(new THREE.TorusGeometry(1, 0.025, 12, 128), joint);
    band.rotation.x = Math.PI / 2;
    band.scale.set(1.15, 1.05, 1);
    band.position.y = -0.37;
    robot.add(band);
    // Soft "smile" panel seam across the belly
    const smile = new THREE.Mesh(new THREE.TorusGeometry(1, 0.006, 6, 96, Math.PI * 0.62), dark);
    smile.rotation.set(Math.PI / 2 + 0.55, 0, Math.PI * 0.19);
    smile.scale.set(1.16, 1.06, 1);
    smile.position.set(0, -0.95, 0);
    robot.add(smile);

    // Floating paddle arms (detached, like the reference)
    const makeArm = (s: number) => {
      const shoulder = new THREE.Group();
      shoulder.position.set(s * 1.45, -0.45, 0);
      const elbow = new THREE.Group();
      const paddle = new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 0.95, 12, 32), shell);
      paddle.scale.set(1, 1, 0.65);
      paddle.position.y = -0.45;
      paddle.castShadow = true;
      const cuff = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.006, 6, 48), dark);
      cuff.rotation.x = Math.PI / 2;
      cuff.scale.set(1, 0.65, 1);
      cuff.position.y = -0.25;
      elbow.add(paddle, cuff);
      shoulder.add(elbow);
      shoulder.rotation.z = s * 0.28;
      robot.add(shoulder);
      return { shoulder, elbow };
    };
    const leftArm = makeArm(-1);
    const rightArm = makeArm(1);

    // Shadow catcher
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), new THREE.ShadowMaterial({ opacity: 0.25 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -2.25;
    floor.receiveShadow = true;
    scene.add(floor);

    robot.position.y = 0.25;

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      // Fit the ~5.2-unit-tall robot both vertically and horizontally
      const fov = THREE.MathUtils.degToRad(camera.fov);
      const fitH = 3.1 / Math.tan(fov / 2);
      const fitW = 2.5 / (Math.tan(fov / 2) * camera.aspect);
      camera.position.z = Math.max(fitH, fitW) + 0.2;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const mouse = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      const r = mount.getBoundingClientRect();
      mouse.x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2)));
      mouse.y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)));
    };
    let lastMove = -10;
    const onAny = (e: PointerEvent) => { onMove(e); lastMove = performance.now() / 1000; };
    window.addEventListener('pointermove', onAny, { passive: true });
    window.addEventListener('pointerdown', onAny, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    io.observe(mount);

    let nextBlink = 2;
    let raf = 0;
    const tick = (now = 0) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const t = now / 1000;

      // No recent cursor/touch (e.g. phones): glance around on its own
      if (t - lastMove > 3) {
        mouse.x += (Math.sin(t * 0.5) * 0.6 - mouse.x) * 0.03;
        mouse.y += (Math.sin(t * 0.37) * 0.25 - mouse.y) * 0.03;
      }

      head.rotation.y += (mouse.x * 0.45 - head.rotation.y) * 0.08;
      head.rotation.x += (mouse.y * 0.22 - head.rotation.x) * 0.08;
      head.rotation.z += (-mouse.x * 0.12 - head.rotation.z) * 0.05;
      robot.rotation.y += (mouse.x * 0.25 - robot.rotation.y) * 0.05;
      robot.position.y = 0.25 + Math.sin(t * 1.6) * 0.1;

      lenses.forEach((l) => {
        l.position.x += (mouse.x * 0.12 - l.position.x) * 0.15;
        l.position.y += (-mouse.y * 0.08 - l.position.y) * 0.15;
      });

      // Arms float and sway; right arm gives a little wave now and then
      const wave = Math.max(0, Math.sin(t * 0.6)) ** 6;
      leftArm.shoulder.position.y = -0.45 + Math.sin(t * 1.6 + 1) * 0.05;
      rightArm.shoulder.position.y = -0.45 + Math.sin(t * 1.6 + 2) * 0.05;
      leftArm.shoulder.rotation.z = -0.28 - Math.sin(t * 1.3) * 0.05;
      rightArm.shoulder.rotation.z = 0.28 + Math.sin(t * 1.3) * 0.05 + wave * (2.2 + Math.sin(t * 9) * 0.25);
      head.position.y = 1.05 + Math.sin(t * 1.6 + 0.6) * 0.03;

      // Blink: squash the arc eyes
      let open = 1;
      if (t > nextBlink) {
        const k = (t - nextBlink) / 0.18;
        if (k >= 1) nextBlink = t + 2.5 + Math.random() * 3;
        else open = Math.abs(1 - 2 * k);
      }
      eyeGroups.forEach((e) => (e.scale.y = Math.max(0.15, open)));
      eyeGlow.color.setHSL(0.6, 1, 0.78 + Math.sin(t * 2) * 0.05);

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onAny);
      window.removeEventListener('pointerdown', onAny);
      scene.traverse((o: any) => {
        o.geometry?.dispose();
        o.material?.dispose();
      });
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={className || "relative"} />;
};
