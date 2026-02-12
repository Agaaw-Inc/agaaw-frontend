"use client";

import { useEffect, useRef } from "react";

export default function AuthBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let width = window.innerWidth;
        let height = window.innerHeight;

        // Configuration
        // Elm colors: #1d7a85 (base), #2b9ca1 (light), #145e63 (dark)
        const waves = [
            {
                color: "rgba(20, 94, 99, 0.2)", // Darkest, furthest back
                speed: 0.002,
                amplitude: 150,
                wavelength: 0.003,
                yOffset: height * 0.6,
            },
            {
                color: "rgba(29, 122, 133, 0.2)", // Base Elm
                speed: 0.003,
                amplitude: 120,
                wavelength: 0.004,
                yOffset: height * 0.65,
            },
            {
                color: "rgba(43, 156, 161, 0.2)", // Lightest, front
                speed: 0.005,
                amplitude: 100,
                wavelength: 0.005,
                yOffset: height * 0.7,
            },
            {
                // Filling the bottom more solidly
                color: "rgba(29, 122, 133, 0.1)",
                speed: 0.004,
                amplitude: 80,
                wavelength: 0.006,
                yOffset: height * 0.75,
            }
        ];

        // Simple 1D Perlin-like noise using sine superposition
        const noise = (x: number, time: number, waveIndex: number) => {
            // Superpose multiple sine waves to create irregularity
            const y1 = Math.sin(x * 0.003 + time + waveIndex);
            const y2 = Math.sin(x * 0.007 + time * 1.5 + waveIndex);
            const y3 = Math.sin(x * 0.012 + time * 0.5 + waveIndex);
            return (y1 + y2 * 0.5 + y3 * 0.25) / 1.75;
        };

        const resize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;

            // Update yOffsets based on new height
            waves[0].yOffset = height * 0.55;
            waves[1].yOffset = height * 0.65;
            waves[2].yOffset = height * 0.75;
            waves[3].yOffset = height * 0.8;
        };

        const draw = (time: number) => {
            ctx.clearRect(0, 0, width, height);

            // Background - slight off-white/gray
            ctx.fillStyle = "#fafbfa";
            ctx.fillRect(0, 0, width, height);

            waves.forEach((wave, index) => {
                ctx.fillStyle = wave.color;
                ctx.beginPath();

                ctx.moveTo(0, height); // Start bottom left

                // Draw wave points
                for (let x = 0; x <= width; x += 10) {
                    // Normalize x for noise function
                    const noiseVal = noise(x, time * wave.speed, index * 100);
                    const y = wave.yOffset + noiseVal * wave.amplitude;
                    ctx.lineTo(x, y);
                }

                ctx.lineTo(width, height); // Bottom right
                ctx.lineTo(0, height); // Back to bottom left
                ctx.closePath();
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame((t) => draw(t * 0.5)); // Pass time
        };

        window.addEventListener("resize", resize);
        resize();
        draw(0);

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10"
            style={{ width: "100%", height: "100%" }}
        />
    );
}
