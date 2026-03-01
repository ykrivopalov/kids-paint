import { useState, useRef } from 'react'
import Canvas from './components/Canvas'
import Toolbar from './components/Toolbar'
import Modal from './components/Modal'
import TemplateSelector from './components/TemplateSelector'
import './App.css'

function App() {
  const [color, setColor] = useState('#FF0000')
  const [tool, setTool] = useState('brush')
  const [brushSize, setBrushSize] = useState(15)
  const [showClearModal, setShowClearModal] = useState(false)
  const [flash, setFlash] = useState(false)
  const [activeTemplate, setActiveTemplate] = useState(null)
  const canvasRef = useRef(null)

  const handleClearRequest = () => {
    setShowClearModal(true);
  }

  const confirmClear = () => {
    canvasRef.current?.clearCanvas()
    setShowClearModal(false)
  }

  const cancelClear = () => {
    setShowClearModal(false)
  }

  const handleCameraClick = () => {
    // Trigger flash effect
    setFlash(true);
    setTimeout(() => setFlash(false), 500);

    // canvasRef.current?.download() // Disabled for now
  }

  return (
    <div className="app-container">
      {flash && <div className="flash-overlay flash-active"></div>}
      {showClearModal && (
        <Modal
          message="Очистить рисунок?"
          onConfirm={confirmClear}
          onCancel={cancelClear}
        />
      )}

      <Toolbar
        activeColor={color}
        setActiveColor={setColor}
        activeTool={tool}
        setActiveTool={setTool}
        brushSize={brushSize}
        setBrushSize={setBrushSize}
        onClear={handleClearRequest}
        onDownload={handleCameraClick}
      />

      <div className="main-area">
        <div className="canvas-wrapper">
          {activeTemplate && (
            <img
              src={activeTemplate}
              className="template-overlay"
              alt="template"
            />
          )}
          <Canvas
            ref={canvasRef}
            color={color}
            tool={tool}
            brushSize={brushSize}
          />
        </div>
        <TemplateSelector
          activeTemplate={activeTemplate}
          onSelect={setActiveTemplate}
        />
      </div>
    </div>
  )
}

export default App
