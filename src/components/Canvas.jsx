import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';

const Canvas = forwardRef(({ color, tool, brushSize }, ref) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const contextRef = useRef(null);
    const hueRef = useRef(0);

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
        // Use nativeEvent to get pointer coordinates relative to target
        return { x: event.nativeEvent.offsetX, y: event.nativeEvent.offsetY };
    };

    const startDrawing = (event) => {
        const { x, y } = getCoordinates(event);

        if (color === 'RAINBOW') {
            hueRef.current = (hueRef.current + 2) % 360;
            contextRef.current.strokeStyle = `hsl(${hueRef.current}, 100%, 50%)`;
        } else if (tool !== 'eraser') {
            contextRef.current.strokeStyle = color;
        }

        contextRef.current.beginPath();
        contextRef.current.moveTo(x, y);
        setIsDrawing(true);

        if (tool === 'spray') {
            drawSpray(x, y);
        }

        event.preventDefault(); // Prevent default touch actions just in case
    };

    const finishDrawing = () => {
        if (contextRef.current) contextRef.current.closePath();
        setIsDrawing(false);
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
        if (!isDrawing) {
            return;
        }
        const { x, y } = getCoordinates(event);

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

        event.preventDefault();
    };

    return (
        <canvas
            onPointerDown={startDrawing}
            onPointerUp={finishDrawing}
            onPointerMove={draw}
            onPointerLeave={finishDrawing}
            onPointerCancel={finishDrawing} // Handle system interruptions
            ref={canvasRef}
            style={{
                touchAction: 'none', // Prevents scrolling on touch devices
                display: 'block',
                cursor: tool === 'eraser' ? 'cell' : 'crosshair'
            }}
        />
    );
});

export default Canvas;
