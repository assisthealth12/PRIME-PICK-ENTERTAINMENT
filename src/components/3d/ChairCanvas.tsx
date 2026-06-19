"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function ChairModel() {
  const { scene } = useGLTF("/Director_chair.glb");
  const modelRef = useRef<THREE.Object3D>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates from -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      setMouse({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (modelRef.current) {
      // Smoothly rotate the chair based on mouse position
      const targetRotationY = mouse.x * (Math.PI * 0.5); // Slower, restricted rotation range
      const targetRotationX = -mouse.y * 0.1; // Very slight tilt

      modelRef.current.rotation.y = THREE.MathUtils.lerp(modelRef.current.rotation.y, targetRotationY, 0.5 * delta);
      modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, targetRotationX, 0.5 * delta);
    }

    // Dynamically adjust zoom based on browser pixel ratio so the 3D model scales with browser zoom
    if (state.camera instanceof THREE.PerspectiveCamera) {
      const targetZoom = window.devicePixelRatio;
      if (state.camera.zoom !== targetZoom) {
        state.camera.zoom = targetZoom;
        state.camera.updateProjectionMatrix();
      }
    }
  });

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Apply a subtle light gray "watermark" sculpture look
          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#EAEAEA"), // Light gray matching the background
            metalness: 0.1,
            roughness: 0.9,
            transparent: true,
            opacity: 0.8, // Solid enough to see, but light enough to not block dark text
          });
        }
      });
    }
  }, [scene]);

  return <primitive ref={modelRef} object={scene} scale={isMobile ? 1.6 : 2.8} position={isMobile ? [0, -0.4, 0] : [0, -0.8, 0]} />;
}

export function ChairCanvas() {
  return (
    <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
      <Canvas camera={{ position: [0, 1, 7], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 10]} intensity={2} color="#D4AF37" />
        <Environment preset="city" />
        <Suspense fallback={null}>
          <ChairModel />
        </Suspense>
      </Canvas>
    </div>
  );
}
