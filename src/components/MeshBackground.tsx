"use client";

import { useEffect, useRef } from 'react';

export default function MeshBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const GRID_SPACING = 50;
    const AMPLITUDE = 8;
    const WAVE_SPEED = 0.008;
    const WAVE_LENGTH = 0.03;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const cols = Math.ceil(W / GRID_SPACING) + 2;
      const rows = Math.ceil(H / GRID_SPACING) + 2;

      // Compute displaced grid points
      const points: { x: number; y: number }[][] = [];
      for (let r = 0; r < rows; r++) {
        points[r] = [];
        for (let c = 0; c < cols; c++) {
          const baseX = c * GRID_SPACING;
          const baseY = r * GRID_SPACING;
          const wave1 = Math.sin(baseX * WAVE_LENGTH + time) * AMPLITUDE;
          const wave2 = Math.cos(baseY * WAVE_LENGTH * 0.8 + time * 0.7) * AMPLITUDE * 0.6;
          const wave3 = Math.sin((baseX + baseY) * WAVE_LENGTH * 0.5 + time * 0.5) * AMPLITUDE * 0.4;
          points[r][c] = {
            x: baseX,
            y: baseY + wave1 + wave2 + wave3,
          };
        }
      }

      // Draw horizontal lines
      for (let r = 0; r < rows; r++) {
        ctx.beginPath();
        for (let c = 0; c < cols; c++) {
          const p = points[r][c];
          if (c === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        // Fade at edges
        const centerY = H / 2;
        const distFromCenter = Math.abs(r * GRID_SPACING - centerY) / (H * 0.5);
        const alpha = Math.max(0, 0.07 - distFromCenter * 0.06);
        ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Draw vertical lines
      for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        for (let r = 0; r < rows; r++) {
          const p = points[r][c];
          if (r === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        const centerX = W / 2;
        const distFromCenter = Math.abs(c * GRID_SPACING - centerX) / (W * 0.5);
        const alpha = Math.max(0, 0.07 - distFromCenter * 0.05);
        ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Draw subtle glow dots at intersections near center
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const p = points[r][c];
          const dx = p.x - W / 2;
          const dy = p.y - H / 2;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = Math.sqrt(W * W + H * H) * 0.35;
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.12;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99, 102, 241, ${alpha})`;
            ctx.fill();
          }
        }
      }

      time += WAVE_SPEED;
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
      className="mesh-bg-canvas"
      aria-hidden="true"
    />
  );
}
