import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';

const Canvas = forwardRef(({ color, tool, stamp = 'star', brushSize }, ref) => {
    const canvasRef = useRef(null);
    const isDrawingRef = useRef(false);
    const contextRef = useRef(null);
    const hueRef = useRef(0);
    const lastStampPosRef = useRef(null);
    const lastStampTimeRef = useRef(0);

    // Initialize Canvas
    useEffect(() => {
        const canvas = canvasRef.current;

        // Set drawing buffer size to match client size for high DPI or full screen
        const updateSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // set white background initially
            const ctx = canvas.getContext("2d");
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            contextRef.current = ctx;
        };

        updateSize();

        // Ideally handle resize, but for simple app we might just keep it fixed or reset
        // window.addEventListener('resize', updateSize);
        // return () => window.removeEventListener('resize', updateSize);
    }, []);

    // Update Context when props change
    useEffect(() => {
        if (contextRef.current) {
            contextRef.current.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
            contextRef.current.lineWidth = tool === 'eraser' ? brushSize * 2 : brushSize;
        }
    }, [color, tool, brushSize]);

    useImperativeHandle(ref, () => ({
        clearCanvas: () => {
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            context.fillStyle = "white";
            context.fillRect(0, 0, canvas.width, canvas.height);
        },
        download: () => {
            const canvas = canvasRef.current;
            const link = document.createElement('a');
            link.download = 'my-painting.png';
            link.href = canvas.toDataURL();
            link.click();
        }
    }));

    const getCoordinates = (event) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    };

    const drawStar = (ctx, cx, cy, radius, fillStyle) => {
        const spikes = 5;
        const innerRadius = radius * 0.48;
        let rot = -Math.PI / 2;
        const step = Math.PI / spikes;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(cx, cy - radius);
        for (let i = 0; i < spikes; i++) {
            let x = cx + Math.cos(rot) * radius;
            let y = cy + Math.sin(rot) * radius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - radius);
        ctx.closePath();
        ctx.fillStyle = fillStyle;
        ctx.fill();
        ctx.restore();
    };

    const drawHeart = (ctx, cx, cy, size, fillStyle) => {
        ctx.save();
        ctx.beginPath();
        ctx.translate(cx, cy);
        const s = size / 20;
        ctx.scale(s, s);
        ctx.moveTo(0, -6);
        ctx.bezierCurveTo(0, -18, -20, -18, -20, -4);
        ctx.bezierCurveTo(-20, 8, -10, 15, 0, 22);
        ctx.bezierCurveTo(10, 15, 20, 8, 20, -4);
        ctx.bezierCurveTo(20, -18, 0, -18, 0, -6);
        ctx.closePath();
        ctx.fillStyle = fillStyle;
        ctx.fill();
        ctx.restore();
    };

    const drawFlower = (ctx, cx, cy, size, fillStyle) => {
        ctx.save();
        const numPetals = 5;
        const petalRadius = size * 0.45;
        const centerOffset = size * 0.45;

        // Draw petals
        ctx.fillStyle = fillStyle;
        for (let i = 0; i < numPetals; i++) {
            const angle = (i * 2 * Math.PI) / numPetals - Math.PI / 2;
            const px = cx + Math.cos(angle) * centerOffset;
            const py = cy + Math.sin(angle) * centerOffset;
            ctx.beginPath();
            ctx.arc(px, py, petalRadius, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw center core
        ctx.beginPath();
        ctx.arc(cx, cy, size * 0.35, 0, Math.PI * 2);
        ctx.fillStyle = fillStyle === '#FFFF00' || fillStyle === '#FFD700' ? '#FF8C00' : '#FFD700';
        ctx.fill();
        ctx.restore();
    };

    const drawCircle = (ctx, cx, cy, radius, fillStyle) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.85, 0, Math.PI * 2);
        ctx.fillStyle = fillStyle;
        ctx.fill();
        ctx.restore();
    };

    const drawSparkleStar = (ctx, cx, cy, radius, fillStyle) => {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = fillStyle;
        ctx.moveTo(cx, cy - radius);
        ctx.quadraticCurveTo(cx, cy, cx + radius, cy);
        ctx.quadraticCurveTo(cx, cy, cx, cy + radius);
        ctx.quadraticCurveTo(cx, cy, cx - radius, cy);
        ctx.quadraticCurveTo(cx, cy, cx, cy - radius);
        ctx.fill();
        ctx.restore();
    };

    const drawSparkles = (ctx, cx, cy, size, fillStyle) => {
        drawSparkleStar(ctx, cx - size * 0.05, cy, size * 0.65, fillStyle);
        drawSparkleStar(ctx, cx + size * 0.45, cy - size * 0.4, size * 0.32, fillStyle);
        drawSparkleStar(ctx, cx - size * 0.4, cy + size * 0.4, size * 0.22, fillStyle);
    };

    const drawPoo = (ctx, cx, cy, size, fillStyle) => {
        ctx.save();
        ctx.translate(cx, cy);
        const s = size / 35;
        ctx.scale(s, s);

        ctx.fillStyle = fillStyle;

        // 1. Bottom tier (wide rounded base)
        ctx.beginPath();
        ctx.moveTo(-24, 20);
        ctx.bezierCurveTo(-30, 20, -32, 10, -26, 6);
        ctx.bezierCurveTo(-20, 2, -10, 6, 0, 6);
        ctx.bezierCurveTo(10, 6, 20, 2, 26, 6);
        ctx.bezierCurveTo(32, 10, 30, 20, 24, 20);
        ctx.bezierCurveTo(15, 26, -15, 26, -24, 20);
        ctx.fill();

        // 2. Middle tier
        ctx.beginPath();
        ctx.moveTo(-18, 7);
        ctx.bezierCurveTo(-24, 7, -26, -2, -20, -5);
        ctx.bezierCurveTo(-15, -8, -8, -5, 0, -5);
        ctx.bezierCurveTo(8, -5, 15, -8, 20, -5);
        ctx.bezierCurveTo(26, -2, 24, 7, 18, 7);
        ctx.bezierCurveTo(10, 10, -10, 10, -18, 7);
        ctx.fill();

        // 3. Top tier & swirl tip
        ctx.beginPath();
        ctx.moveTo(-12, -4);
        ctx.bezierCurveTo(-16, -5, -17, -13, -11, -16);
        ctx.bezierCurveTo(-5, -19, 0, -17, 3, -19);
        ctx.bezierCurveTo(7, -22, 11, -26, 15, -23);
        ctx.bezierCurveTo(17, -20, 12, -17, 8, -14);
        ctx.bezierCurveTo(13, -10, 14, -4, 11, -4);
        ctx.bezierCurveTo(5, -2, -5, -2, -12, -4);
        ctx.fill();

        ctx.restore();
    };

    const stampShape = (x, y) => {
        let currentFillColor = color;
        if (color === 'RAINBOW') {
            hueRef.current = (hueRef.current + 30) % 360;
            currentFillColor = `hsl(${hueRef.current}, 100%, 50%)`;
        }
        const stampSize = brushSize === 5 ? 24 : brushSize === 15 ? 48 : 80;
        if (stamp === 'heart') {
            drawHeart(contextRef.current, x, y, stampSize, currentFillColor);
        } else if (stamp === 'flower') {
            drawFlower(contextRef.current, x, y, stampSize, currentFillColor);
        } else if (stamp === 'circle') {
            drawCircle(contextRef.current, x, y, stampSize, currentFillColor);
        } else if (stamp === 'poo') {
            drawPoo(contextRef.current, x, y, stampSize, currentFillColor);
        } else if (stamp === 'sparkles') {
            drawSparkles(contextRef.current, x, y, stampSize, currentFillColor);
        } else {
            drawStar(contextRef.current, x, y, stampSize, currentFillColor);
        }
    };

    const startDrawing = (event) => {
        event.preventDefault();
        const { x, y } = getCoordinates(event);

        if (tool === 'stamp') {
            stampShape(x, y);
            lastStampPosRef.current = { x, y };
            lastStampTimeRef.current = event.timeStamp;
            isDrawingRef.current = true;
            return;
        }

        if (color === 'RAINBOW') {
            hueRef.current = (hueRef.current + 2) % 360;
            contextRef.current.strokeStyle = `hsl(${hueRef.current}, 100%, 50%)`;
        } else if (tool !== 'eraser') {
            contextRef.current.strokeStyle = color;
        }

        contextRef.current.beginPath();
        contextRef.current.moveTo(x, y);
        isDrawingRef.current = true;

        if (tool === 'spray') {
            drawSpray(x, y);
        }
    };

    const finishDrawing = () => {
        if (contextRef.current && tool !== 'stamp') contextRef.current.closePath();
        isDrawingRef.current = false;
        lastStampPosRef.current = null;
    };

    const drawSpray = (x, y) => {
        const context = contextRef.current;
        const density = 50; // Increased density for more intensity

        if (color === 'RAINBOW') {
            hueRef.current = (hueRef.current + 1) % 360;
            context.fillStyle = `hsl(${hueRef.current}, 100%, 50%)`;
        } else {
            context.fillStyle = color;
        }

        for (let i = 0; i < density; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * brushSize;
            const offsetX = Math.cos(angle) * radius;
            const offsetY = Math.sin(angle) * radius;

            context.fillRect(x + offsetX, y + offsetY, 1, 1);
        }
    }

    const draw = (event) => {
        if (!isDrawingRef.current) {
            return;
        }
        event.preventDefault();
        const { x, y } = getCoordinates(event);

        if (tool === 'stamp') {
            const stampSize = brushSize === 5 ? 24 : brushSize === 15 ? 48 : 80;
            const minDistance = stampSize * 1.35;
            const minDelay = 120; // ms between consecutive stamps

            const lastPos = lastStampPosRef.current;
            const lastTime = lastStampTimeRef.current;
            const now = event.timeStamp;

            if (lastPos) {
                const dist = Math.hypot(x - lastPos.x, y - lastPos.y);
                if (dist >= minDistance && now - lastTime >= minDelay) {
                    stampShape(x, y);
                    lastStampPosRef.current = { x, y };
                    lastStampTimeRef.current = now;
                }
            } else {
                stampShape(x, y);
                lastStampPosRef.current = { x, y };
                lastStampTimeRef.current = now;
            }
            return;
        }

        if (tool === 'spray') {
            drawSpray(x, y);
        } else {
            if (color === 'RAINBOW') {
                hueRef.current = (hueRef.current + 2) % 360;
                contextRef.current.strokeStyle = `hsl(${hueRef.current}, 100%, 50%)`;
            }
            contextRef.current.lineTo(x, y);
            contextRef.current.stroke();
            contextRef.current.beginPath();
            contextRef.current.moveTo(x, y);
        }
    };

    return (
        <canvas
            onPointerDown={startDrawing}
            onPointerUp={finishDrawing}
            onPointerMove={draw}
            onPointerLeave={finishDrawing}
            onPointerCancel={finishDrawing}
            ref={canvasRef}
            style={{
                touchAction: 'none',
                WebkitTapHighlightColor: 'transparent',
                WebkitTouchCallout: 'none',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                display: 'block',
                cursor: tool === 'eraser' ? 'cell' : tool === 'stamp' ? 'pointer' : 'crosshair'
            }}
        />
    );
});

export default Canvas;
