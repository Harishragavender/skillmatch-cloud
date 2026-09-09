import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, User, Brain, Code, Users, FolderGit2 } from 'lucide-react';

export function HeroMatching3D() {
  const canvasRef = useRef(null);
  const [activeNode, setActiveNode] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Node definitions relative to center
    const center = { x: width / 2, y: height / 2 };
    
    // Satellites orbiting center
    const nodes = [
      { id: 'student', label: 'Student Profile', icon: 'User', angle: 0, distance: 130, speed: 0.006, color: '#38bdf8' },
      { id: 'skills', label: 'Skills & Proficiencies', icon: 'Brain', angle: (Math.PI * 2) / 4, distance: 150, speed: 0.005, color: '#a855f7' },
      { id: 'projects', label: 'Academic Projects', icon: 'FolderGit2', angle: (Math.PI * 2) * (2 / 4), distance: 135, speed: 0.007, color: '#10b981' },
      { id: 'teammates', label: 'Complementary Teammates', icon: 'Users', angle: (Math.PI * 2) * (3 / 4), distance: 155, speed: 0.004, color: '#00f0ff' },
    ];

    // Ambient floating particles
    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    let step = 0;

    const render = () => {
      step += 1;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      // Draw background particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `rgba(56, 189, 248, ${p.alpha * 0.4})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Calculate orbiting node coordinates
      const calculatedNodes = nodes.map((node, index) => {
        node.angle += node.speed;
        const x = cx + Math.cos(node.angle) * node.distance;
        const y = cy + Math.sin(node.angle) * (node.distance * 0.68) + Math.sin(step * 0.03 + index) * 8;
        return { ...node, x, y };
      });

      // Draw glowing laser connection beams from center to nodes
      calculatedNodes.forEach((node, index) => {
        // Line gradient
        const lineGrad = ctx.createLinearGradient(cx, cy, node.x, node.y);
        lineGrad.addColorStop(0, 'rgba(14, 140, 233, 0.9)');
        lineGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.6)');
        lineGrad.addColorStop(1, `${node.color}cc`);

        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(node.x, node.y);
        ctx.stroke();

        // Traveling pulse packet along beam
        const pulseProgress = (step * 0.02 + index * 0.25) % 1;
        const px = cx + (node.x - cx) * pulseProgress;
        const py = cy + (node.y - cy) * pulseProgress;

        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      // Inter-satellite connection web
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      calculatedNodes.forEach((node, i) => {
        const next = calculatedNodes[(i + 1) % calculatedNodes.length];
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(next.x, next.y);
      });
      ctx.stroke();

      // Draw Satellite Nodes
      calculatedNodes.forEach((node) => {
        // Outer glow
        const glow = ctx.createRadialGradient(node.x, node.y, 4, node.x, node.y, 30);
        glow.addColorStop(0, `${node.color}66`);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 30, 0, Math.PI * 2);
        ctx.fill();

        // Node circle
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Node center dot
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Central SkillMatch Cloud Core
      const corePulse = Math.sin(step * 0.04) * 4;
      const coreGlow = ctx.createRadialGradient(cx, cy, 10, cx, cy, 60 + corePulse);
      coreGlow.addColorStop(0, 'rgba(14, 140, 233, 0.8)');
      coreGlow.addColorStop(0.5, 'rgba(0, 240, 255, 0.3)');
      coreGlow.addColorStop(1, 'transparent');

      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, 60 + corePulse, 0, Math.PI * 2);
      ctx.fill();

      // Central core orb
      const orbGrad = ctx.createLinearGradient(cx - 30, cy - 30, cx + 30, cy + 30);
      orbGrad.addColorStop(0, '#38bdf8');
      orbGrad.addColorStop(1, '#0e8ce9');

      ctx.fillStyle = orbGrad;
      ctx.shadowColor = 'rgba(0, 240, 255, 0.8)';
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(cx, cy, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Inner icon representation
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('96%', cx, cy - 2);
      ctx.font = '8px sans-serif';
      ctx.fillText('MATCH', cx, cy + 9);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-[380px] sm:h-[440px] flex items-center justify-center select-none overflow-hidden rounded-3xl glass-panel border border-white/10 shadow-card-3d group">
      {/* Background radial atmosphere */}
      <div className="absolute inset-0 bg-radial-glow-cyan pointer-events-none" />
      <canvas ref={canvasRef} className="w-full h-full block" />

      {/* Floating 3D Overlays */}
      <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 text-xs font-semibold text-cyan-300 shadow-glow-sm">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        Live 4-Factor Matching Matrix
      </div>

      <div className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-emerald-500/30 text-xs font-semibold text-emerald-300">
        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
        Skill Gap Analysis Active
      </div>
    </div>
  );
}
