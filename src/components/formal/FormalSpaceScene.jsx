import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function FormalSpaceScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 120);
    camera.position.set(0, 0.8, 8.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const starGeometry = new THREE.BufferGeometry();
    const starCount = 900;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i += 1) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 26;
      positions[i3 + 1] = (Math.random() - 0.5) * 16;
      positions[i3 + 2] = -Math.random() * 24;
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({
        color: 0xd9fbff,
        size: 0.025,
        transparent: true,
        opacity: 0.72,
      }),
    );
    scene.add(stars);

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x9cefff,
      wireframe: true,
      transparent: true,
      opacity: 0.38,
    });
    const redMaterial = new THREE.MeshBasicMaterial({
      color: 0xff3434,
      wireframe: true,
      transparent: true,
      opacity: 0.42,
    });

    const torus = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.012, 8, 180), ringMaterial);
    torus.rotation.x = 1.18;
    torus.rotation.y = 0.14;
    group.add(torus);

    const torusTwo = new THREE.Mesh(new THREE.TorusGeometry(3.7, 0.01, 8, 220), redMaterial);
    torusTwo.rotation.x = 1.4;
    torusTwo.rotation.z = 0.6;
    group.add(torusTwo);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.95, 1),
      new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.52,
      }),
    );
    group.add(core);

    const satelliteGeometry = new THREE.SphereGeometry(0.055, 16, 16);
    const satelliteMaterial = new THREE.MeshBasicMaterial({ color: 0xff3434 });
    const satellites = Array.from({ length: 9 }, (_, index) => {
      const dot = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
      dot.userData.phase = (index / 9) * Math.PI * 2;
      dot.userData.radius = 2.2 + (index % 3) * 0.62;
      group.add(dot);
      return dot;
    });

    const pointer = { x: 0, y: 0 };
    const onPointerMove = (event) => {
      pointer.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

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
      group.rotation.x += (pointer.y * 0.08 - group.rotation.x) * 0.03;
      group.rotation.y += (pointer.x * 0.12 - group.rotation.y) * 0.03;
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
      mount.removeChild(renderer.domElement);
      starGeometry.dispose();
      ringMaterial.dispose();
      redMaterial.dispose();
      satelliteGeometry.dispose();
      satelliteMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div className="space-scene" ref={mountRef} aria-hidden="true" />;
}
