"use client";

import { useEffect, useRef, useCallback } from 'react';

export default function LiquidMetalBall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const targetRef = useRef({ x: 0.5, y: 0.5 });
  const isInteracting = useRef(false);

  const handlePointerMove = useCallback((e: PointerEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    targetRef.current = {
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height,
    };
    isInteracting.current = true;
  }, []);

  const handlePointerLeave = useCallback(() => {
    isInteracting.current = false;
    targetRef.current = { x: 0.5, y: 0.5 };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const SIZE = 400;
    canvas.width = SIZE;
    canvas.height = SIZE;

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('touchmove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave);

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // Smooth mouse follow
      const smoothFactor = isInteracting.current ? 0.08 : 0.03;
      mouseRef.current.x += (targetRef.current.x - mouseRef.current.x) * smoothFactor;
      mouseRef.current.y += (targetRef.current.y - mouseRef.current.y) * smoothFactor;

      const cx = W / 2;
      const cy = H / 2;
      const baseRadius = W * 0.28;

      // Mouse influence on center offset
      const offsetX = (mouseRef.current.x - 0.5) * 25;
      const offsetY = (mouseRef.current.y - 0.5) * 25;

      // Interaction scale pulse
      const interactScale = isInteracting.current ? 1.04 + Math.sin(time * 6) * 0.02 : 1;

      // Draw multiple layers for glossy liquid effect
      const layers = 6;
      for (let layer = layers - 1; layer >= 0; layer--) {
        const layerFactor = 1 - layer * 0.06;
        const points = 150;
        const radius = baseRadius * layerFactor * interactScale;

        ctx.beginPath();
        for (let i = 0; i <= points; i++) {
          const angle = (i / points) * Math.PI * 2;

          // Multiple distortion frequencies for liquid feel
          const noise1 = Math.sin(angle * 3 + time * 2.5) * 7 * layerFactor;
          const noise2 = Math.cos(angle * 5 - time * 1.8) * 4 * layerFactor;
          const noise3 = Math.sin(angle * 7 + time * 3.2) * 2.5 * layerFactor;
          const noise4 = Math.cos(angle * 2 - time * 1.2) * 5 * layerFactor;

          // Mouse-reactive distortion (stronger when interacting)
          const mouseAngle = Math.atan2(mouseRef.current.y - 0.5, mouseRef.current.x - 0.5);
          const angleDiff = angle - mouseAngle;
          const interactStrength = isInteracting.current ? 3.5 : 2;
          const mouseDistort = Math.cos(angleDiff) * 14 *
            Math.sqrt((mouseRef.current.x - 0.5) ** 2 + (mouseRef.current.y - 0.5) ** 2) * interactStrength;

          const r = radius + noise1 + noise2 + noise3 + noise4 + mouseDistort;
          const x = cx + offsetX * layerFactor + Math.cos(angle) * r;
          const y = cy + offsetY * layerFactor + Math.sin(angle) * r;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();

        // Pink/magenta glossy gradient
        const gradient = ctx.createRadialGradient(
          cx + offsetX * layerFactor - 35,
          cy + offsetY * layerFactor - 45,
          baseRadius * 0.08,
          cx + offsetX * layerFactor,
          cy + offsetY * layerFactor,
          baseRadius * 1.15
        );

        if (layer === 0) {
          // Main body — deep magenta/pink glossy
          gradient.addColorStop(0, 'rgba(255, 180, 220, 0.98)');
          gradient.addColorStop(0.2, 'rgba(255, 60, 150, 0.95)');
          gradient.addColorStop(0.45, 'rgba(220, 30, 120, 0.93)');
          gradient.addColorStop(0.65, 'rgba(170, 10, 90, 0.95)');
          gradient.addColorStop(0.85, 'rgba(100, 5, 60, 0.97)');
          gradient.addColorStop(1, 'rgba(40, 0, 30, 0.98)');
        } else if (layer === 1) {
          // Secondary shimmer layer
          const alpha = 0.12;
          gradient.addColorStop(0, `rgba(255, 150, 200, ${alpha})`);
          gradient.addColorStop(0.5, `rgba(200, 40, 120, ${alpha * 0.6})`);
          gradient.addColorStop(1, `rgba(100, 10, 60, ${alpha * 0.2})`);
        } else {
          // Outer glow layers
          const alpha = 0.04 * (layers - layer);
          gradient.addColorStop(0, `rgba(255, 100, 180, ${alpha})`);
          gradient.addColorStop(1, `rgba(180, 30, 100, ${alpha * 0.3})`);
        }

        ctx.fillStyle = gradient;
        ctx.fill();

        // Large glossy specular highlight on main body (upper-left)
        if (layer === 0) {
          // Big soft highlight
          const specGrad = ctx.createRadialGradient(
            cx + offsetX - 30,
            cy + offsetY - 40,
            2,
            cx + offsetX - 30,
            cy + offsetY - 40,
            baseRadius * 0.55
          );
          specGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
          specGrad.addColorStop(0.2, 'rgba(255, 200, 230, 0.2)');
          specGrad.addColorStop(0.5, 'rgba(255, 100, 180, 0.08)');
          specGrad.addColorStop(1, 'rgba(200, 50, 120, 0)');
          ctx.fillStyle = specGrad;
          ctx.fill();

          // Small bright spot
          const spotGrad = ctx.createRadialGradient(
            cx + offsetX - 40,
            cy + offsetY - 50,
            1,
            cx + offsetX - 40,
            cy + offsetY - 50,
            baseRadius * 0.15
          );
          spotGrad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
          spotGrad.addColorStop(0.5, 'rgba(255, 230, 245, 0.15)');
          spotGrad.addColorStop(1, 'rgba(255, 150, 200, 0)');
          ctx.fillStyle = spotGrad;
          ctx.fill();

          // Bottom edge reflection
          const bottomGrad = ctx.createRadialGradient(
            cx + offsetX + 15,
            cy + offsetY + baseRadius * 0.5,
            1,
            cx + offsetX + 15,
            cy + offsetY + baseRadius * 0.5,
            baseRadius * 0.35
          );
          bottomGrad.addColorStop(0, 'rgba(255, 150, 200, 0.15)');
          bottomGrad.addColorStop(1, 'rgba(200, 50, 120, 0)');
          ctx.fillStyle = bottomGrad;
          ctx.fill();
        }
      }

      // Glowing white vertical bar "eyes" (matching the screenshot)
      const barSpacing = 24;
      const barWidth = 8;
      const barHeight = 30;
      const barRadius = 4;
      const barCenterY = cy + offsetY - 5;
      const barPulse = 0.85 + Math.sin(time * 2.5) * 0.15;

      // Left eye bar
      drawGlowBar(ctx, cx + offsetX - barSpacing, barCenterY, barWidth, barHeight * barPulse, barRadius, time);
      // Right eye bar
      drawGlowBar(ctx, cx + offsetX + barSpacing, barCenterY, barWidth, barHeight * barPulse, barRadius, time);

      // Outer pink glow
      const glowGrad = ctx.createRadialGradient(
        cx + offsetX, cy + offsetY, baseRadius * 0.6,
        cx + offsetX, cy + offsetY, baseRadius * 2
      );
      glowGrad.addColorStop(0, 'rgba(255, 50, 150, 0)');
      glowGrad.addColorStop(0.4, 'rgba(255, 50, 150, 0.04)');
      glowGrad.addColorStop(0.7, 'rgba(200, 30, 100, 0.02)');
      glowGrad.addColorStop(1, 'rgba(150, 10, 70, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(0, 0, W, H);

      time += 0.015;
      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('touchmove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, [handlePointerMove, handlePointerLeave]);

  return (
    <canvas
      ref={canvasRef}
      className="liquid-metal-canvas"
      style={{ width: '100%', maxWidth: 400, height: 'auto', aspectRatio: '1', touchAction: 'none' }}
      aria-hidden="true"
    />
  );
}

function drawGlowBar(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  w: number, h: number,
  r: number, time: number
) {
  const halfW = w / 2;
  const halfH = h / 2;

  // Outer glow
  const glowGrad = ctx.createRadialGradient(x, y, 2, x, y, Math.max(w, h) * 1.5);
  glowGrad.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
  glowGrad.addColorStop(0.3, 'rgba(255, 220, 240, 0.2)');
  glowGrad.addColorStop(1, 'rgba(255, 150, 200, 0)');
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(x, y, Math.max(w, h) * 1.5, 0, Math.PI * 2);
  ctx.fill();

  // White bar with rounded corners
  ctx.fillStyle = `rgba(255, 255, 255, ${0.88 + Math.sin(time * 3) * 0.1})`;
  ctx.beginPath();
  ctx.moveTo(x - halfW + r, y - halfH);
  ctx.lineTo(x + halfW - r, y - halfH);
  ctx.quadraticCurveTo(x + halfW, y - halfH, x + halfW, y - halfH + r);
  ctx.lineTo(x + halfW, y + halfH - r);
  ctx.quadraticCurveTo(x + halfW, y + halfH, x + halfW - r, y + halfH);
  ctx.lineTo(x - halfW + r, y + halfH);
  ctx.quadraticCurveTo(x - halfW, y + halfH, x - halfW, y + halfH - r);
  ctx.lineTo(x - halfW, y - halfH + r);
  ctx.quadraticCurveTo(x - halfW, y - halfH, x - halfW + r, y - halfH);
  ctx.closePath();
  ctx.fill();

  // Inner brighter line
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.beginPath();
  const innerW = w * 0.4;
  const innerH = h * 0.7;
  const innerR = 2;
  ctx.moveTo(x - innerW / 2 + innerR, y - innerH / 2);
  ctx.lineTo(x + innerW / 2 - innerR, y - innerH / 2);
  ctx.quadraticCurveTo(x + innerW / 2, y - innerH / 2, x + innerW / 2, y - innerH / 2 + innerR);
  ctx.lineTo(x + innerW / 2, y + innerH / 2 - innerR);
  ctx.quadraticCurveTo(x + innerW / 2, y + innerH / 2, x + innerW / 2 - innerR, y + innerH / 2);
  ctx.lineTo(x - innerW / 2 + innerR, y + innerH / 2);
  ctx.quadraticCurveTo(x - innerW / 2, y + innerH / 2, x - innerW / 2, y + innerH / 2 - innerR);
  ctx.lineTo(x - innerW / 2, y - innerH / 2 + innerR);
  ctx.quadraticCurveTo(x - innerW / 2, y - innerH / 2, x - innerW / 2 + innerR, y - innerH / 2);
  ctx.closePath();
  ctx.fill();
}
