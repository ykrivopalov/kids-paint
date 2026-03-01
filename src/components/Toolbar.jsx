import React from 'react';

const COLORS = [
    'RAINBOW', // Special rainbow gradient color
    '#FF0000', // Red
    '#FF4500', // OrangeRed
    '#FF8C00', // DarkOrange
    '#FFA500', // Orange
    '#FFD700', // Gold
    '#FFFF00', // Yellow
    '#ADFF2F', // GreenYellow
    '#32CD32', // LimeGreen
    '#00FF00', // Lime
    '#00FA9A', // MediumSpringGreen
    '#00FFFF', // Cyan
    '#00CED1', // DarkTurquoise
    '#1E90FF', // DodgerBlue
    '#0000FF', // Blue
    '#00008B', // DarkBlue
    '#8A2BE2', // BlueViolet
    '#4B0082', // Indigo
    '#800080', // Purple
    '#FF00FF', // Magenta
    '#FF1493', // DeepPink
    '#FF69B4', // HotPink
    '#FFB6C1', // LightPink
    '#A52A2A', // Brown
    '#800000', // Maroon
    '#808080', // Gray
    '#000000', // Black
    '#FFFFFF', // White (for erasing or drawing on colored bg if added later)
];

const Toolbar = ({ activeColor, setActiveColor, activeTool, setActiveTool, onClear, onDownload, brushSize, setBrushSize }) => {
    return (
        <div className="toolbar">
            <div className="section-label">Цвета</div>
            <div className="color-palette">
                {COLORS.map((color) => (
                    <button
                        key={color}
                        className={`color-swatch ${activeColor === color && (activeTool === 'brush' || activeTool === 'spray') ? 'selected' : ''}`}
                        style={{ background: color === 'RAINBOW' ? 'linear-gradient(45deg, red, orange, yellow, green, blue, indigo, violet)' : color }}
                        onClick={() => {
                            setActiveColor(color);
                            // Only switch to brush if eraser is currently selected, otherwise keep current tool (brush or spray)
                            if (activeTool === 'eraser') {
                                setActiveTool('brush');
                            }
                        }}
                        title={color}
                    />
                ))}
            </div>

            <div className="section-label">Инструменты</div>
            <div className="tools-row">
                <button
                    className={`tool-btn ${activeTool === 'brush' ? 'selected' : ''}`}
                    onClick={() => setActiveTool('brush')}
                    title="Кисть"
                >
                    🖌️
                </button>
                <button
                    className={`tool-btn ${activeTool === 'spray' ? 'selected' : ''}`}
                    onClick={() => setActiveTool('spray')}
                    title="Распылитель"
                >
                    🚿
                </button>
                <button
                    className={`tool-btn ${activeTool === 'eraser' ? 'selected' : ''}`}
                    onClick={() => setActiveTool('eraser')}
                    title="Ластик"
                >
                    🧼
                </button>
            </div>

            <div className="section-label">Размер</div>
            <div className="size-control">
                <button className="size-btn small" onClick={() => setBrushSize(5)} disabled={brushSize === 5}>•</button>
                <button className="size-btn medium" onClick={() => setBrushSize(15)} disabled={brushSize === 15}>●</button>
                <button className="size-btn large" onClick={() => setBrushSize(30)} disabled={brushSize === 30}>⬤</button>
            </div>

            <div className="section-label">Действия</div>
            <div className="actions-row">
                <button className="action-btn" onClick={onClear} title="Очистить">🗑️</button>
                <button className="action-btn" onClick={onDownload} title="Сохранить">📸</button>
            </div>
        </div>
    );
};

export default Toolbar;
