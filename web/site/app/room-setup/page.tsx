'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, RotateCcw, Save, Grid } from 'lucide-react';

type Layer = 'floor' | 'elevated';
type SpotType = 'food' | 'toilet' | 'favorite';

interface Cell {
  floor: boolean;
  elevated: boolean;
}

interface Spot {
  x: number;
  y: number;
  type: SpotType;
  layer: Layer;
}

export default function RoomSetupPage() {
  // Room dimensions
  const [roomWidth, setRoomWidth] = useState(4.0); // in meters
  const [roomHeight, setRoomHeight] = useState(3.0); // in meters
  const [roomName, setRoomName] = useState('寝室');
  const [isEditingName, setIsEditingName] = useState(false);
  
  // Layer management
  const [activeLayer, setActiveLayer] = useState<Layer>('floor');
  
  // Canvas state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState<SpotType | null>(null);
  const [isDraggingSpot, setIsDraggingSpot] = useState(false);
  
  // Grid configuration (1 cell = 10cm)
  const cellSize = 20; // pixels
  const gridCols = Math.floor((roomWidth * 100) / 10); // width in 10cm units
  const gridRows = Math.floor((roomHeight * 100) / 10); // height in 10cm units
  
  // Grid data
  const [grid, setGrid] = useState<Cell[][]>(() => 
    Array(gridRows).fill(null).map(() => 
      Array(gridCols).fill(null).map(() => ({ floor: false, elevated: false }))
    )
  );
  
  // Spots
  const [spots, setSpots] = useState<Spot[]>([]);
  
  // Undo history
  const [history, setHistory] = useState<{ grid: Cell[][], spots: Spot[] }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Save state to history
  const saveToHistory = () => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      grid: grid.map(row => row.map(cell => ({ ...cell }))),
      spots: spots.map(spot => ({ ...spot }))
    });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };
  
  // Update grid when dimensions change
  useEffect(() => {
    const newCols = Math.floor((roomWidth * 100) / 10);
    const newRows = Math.floor((roomHeight * 100) / 10);
    
    if (newCols !== gridCols || newRows !== gridRows) {
      const newGrid = Array(newRows).fill(null).map(() => 
        Array(newCols).fill(null).map(() => ({ floor: false, elevated: false }))
      );
      
      // Copy existing data
      for (let y = 0; y < Math.min(newRows, gridRows); y++) {
        for (let x = 0; x < Math.min(newCols, gridCols); x++) {
          if (grid[y] && grid[y][x]) {
            newGrid[y][x] = { ...grid[y][x] };
          }
        }
      }
      
      setGrid(newGrid);
      
      // Remove spots outside new boundaries
      setSpots(spots.filter(spot => spot.x < newCols && spot.y < newRows));
    }
  }, [roomWidth, roomHeight]);
  
  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = gridCols * cellSize;
    const height = gridRows * cellSize;
    
    canvas.width = width;
    canvas.height = height;
    
    // Clear canvas
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    for (let x = 0; x <= gridCols; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cellSize, 0);
      ctx.lineTo(x * cellSize, height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= gridRows; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cellSize);
      ctx.lineTo(width, y * cellSize);
      ctx.stroke();
    }
    
    // Draw cells
    for (let y = 0; y < gridRows; y++) {
      for (let x = 0; x < gridCols; x++) {
        const cell = grid[y][x];
        
        // Draw other layer (semi-transparent)
        if (activeLayer === 'floor' && cell.elevated) {
          ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        } else if (activeLayer === 'elevated' && cell.floor) {
          ctx.fillStyle = 'rgba(139, 92, 246, 0.2)';
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
        
        // Draw active layer
        if (activeLayer === 'floor' && cell.floor) {
          ctx.fillStyle = '#8b5cf6';
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        } else if (activeLayer === 'elevated' && cell.elevated) {
          ctx.fillStyle = '#a855f7';
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
      }
    }
    
    // Draw spots
    spots.forEach(spot => {
      const isOnActiveLayer = spot.layer === activeLayer;
      const opacity = isOnActiveLayer ? 1 : 0.4;
      
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const centerX = spot.x * cellSize + cellSize / 2;
      const centerY = spot.y * cellSize + cellSize / 2;
      
      if (spot.type === 'food') {
        ctx.fillText('🍚', centerX, centerY);
      } else if (spot.type === 'toilet') {
        ctx.fillText('🚽', centerX, centerY);
      } else if (spot.type === 'favorite') {
        ctx.fillText('⭐', centerX, centerY);
      }
      
      ctx.restore();
    });
  }, [grid, gridCols, gridRows, activeLayer, spots]);
  
  // Handle mouse events
  const getGridPosition = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / cellSize);
    const y = Math.floor((e.clientY - rect.top) / cellSize);
    
    if (x >= 0 && x < gridCols && y >= 0 && y < gridRows) {
      return { x, y };
    }
    return null;
  };
  
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getGridPosition(e);
    if (!pos) return;
    
    if (selectedSpot) {
      // Place spot
      const cell = grid[pos.y][pos.x];
      const canPlace = activeLayer === 'floor' ? cell.floor : cell.elevated;
      
      if (canPlace) {
        // Remove existing spot at this position
        const newSpots = spots.filter(spot => 
          !(spot.x === pos.x && spot.y === pos.y && spot.layer === activeLayer)
        );
        
        // Add new spot if it's allowed on this layer
        if (selectedSpot === 'favorite' || activeLayer === 'floor') {
          newSpots.push({
            x: pos.x,
            y: pos.y,
            type: selectedSpot,
            layer: activeLayer
          });
        }
        
        setSpots(newSpots);
        saveToHistory();
      }
    } else {
      // Paint cell
      const newGrid = [...grid];
      newGrid[pos.y][pos.x] = {
        ...newGrid[pos.y][pos.x],
        [activeLayer]: !newGrid[pos.y][pos.x][activeLayer]
      };
      setGrid(newGrid);
      saveToHistory();
    }
  };
  
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedSpot) {
      setIsDrawing(true);
      handleCanvasClick(e);
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing && !selectedSpot) {
      const pos = getGridPosition(e);
      if (!pos) return;
      
      const newGrid = [...grid];
      newGrid[pos.y][pos.x] = {
        ...newGrid[pos.y][pos.x],
        [activeLayer]: true
      };
      setGrid(newGrid);
    }
  };
  
  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };
  
  // Handle undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setGrid(prevState.grid.map(row => row.map(cell => ({ ...cell }))));
      setSpots(prevState.spots.map(spot => ({ ...spot })));
      setHistoryIndex(historyIndex - 1);
    }
  };
  
  // Handle save
  const handleSave = () => {
    // Here you would send the data to your backend
    console.log('Saving room setup:', {
      roomName,
      roomWidth,
      roomHeight,
      grid,
      spots
    });
    alert('間取りを保存しました！');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a href="/" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-5 h-5" />
              </a>
              <div className="flex items-center space-x-2">
                <Home className="w-5 h-5 text-blue-600" />
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">部屋名：</span>
                  {isEditingName ? (
                    <input
                      type="text"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      onBlur={() => setIsEditingName(false)}
                      onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                      className="px-2 py-1 border rounded"
                      autoFocus
                    />
                  ) : (
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="font-medium hover:bg-gray-100 px-2 py-1 rounded flex items-center space-x-1"
                    >
                      <span>{roomName}</span>
                      <span className="text-gray-400">🖊</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Room size inputs */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h3 className="font-medium mb-3">部屋のサイズ（実寸入力）</h3>
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <label className="text-gray-600">横幅</label>
              <input
                type="number"
                value={roomWidth}
                onChange={(e) => setRoomWidth(Number(e.target.value))}
                step="0.1"
                min="1"
                max="10"
                className="w-20 px-2 py-1 border rounded"
              />
              <span className="text-gray-600">m</span>
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-gray-600">縦幅</label>
              <input
                type="number"
                value={roomHeight}
                onChange={(e) => setRoomHeight(Number(e.target.value))}
                step="0.1"
                min="1"
                max="10"
                className="w-20 px-2 py-1 border rounded"
              />
              <span className="text-gray-600">m</span>
            </div>
          </div>
        </div>
        
        {/* Layer toggle */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h3 className="font-medium mb-3">レイヤー切替</h3>
          <div className="inline-flex rounded-lg border border-gray-200">
            <button
              onClick={() => setActiveLayer('floor')}
              className={`px-4 py-2 rounded-l-lg transition-colors ${
                activeLayer === 'floor'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              🟫 床（1F）
            </button>
            <button
              onClick={() => setActiveLayer('elevated')}
              className={`px-4 py-2 rounded-r-lg transition-colors ${
                activeLayer === 'elevated'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              🟪 高所（1.5F）
            </button>
          </div>
        </div>
        
        {/* Canvas area */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium flex items-center">
              <Grid className="w-4 h-4 mr-2" />
              移動可能範囲を塗ってください
            </h3>
            <span className="text-sm text-gray-500">1マス = 10cm</span>
          </div>
          <div className="overflow-auto max-h-[500px] border rounded-lg bg-gray-50 p-4">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={handleCanvasClick}
              className="cursor-crosshair"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
        </div>
        
        {/* Spot placement */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <h3 className="font-medium mb-3">スポット配置</h3>
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedSpot(selectedSpot === 'food' ? null : 'food')}
              disabled={activeLayer === 'elevated'}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                selectedSpot === 'food'
                  ? 'bg-orange-500 text-white'
                  : activeLayer === 'elevated'
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <span className="text-2xl">🍚</span>
              <span>ごはん</span>
            </button>
            <button
              onClick={() => setSelectedSpot(selectedSpot === 'toilet' ? null : 'toilet')}
              disabled={activeLayer === 'elevated'}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                selectedSpot === 'toilet'
                  ? 'bg-blue-500 text-white'
                  : activeLayer === 'elevated'
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <span className="text-2xl">🚽</span>
              <span>トイレ</span>
            </button>
            <button
              onClick={() => setSelectedSpot(selectedSpot === 'favorite' ? null : 'favorite')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                selectedSpot === 'favorite'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <span className="text-2xl">⭐</span>
              <span>お気に入り</span>
            </button>
          </div>
          {activeLayer === 'elevated' && (selectedSpot === 'food' || selectedSpot === 'toilet') && (
            <p className="text-sm text-red-500 mt-2">
              ※ ごはん・トイレは床（1F）にのみ配置できます
            </p>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex justify-between">
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 rounded-lg transition-colors flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>やり直し</span>
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>保存する</span>
          </button>
        </div>
      </main>
    </div>
  );
}