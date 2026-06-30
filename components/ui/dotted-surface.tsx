'use client';
import { cn } from '@/lib/utils';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type DottedSurfaceProps = Omit<React.ComponentProps<'div'>, 'ref'>;

export function DottedSurface({ className, children, ...props }: DottedSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // ── Reduced grid from 60×60 (3 600 particles) → 30×30 (900 particles)
    const SEPARATION = 160;
    const AMOUNTX = 30;
    const AMOUNTY = 30;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 400, 1400);
    camera.lookAt(0, 0, 0);

    // ── Lower-cost renderer settings
    const pixelRatio = Math.min(window.devicePixelRatio, 1.5);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,           // skip AA — dots don't need it
      powerPreference: 'low-power',
    });
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Build particles
    const numParticles = AMOUNTX * AMOUNTY;
    const positions = new Float32Array(numParticles * 3);
    const colors = new Float32Array(numParticles * 3);
    const sizes = new Float32Array(numParticles);

    let i = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        positions[i * 3] = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
        colors[i * 3] = 0.47;     // R (violet base)
        colors[i * 3 + 1] = 0.36; // G
        colors[i * 3 + 2] = 1.0;  // B
        sizes[i] = 4;
        i++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom shader for variable-size glowing dots
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: pixelRatio },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vSize;
        uniform float uPixelRatio;
        void main() {
          vColor = color;
          vSize = size;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * uPixelRatio * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vSize;
        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
          // Glow effect
          float glow = exp(-dist * 4.0) * 0.5;
          gl_FragColor = vec4(vColor, (alpha * 0.7 + glow) * 0.9);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let count = 0;
    let animationId: number;

    // ── Throttled mouse tracking (fire at most every 16 ms ≈ 60 fps)
    let lastMouseTime = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastMouseTime < 16) return;
      lastMouseTime = now;
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // ── Throttle rendering to ~30 fps (every 33 ms) to halve GPU work
    let lastFrameTime = 0;
    const FRAME_INTERVAL = 33; // ms

    const animate = (now: number) => {
      animationId = requestAnimationFrame(animate);

      const delta = now - lastFrameTime;
      if (delta < FRAME_INTERVAL) return;
      lastFrameTime = now - (delta % FRAME_INTERVAL);

      const posArr = geometry.attributes.position.array as Float32Array;
      const colorArr = geometry.attributes.color.array as Float32Array;
      const sizeArr = geometry.attributes.size.array as Float32Array;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      let idx = 0;
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const pi = idx * 3;

          // Wave animation
          const waveHeight =
            Math.sin((ix + count) * 0.3) * 50 +
            Math.sin((iy + count) * 0.5) * 50;

          // Cursor influence — compute distance from cursor in normalized grid space
          const gridX = (ix / AMOUNTX) * 2 - 1;
          const gridY = (iy / AMOUNTY) * 2 - 1;
          const cursorDist = Math.sqrt((gridX - mx) ** 2 + (gridY - my) ** 2);
          const cursorInfluence = Math.max(0, 1 - cursorDist / 0.4); // Radius of influence
          const cursorPush = cursorInfluence * 120; // Height boost from cursor

          posArr[pi + 1] = waveHeight + cursorPush;

          // Color shift near cursor: transition from violet→cyan→white
          const t = cursorInfluence;
          if (t > 0) {
            // Violet (0.47, 0.36, 1.0) → Cyan (0.0, 0.9, 0.9) → White
            const t2 = Math.min(t * 1.5, 1);
            colorArr[pi]     = 0.47 + t2 * 0.53; // → 1.0
            colorArr[pi + 1] = 0.36 + t2 * 0.64; // → 1.0
            colorArr[pi + 2] = 1.0;
            sizeArr[idx] = 4 + t * 12; // Grow near cursor
          } else {
            colorArr[pi]     = 0.47;
            colorArr[pi + 1] = 0.36;
            colorArr[pi + 2] = 1.0;
            sizeArr[idx] = 4;
          }

          idx++;
        }
      }

      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;
      geometry.attributes.size.needsUpdate = true;

      renderer.render(scene, camera);
      count += 0.07;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={cn('pointer-events-none absolute inset-0 -z-1', className)} {...props}>
      {children}
    </div>
  );
}
