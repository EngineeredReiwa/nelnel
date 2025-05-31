'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

type Layer = 'floor' | 'elevated';
type SpotType = 'food' | 'toilet' | 'favorite';
type PaintMode = 'paint' | 'rectangle' | 'stamp';
type StampShape = 'square' | 'line';

interface Spot {
  type: SpotType;
  x: number;
  y: number;
  layer: Layer;
}

interface GridCell {
  floor: boolean;
  elevated: boolean;
}

export default function RoomSetupPage() {
  const [roomName, setRoomName] = useState('寝室');
  const [isEditingName, setIsEditingName] = useState(false);
  const [width, setWidth] = useState(4.0);
  const [height, setHeight] = useState(3.0);
  const [activeLayer, setActiveLayer] = useState<Layer>('floor');
  const [paintMode, setPaintMode] = useState<PaintMode>('paint');
  const [stampShape, setStampShape] = useState<StampShape>('square');
  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [selectedSpotType, setSelectedSpotType] = useState<SpotType | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragEnd, setDragEnd] = useState<{ x: number; y: number } | null>(null);
  const [history, setHistory] = useState<{ grid: GridCell[][], spots: Spot[] }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const CELL_SIZE = 30; // pixels per 10cm cell
  const CELLS_PER_METER = 10;

  // Initialize grid based on room size
  useEffect(() => {
    const widthCells = Math.floor(width * CELLS_PER_METER);
    const heightCells = Math.floor(height * CELLS_PER_METER);
    
    const newGrid: GridCell[][] = Array(heightCells).fill(null).map(() =>
      Array(widthCells).fill(null).map(() => ({ floor: false, elevated: false }))
    );
    
    setGrid(newGrid);
    setSpots([]);
    setHistory([]);
  }, [width, height]);

  // Save current state to history
  const saveToHistory = useCallback(() => {
    setHistory(prev => [...prev, { 
      grid: grid.map(row => row.map(cell => ({ ...cell }))), 
      spots: [...spots] 
    }]);
  }, [grid, spots]);

  // Undo last action
  const undo = useCallback(() => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setGrid(lastState.grid);
      setSpots(lastState.spots);
      setHistory(prev => prev.slice(0, -1));
    }
  }, [history]);

  // Fill all floor cells
  const fillAllFloor = useCallback(() => {
    saveToHistory();
    setGrid(prev => prev.map(row => 
      row.map(cell => ({ ...cell, floor: true }))
    ));
  }, [saveToHistory]);

  // Get cell coordinates from mouse position
  const getCellCoords = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / CELL_SIZE);
    const y = Math.floor((e.clientY - rect.top) / CELL_SIZE);
    
    if (x >= 0 && x < grid[0]?.length && y >= 0 && y < grid.length) {
      return { x, y };
    }
    return null;
  }, [grid]);

  // Paint or unpaint a single cell
  const toggleCell = useCallback((x: number, y: number) => {
    setGrid(prev => {
      const newGrid = [...prev];
      if (newGrid[y] && newGrid[y][x]) {
        newGrid[y][x] = { ...newGrid[y][x] };
        newGrid[y][x][activeLayer] = !newGrid[y][x][activeLayer];
      }
      return newGrid;
    });
  }, [activeLayer]);

  // Paint rectangle area
  const paintRectangle = useCallback((startX: number, startY: number, endX: number, endY: number, paint: boolean) => {
    const minX = Math.min(startX, endX);
    const maxX = Math.max(startX, endX);
    const minY = Math.min(startY, endY);
    const maxY = Math.max(startY, endY);
    
    setGrid(prev => {
      const newGrid = prev.map(row => row.map(cell => ({ ...cell })));
      for (let y = minY; y <= maxY && y < newGrid.length; y++) {
        for (let x = minX; x <= maxX && x < newGrid[0].length; x++) {
          newGrid[y][x][activeLayer] = paint;
        }
      }
      return newGrid;
    });
  }, [activeLayer]);

  // Paint stamp shape
  const paintStamp = useCallback((centerX: number, centerY: number) => {
    saveToHistory();
    
    if (stampShape === 'square') {
      // 3x3 square stamp
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const x = centerX + dx;
          const y = centerY + dy;
          if (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length) {
            setGrid(prev => {
              const newGrid = [...prev];
              newGrid[y][x] = { ...newGrid[y][x], [activeLayer]: true };
              return newGrid;
            });
          }
        }
      }
    } else if (stampShape === 'line') {
      // Horizontal line stamp (5 cells wide)
      for (let dx = -2; dx <= 2; dx++) {
        const x = centerX + dx;
        if (centerY >= 0 && centerY < grid.length && x >= 0 && x < grid[0].length) {
          setGrid(prev => {
            const newGrid = [...prev];
            newGrid[centerY][x] = { ...newGrid[centerY][x], [activeLayer]: true };
            return newGrid;
          });
        }
      }
    }
  }, [activeLayer, stampShape, grid, saveToHistory]);

  // Handle mouse down
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCellCoords(e);
    if (!coords) return;
    
    if (selectedSpotType) {
      // Place spot
      const canPlace = grid[coords.y][coords.x][activeLayer];
      if (canPlace) {
        if (selectedSpotType === 'favorite' || activeLayer === 'floor') {
          saveToHistory();
          setSpots(prev => [...prev, { type: selectedSpotType, x: coords.x, y: coords.y, layer: activeLayer }]);
        }
      }
      setSelectedSpotType(null);
    } else {
      // Paint mode
      if (paintMode === 'paint') {
        saveToHistory();
        setIsDrawing(true);
        toggleCell(coords.x, coords.y);
      } else if (paintMode === 'rectangle') {
        saveToHistory();
        setIsDrawing(true);
        setDragStart(coords);
        setDragEnd(coords);
      } else if (paintMode === 'stamp') {
        paintStamp(coords.x, coords.y);
      }
    }
  }, [getCellCoords, selectedSpotType, grid, activeLayer, paintMode, saveToHistory, toggleCell, paintStamp]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCellCoords(e);
    if (!coords || !isDrawing) return;
    
    if (paintMode === 'paint') {
      // Check if we're in a new cell
      const currentCell = grid[coords.y][coords.x][activeLayer];
      const shouldPaint = !grid[dragStart?.y || 0][dragStart?.x || 0][activeLayer];
      
      setGrid(prev => {
        const newGrid = [...prev];
        if (newGrid[coords.y] && newGrid[coords.y][coords.x]) {
          newGrid[coords.y][coords.x] = { ...newGrid[coords.y][coords.x] };
          newGrid[coords.y][coords.x][activeLayer] = shouldPaint;
        }
        return newGrid;
      });
    } else if (paintMode === 'rectangle' && dragStart) {
      setDragEnd(coords);
    }
  }, [getCellCoords, isDrawing, paintMode, grid, activeLayer, dragStart]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    if (paintMode === 'rectangle' && dragStart && dragEnd) {
      const shouldPaint = !grid[dragStart.y][dragStart.x][activeLayer];
      paintRectangle(dragStart.x, dragStart.y, dragEnd.x, dragEnd.y, shouldPaint);
    }
    setIsDrawing(false);
    setDragStart(null);
    setDragEnd(null);
  }, [paintMode, dragStart, dragEnd, grid, activeLayer, paintRectangle]);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    for (let y = 0; y <= grid.length; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL_SIZE);
      ctx.lineTo(grid[0]?.length * CELL_SIZE || 0, y * CELL_SIZE);
      ctx.stroke();
    }
    
    for (let x = 0; x <= (grid[0]?.length || 0); x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL_SIZE, 0);
      ctx.lineTo(x * CELL_SIZE, grid.length * CELL_SIZE);
      ctx.stroke();
    }
    
    // Draw cells
    grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell.floor && activeLayer === 'floor') {
          ctx.fillStyle = '#8B4513';
          ctx.fillRect(x * CELL_SIZE + 1, y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
        } else if (cell.floor && activeLayer === 'elevated') {
          ctx.fillStyle = 'rgba(139, 69, 19, 0.3)';
          ctx.fillRect(x * CELL_SIZE + 1, y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
        }
        
        if (cell.elevated && activeLayer === 'elevated') {
          ctx.fillStyle = '#9370DB';
          ctx.fillRect(x * CELL_SIZE + 1, y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
        } else if (cell.elevated && activeLayer === 'floor') {
          ctx.fillStyle = 'rgba(147, 112, 219, 0.3)';
          ctx.fillRect(x * CELL_SIZE + 1, y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
        }
      });
    });
    
    // Draw rectangle preview
    if (paintMode === 'rectangle' && isDrawing && dragStart && dragEnd) {
      const minX = Math.min(dragStart.x, dragEnd.x);
      const maxX = Math.max(dragStart.x, dragEnd.x);
      const minY = Math.min(dragStart.y, dragEnd.y);
      const maxY = Math.max(dragStart.y, dragEnd.y);
      
      ctx.strokeStyle = activeLayer === 'floor' ? '#8B4513' : '#9370DB';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(
        minX * CELL_SIZE,
        minY * CELL_SIZE,
        (maxX - minX + 1) * CELL_SIZE,
        (maxY - minY + 1) * CELL_SIZE
      );
      ctx.setLineDash([]);
    }
    
    // Draw spots
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    spots.forEach(spot => {
      if (spot.layer === activeLayer || spot.layer !== activeLayer) {
        const alpha = spot.layer === activeLayer ? 1 : 0.5;
        ctx.globalAlpha = alpha;
        ctx.fillText(
          spot.type === 'food' ? '🍚' : spot.type === 'toilet' ? '🚽' : '⭐',
          spot.x * CELL_SIZE + CELL_SIZE / 2,
          spot.y * CELL_SIZE + CELL_SIZE / 2
        );
      }
    });
    ctx.globalAlpha = 1;
  }, [grid, spots, activeLayer, paintMode, isDrawing, dragStart, dragEnd]);

  // Save room data
  const saveRoom = () => {
    const roomData = {
      name: roomName,
      width,
      height,
      grid,
      spots
    };
    console.log('Saving room data:', roomData);
    // TODO: Implement actual save functionality
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            ← 戻る
          </Link>
          <div className="flex items-center gap-2">
            <span>部屋名：</span>
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
                className="flex items-center gap-1 hover:text-blue-600"
              >
                {roomName} 🖊
              </button>
            )}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          {/* Room size input */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">部屋のサイズ（実寸入力）</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <label>横幅</label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  step="0.1"
                  min="1"
                  max="20"
                  className="w-20 px-2 py-1 border rounded"
                />
                <span>m</span>
              </div>
              <div className="flex items-center gap-2">
                <label>縦幅</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  step="0.1"
                  min="1"
                  max="20"
                  className="w-20 px-2 py-1 border rounded"
                />
                <span>m</span>
              </div>
            </div>
          </div>

          {/* Layer toggle */}
          <div className="mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveLayer('floor')}
                className={`px-4 py-2 rounded ${
                  activeLayer === 'floor'
                    ? 'bg-amber-700 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                🟫 床（1F）
              </button>
              <button
                onClick={() => setActiveLayer('elevated')}
                className={`px-4 py-2 rounded ${
                  activeLayer === 'elevated'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                🟪 高所（1.5F）
              </button>
            </div>
          </div>

          {/* Paint mode selection */}
          <div className="mb-4 flex gap-4 items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setPaintMode('paint')}
                className={`px-3 py-1 rounded ${
                  paintMode === 'paint' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                🖌️ 塗る
              </button>
              <button
                onClick={() => setPaintMode('rectangle')}
                className={`px-3 py-1 rounded ${
                  paintMode === 'rectangle' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                ⬜ 領域塗り
              </button>
              <button
                onClick={() => setPaintMode('stamp')}
                className={`px-3 py-1 rounded ${
                  paintMode === 'stamp' ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                📐 スタンプ
              </button>
            </div>
            
            {paintMode === 'stamp' && (
              <div className="flex gap-2">
                <button
                  onClick={() => setStampShape('square')}
                  className={`px-3 py-1 rounded ${
                    stampShape === 'square' ? 'bg-green-600 text-white' : 'bg-gray-200'
                  }`}
                >
                  ◼ 四角
                </button>
                <button
                  onClick={() => setStampShape('line')}
                  className={`px-3 py-1 rounded ${
                    stampShape === 'line' ? 'bg-green-600 text-white' : 'bg-gray-200'
                  }`}
                >
                  ➖ 線
                </button>
              </div>
            )}
            
            <button
              onClick={fillAllFloor}
              className="ml-auto px-4 py-1 bg-amber-600 text-white rounded hover:bg-amber-700"
            >
              🏠 床を全部塗る
            </button>
          </div>

          {/* Canvas */}
          <div className="mb-6 border-2 border-gray-300 rounded overflow-auto max-h-96">
            <canvas
              ref={canvasRef}
              width={grid[0]?.length * CELL_SIZE || 0}
              height={grid.length * CELL_SIZE || 0}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="cursor-crosshair"
            />
          </div>

          {/* Spot placement */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">スポット配置</h3>
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedSpotType('food')}
                disabled={activeLayer === 'elevated'}
                className={`px-4 py-2 rounded flex items-center gap-2 ${
                  selectedSpotType === 'food'
                    ? 'bg-orange-600 text-white'
                    : activeLayer === 'elevated'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                🍚 ごはん
              </button>
              <button
                onClick={() => setSelectedSpotType('toilet')}
                disabled={activeLayer === 'elevated'}
                className={`px-4 py-2 rounded flex items-center gap-2 ${
                  selectedSpotType === 'toilet'
                    ? 'bg-blue-600 text-white'
                    : activeLayer === 'elevated'
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                🚽 トイレ
              </button>
              <button
                onClick={() => setSelectedSpotType('favorite')}
                className={`px-4 py-2 rounded flex items-center gap-2 ${
                  selectedSpotType === 'favorite'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                ⭐ お気に入り
              </button>
            </div>
            {activeLayer === 'elevated' && (selectedSpotType === 'food' || selectedSpotType === 'toilet') && (
              <p className="text-sm text-red-600 mt-2">
                ※ ごはん・トイレは床（1F）にのみ配置できます
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={undo}
              disabled={history.length === 0}
              className={`px-6 py-2 rounded ${
                history.length === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              やり直し
            </button>
            <button
              onClick={saveRoom}
              className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              保存する
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}