import React, { useEffect, useRef } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  GridHelper,
  Group,
  IcosahedronGeometry,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
} from "three";

export default function FormalSpaceScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new Scene();
    const camera = new PerspectiveCamera(55, 1, 0.1, 120);
    camera.position.set(0, 0.8, 8.5);

    const renderer = new WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const group = new Group();
    scene.add(group);

    const tunnel = new Group();
    tunnel.position.z = -4;
    scene.add(tunnel);

    const starGeometry = new BufferGeometry();
    const starCount = window.innerWidth < 720 ? 420 : 620;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i += 1) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 26;
      positions[i3 + 1] = (Math.random() - 0.5) * 16;
      positions[i3 + 2] = -Math.random() * 24;
    }
    starGeometry.setAttribute("position", new BufferAttribute(positions, 3));
    const stars = new Points(
      starGeometry,
      new PointsMaterial({
        color: 0xd9fbff,
        size: 0.025,
        transparent: true,
        opacity: 0.72,
      }),
    );
    scene.add(stars);

    const grid = new GridHelper(18, 24, 0xff3434, 0x1d5f68);
    grid.position.set(0, -3.35, -4.5);
    grid.material.transparent = true;
    grid.material.opacity = 0.24;
    scene.add(grid);

    const tunnelMaterial = new LineBasicMaterial({
      color: 0x8ff7ff,
      transparent: true,
      opacity: 0.13,
    });
    for (let i = 0; i < 7; i += 1) {
      const radius = 1.4 + i * 0.42;
      const points = Array.from({ length: 7 }, (_, index) => {
        const angle = (index / 6) * Math.PI * 2;
        return new Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, -i * 0.7);
      });
      const geometry = new BufferGeometry().setFromPoints(points);
      const loop = new Line(geometry, tunnelMaterial);
      loop.rotation.z = i * 0.14;
      tunnel.add(loop);
    }

    const ringMaterial = new MeshBasicMaterial({
      color: 0x9cefff,
      wireframe: true,
      transparent: true,
      opacity: 0.38,
    });
    const redMaterial = new MeshBasicMaterial({
      color: 0xff3434,
      wireframe: true,
      transparent: true,
      opacity: 0.42,
    });

    const torus = new Mesh(new TorusGeometry(2.6, 0.012, 6, 120), ringMaterial);
    torus.rotation.x = 1.18;
    torus.rotation.y = 0.14;
    group.add(torus);

    const torusTwo = new Mesh(new TorusGeometry(3.7, 0.01, 6, 140), redMaterial);
    torusTwo.rotation.x = 1.4;
    torusTwo.rotation.z = 0.6;
    group.add(torusTwo);

    const core = new Mesh(
      new IcosahedronGeometry(0.95, 0),
      new MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.52,
      }),
    );
    group.add(core);

    const satelliteGeometry = new SphereGeometry(0.055, 10, 8);
    const satelliteMaterial = new MeshBasicMaterial({ color: 0xff3434 });
    const satellites = Array.from({ length: 9 }, (_, index) => {
      const dot = new Mesh(satelliteGeometry, satelliteMaterial);
      dot.userData.phase = (index / 9) * Math.PI * 2;
      dot.userData.radius = 2.2 + (index % 3) * 0.62;
      group.add(dot);
      return dot;
    });

    const pointer = { x: 0, y: 0 };
    let scrollTarget = 0;
    let scrollProgress = 0;
    const onPointerMove = (event) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    const onScroll = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      scrollTarget = Math.min(Math.max(window.scrollY / max, 0), 1);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      renderer.setSize(clientWidth, clientHeight, false);
      camera.aspect = clientWidth / Math.max(clientHeight, 1);
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    let frame = 0;
    let raf = 0;
    const animate = () => {
      frame += 0.008;
      scrollProgress += (scrollTarget - scrollProgress) * 0.045;
      camera.position.z += (8.5 - scrollProgress * 1.8 - camera.position.z) * 0.025;
      camera.position.y += (0.8 - scrollProgress * 1.55 - camera.position.y) * 0.025;
      group.rotation.x += (pointer.y * 0.08 - group.rotation.x) * 0.03;
      group.rotation.y += (pointer.x * 0.12 - group.rotation.y) * 0.03;
      group.position.x += ((scrollProgress - 0.5) * -1.1 - group.position.x) * 0.025;
      group.scale.setScalar(1 + scrollProgress * 0.22);
      tunnel.rotation.z -= 0.0014 + scrollProgress * 0.0018;
      tunnel.position.z = -4 + scrollProgress * 1.6;
      grid.position.z = -4.5 + scrollProgress * 1.8;
      torus.rotation.z += 0.0018;
      torusTwo.rotation.z -= 0.0012;
      core.rotation.x += 0.003;
      core.rotation.y += 0.0045;
      stars.rotation.y += 0.00035;

      satellites.forEach((dot) => {
        const phase = frame + dot.userData.phase;
        const radius = dot.userData.radius;
        dot.position.set(
          Math.cos(phase) * radius,
          Math.sin(phase * 0.82) * 0.8,
          Math.sin(phase) * radius * 0.42,
        );
      });

      renderer.render(scene, camera);
      raf = window.requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      mount.removeChild(renderer.domElement);
      starGeometry.dispose();
      tunnel.children.forEach((line) => line.geometry.dispose());
      tunnelMaterial.dispose();
      grid.geometry.dispose();
      if (Array.isArray(grid.material)) {
        grid.material.forEach((material) => material.dispose());
      } else {
        grid.material.dispose();
      }
      ringMaterial.dispose();
      redMaterial.dispose();
      satelliteGeometry.dispose();
      satelliteMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div className="space-scene" ref={mountRef} aria-hidden="true" />;
}
