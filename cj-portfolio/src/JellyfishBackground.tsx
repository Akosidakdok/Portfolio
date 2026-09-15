import { useEffect, useRef } from 'react';

interface JellyfishEntity {
  x: number;
  y: number;
  size: number;
  speedY: number;
  driftPhase: number;
  driftSpeed: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  flipX: boolean;
  swimPhase: number;
  swimSpeed: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  twinklePhase: number;
}

function JellyfishBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const jellyfishArr: JellyfishEntity[] = [];
    const particles: Particle[] = [];
    const img = new Image();
    let imgLoaded = false;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const createJellyfish = (): JellyfishEntity => {
      const size = 80 + Math.random() * 180;
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + size + Math.random() * canvas.height,
        size,
        speedY: 0.1 + Math.random() * 0.3,
        driftPhase: Math.random() * Math.PI * 2,
        driftSpeed: 0.002 + Math.random() * 0.004,
        opacity: 0.15 + Math.random() * 0.45,
        rotation: (Math.random() - 0.5) * 0.3,
        rotationSpeed: (Math.random() - 0.5) * 0.0005,
        flipX: Math.random() > 0.5,
        swimPhase: Math.random() * Math.PI * 2,
        swimSpeed: 0.02 + Math.random() * 0.015,
      };
    };

    // Initialize jellyfish
    const count = Math.max(6, Math.floor(window.innerWidth / 200));
    for (let i = 0; i < count; i++) {
      const jf = createJellyfish();
      // Spread them across the viewport initially
      jf.y = Math.random() * (canvas.height + 400) - 100;
      jellyfishArr.push(jf);
    }

    // Initialize particles
    const particleCount = Math.max(40, Math.floor(window.innerWidth / 15));
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 0.3 + Math.random() * 1.8,
        speedY: -(0.05 + Math.random() * 0.2),
        speedX: (Math.random() - 0.5) * 0.15,
        opacity: 0.05 + Math.random() * 0.25,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }

    let time = 0;

    const animate = () => {
      if (!imgLoaded) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      time++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep ocean background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, '#010410');
      bgGrad.addColorStop(0.3, '#020818');
      bgGrad.addColorStop(0.7, '#010612');
      bgGrad.addColorStop(1, '#000308');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw particles
      for (const p of particles) {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        const twinkle = 0.4 + 0.6 * Math.sin(time * 0.015 + p.twinklePhase);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(80, 150, 255, ${p.opacity * twinkle})`;
        ctx.fill();
      }

      // Sort by size (smaller = further back)
      jellyfishArr.sort((a, b) => a.size - b.size);

      // Draw jellyfish using the image
      for (const jf of jellyfishArr) {
        // Update position
        jf.y -= jf.speedY;
        jf.x += Math.sin(jf.driftPhase + time * jf.driftSpeed) * 0.4;
        jf.rotation += jf.rotationSpeed;

        // Reset when off screen
        if (jf.y < -jf.size * 2) {
          jf.y = canvas.height + jf.size * 1.5;
          jf.x = Math.random() * canvas.width;
          jf.opacity = 0.15 + Math.random() * 0.45;
          jf.flipX = Math.random() > 0.5;
        }
        // Wrap horizontally
        if (jf.x < -jf.size) jf.x = canvas.width + jf.size * 0.5;
        if (jf.x > canvas.width + jf.size) jf.x = -jf.size * 0.5;

        // Calculate aspect-ratio-correct dimensions
        const aspect = img.height / img.width;
        const drawW = jf.size;
        const drawH = jf.size * aspect;

        ctx.save();
        ctx.translate(jf.x, jf.y);
        ctx.rotate(jf.rotation);
        if (jf.flipX) ctx.scale(-1, 1);

        // Use 'screen' blend so the black background of the image disappears
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = jf.opacity;

        // ─── Slice-based distortion for tentacle swimming ───
        // Bell zone (top 35%) = stable, tentacle zone (bottom 65%) = wavy
        const bellRatio = 0.35;
        const sliceCount = 40;
        const srcW = img.width;
        const srcH = img.height;

        for (let s = 0; s < sliceCount; s++) {
          const t = s / sliceCount; // 0..1 progress from top to bottom
          const srcY = Math.floor(t * srcH);
          const srcSliceH = Math.ceil(srcH / sliceCount) + 1;

          const dstY = -drawH / 2 + t * drawH;
          const dstSliceH = drawH / sliceCount + 0.5;

          // Distortion: 0 in bell zone, increasing in tentacle zone
          let xOffset = 0;
          if (t > bellRatio) {
            const tentacleProgress = (t - bellRatio) / (1 - bellRatio); // 0..1 within tentacle area
            const waveAmp = tentacleProgress * tentacleProgress * drawW * 0.08;
            xOffset = Math.sin(jf.swimPhase + time * jf.swimSpeed + tentacleProgress * 4) * waveAmp
                    + Math.sin(jf.swimPhase * 1.7 + time * jf.swimSpeed * 0.7 + tentacleProgress * 6) * waveAmp * 0.5;
          }

          // Bell pulse: subtle horizontal scale on the bell area
          let scaleX = 1;
          if (t < bellRatio) {
            scaleX = 1 + Math.sin(jf.swimPhase + time * jf.swimSpeed) * 0.02;
          }

          ctx.drawImage(
            img,
            0, srcY, srcW, srcSliceH,                          // source slice
            -drawW / 2 * scaleX + xOffset, dstY, drawW * scaleX, dstSliceH  // dest slice with offset
          );
        }

        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
        ctx.restore();
      }

      animationId = requestAnimationFrame(animate);
    };

    img.onload = () => {
      imgLoaded = true;
    };
    img.src = '/jellyfish-bg.jpg';

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}

export default JellyfishBackground;
