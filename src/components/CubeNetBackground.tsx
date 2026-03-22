"use client";

import { useEffect, useRef } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export default function CubeNetBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Cube wireframe vertices
    const cubeVertices: Point3D[] = [
      { x: -1, y: -1, z: -1 }, { x: 1, y: -1, z: -1 },
      { x: 1, y: 1, z: -1 },  { x: -1, y: 1, z: -1 },
      { x: -1, y: -1, z: 1 },  { x: 1, y: -1, z: 1 },
      { x: 1, y: 1, z: 1 },   { x: -1, y: 1, z: 1 },
    ];

    // Cube edges
    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0], // back face
      [4, 5], [5, 6], [6, 7], [7, 4], // front face
      [0, 4], [1, 5], [2, 6], [3, 7], // connecting edges
    ];

    // 3D rotation
    const rotateX = (p: Point3D, angle: number): Point3D => ({
      x: p.x,
      y: p.y * Math.cos(angle) - p.z * Math.sin(angle),
      z: p.y * Math.sin(angle) + p.z * Math.cos(angle),
    });
    const rotateY = (p: Point3D, angle: number): Point3D => ({
      x: p.x * Math.cos(angle) + p.z * Math.sin(angle),
      y: p.y,
      z: -p.x * Math.sin(angle) + p.z * Math.cos(angle),
    });
    const rotateZ = (p: Point3D, angle: number): Point3D => ({
      x: p.x * Math.cos(angle) - p.y * Math.sin(angle),
      y: p.x * Math.sin(angle) + p.y * Math.cos(angle),
      z: p.z,
    });

    // Perspective projection
    const project = (p: Point3D, fov: number, cx: number, cy: number): { x: number; y: number; scale: number } => {
      const z = p.z + 5;
      const scale = fov / z;
      return { x: cx + p.x * scale, y: cy + p.y * scale, scale };
    };

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const cubeSize = Math.min(W, H) * 0.06;
      const spacing = cubeSize * 4.5;
      const cols = Math.ceil(W / spacing) + 2;
      const rows = Math.ceil(H / spacing) + 2;

      const centerX = W / 2;
      const centerY = H / 2;
      const maxDist = Math.sqrt(centerX * centerX + centerY * centerY);

      for (let row = -1; row < rows; row++) {
        for (let col = -1; col < cols; col++) {
          const gridX = col * spacing + Math.sin(time * 0.3 + row * 0.5) * 8;
          const gridY = row * spacing + Math.cos(time * 0.25 + col * 0.4) * 8;

          // Distance from center for fade
          const dx = gridX - centerX;
          const dy = gridY - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const fadeAlpha = Math.max(0, 1 - dist / (maxDist * 0.85));
          
          if (fadeAlpha < 0.01) continue;

          // Individual cube rotation (slightly different per cube)
          const rotSpeed = 0.2;
          const phaseOffset = (col + row) * 0.8;
          const rx = time * rotSpeed * 0.7 + phaseOffset;
          const ry = time * rotSpeed + phaseOffset * 0.5;
          const rz = time * rotSpeed * 0.3 + phaseOffset * 0.3;

          // Transform vertices
          const projected = cubeVertices.map(v => {
            let p = { x: v.x * cubeSize, y: v.y * cubeSize, z: v.z * cubeSize };
            p = rotateX(p, rx);
            p = rotateY(p, ry);
            p = rotateZ(p, rz);
            return project(p, 300, gridX, gridY);
          });

          // Draw edges
          const alpha = fadeAlpha * 0.12;
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
          ctx.lineWidth = 0.6;

          edges.forEach(([a, b]) => {
            ctx.beginPath();
            ctx.moveTo(projected[a].x, projected[a].y);
            ctx.lineTo(projected[b].x, projected[b].y);
            ctx.stroke();
          });

          // Draw vertices as dots
          if (fadeAlpha > 0.3) {
            const dotAlpha = fadeAlpha * 0.15;
            ctx.fillStyle = `rgba(99, 102, 241, ${dotAlpha})`;
            projected.forEach(p => {
              ctx.beginPath();
              ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
              ctx.fill();
            });
          }
        }
      }

      time += 0.008;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="cube-net-canvas"
      aria-hidden="true"
    />
  );
}
