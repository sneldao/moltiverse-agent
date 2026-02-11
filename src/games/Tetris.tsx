'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Text, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Tetris constants
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 1;
const TICK_RATE = 500; // ms per tick

// Tetromino shapes
const SHAPES = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 0], [1, 1, 1]], // T
  [[1, 0, 0], [1, 1, 1]], // L
  [[0, 0, 1], [1, 1, 1]], // J
  [[0, 1, 1], [1, 1, 0]], // S
  [[1, 1, 0], [0, 1, 1]], // Z
];

const COLORS = [
  '#06b6d4', // I - cyan
  '#f59e0b', // O - yellow
  '#a855f7', // T - purple
  '#3b82f6', // L - blue
  '#ef4444', // J - red
  '#22c55e', // S - green
  '#ec4899', // Z - pink
];

type Board = (number | null)[][];

interface TetrisState {
  board: Board;
  currentPiece: {
    shape: number[][];
    color: string;
    x: number;
    y: number;
  } | null;
  score: number;
  level: number;
  lines: number;
  gameOver: boolean;
  paused: boolean;
}

// Tetris Game Component
function TetrisGame() {
  const [gameState, setGameState] = useState<TetrisState>({
    board: Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null)),
    currentPiece: null,
    score: 0,
    level: 1,
    lines: 0,
    gameOver: false,
    paused: false,
  });

  const lastTick = useRef(0);
  const [gameKey, setGameKey] = useState(0);

  // Initialize game
  useEffect(() => {
    spawnPiece(setGameState);
  }, [gameKey]);

  // Game loop
  useFrame((state) => {
    if (gameState.gameOver || gameState.paused) return;

    if (state.clock.elapsedTime * 1000 - lastTick.current > TICK_RATE / gameState.level) {
      lastTick.current = state.clock.elapsedTime * 1000;
      movePiece(setGameState, gameState, 0, -1);
    }
  });

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameOver) {
        if (e.key === 'r') restartGame();
        return;
      }

      switch (e.key.toLowerCase()) {
        case 'arrowleft':
        case 'a':
          movePiece(setGameState, gameState, -1, 0);
          break;
        case 'arrowright':
        case 'd':
          movePiece(setGameState, gameState, 1, 0);
          break;
        case 'arrowdown':
        case 's':
          movePiece(setGameState, gameState, 0, -1);
          break;
        case 'arrowup':
        case 'w':
          rotatePiece(setGameState, gameState);
          break;
        case ' ':
          hardDrop(setGameState, gameState);
          break;
        case 'p':
          setGameState(prev => ({ ...prev, paused: !prev.paused }));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  const restartGame = () => {
    setGameState({
      board: Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null)),
      currentPiece: null,
      score: 0,
      level: 1,
      lines: 0,
      gameOver: false,
      paused: false,
    });
    setGameKey(k => k + 1);
  };

  return (
    <group>
      {/* Render board */}
      <group position={[-BOARD_WIDTH / 2, 0, 0]}>
        {gameState.board.map((row, y) =>
          row.map((cell, x) => (
            <mesh
              key={`${x}-${y}`}
              position={[x, y, 0]}
            >
              <boxGeometry args={[0.95, 0.95, 0.5]} />
              <meshStandardMaterial
                color={cell !== null ? COLORS[cell] : '#111'}
                emissive={cell !== null ? COLORS[cell] : '#000'}
                emissiveIntensity={0.2}
                metalness={0.3}
                roughness={0.7}
              />
            </mesh>
          ))
        )}
      </group>

      {/* Current piece */}
      {gameState.currentPiece && (
        <group position={[
          gameState.currentPiece.x - BOARD_WIDTH / 2,
          gameState.currentPiece.y,
          0.3
        ]}>
          {gameState.currentPiece.shape.map((row, y) =>
            row.map((cell, x) => (
              cell && (
                <mesh key={`piece-${x}-${y}`} position={[x, y, 0]}>
                  <boxGeometry args={[0.95, 0.95, 0.5]} />
                  <meshStandardMaterial
                    color={gameState.currentPiece!.color}
                    emissive={gameState.currentPiece!.color}
                    emissiveIntensity={0.3}
                    metalness={0.3}
                    roughness={0.7}
                  />
                </mesh>
              )
            ))
          )}
        </group>
      )}

      {/* UI Overlay */}
      <group position={[BOARD_WIDTH / 2 + 2, BOARD_HEIGHT / 2, 0]}>
        <Text position={[0, BOARD_HEIGHT / 2 + 2, 0]} fontSize={0.8} color="#06b6d4" anchorX="left">
          Score: {gameState.score}
        </Text>
        <Text position={[0, BOARD_HEIGHT / 2 + 1, 0]} fontSize={0.5} color="#888" anchorX="left">
          Level: {gameState.level}
        </Text>
        <Text position={[0, BOARD_HEIGHT / 2 + 0.5, 0]} fontSize={0.5} color="#888" anchorX="left">
          Lines: {gameState.lines}
        </Text>

        {gameState.gameOver && (
          <group position={[0, BOARD_HEIGHT / 2 - 2, 0]}>
            <Text fontSize={1} color="#ef4444">
              GAME OVER
            </Text>
            <Text position={[0, -1, 0]} fontSize={0.5} color="#888">
              Press R to restart
            </Text>
          </group>
        )}

        {gameState.paused && (
          <Text position={[0, BOARD_HEIGHT / 2 - 2, 0]} fontSize={1} color="#f59e0b">
            PAUSED
          </Text>
        )}
      </group>

      {/* Controls hint */}
      <group position={[-BOARD_WIDTH / 2 - 4, -2, 0]}>
        <Text fontSize={0.3} color="#666" anchorX="left">
          ← → Move | ↑ Rotate | ↓ Soft | Space Hard | P Pause
        </Text>
      </group>
    </group>
  );
}

// Spawn new piece
function spawnPiece(setState: React.Dispatch<React.SetStateAction<TetrisState>>) {
  setState(prev => {
    const shapeIndex = Math.floor(Math.random() * SHAPES.length);
    const shape = SHAPES[shapeIndex];
    const color = COLORS[shapeIndex];

    // Check if spawn position is valid
    const newBoard = prev.board.map(row => [...row]);
    const startX = Math.floor(BOARD_WIDTH / 2) - Math.floor(shape[0].length / 2);
    const startY = BOARD_HEIGHT - shape.length;

    // Check collision
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const boardY = startY + y;
          const boardX = startX + x;
          if (boardY < BOARD_HEIGHT && newBoard[boardY][boardX] !== null) {
            // Game over
            return { ...prev, currentPiece: null, gameOver: true };
          }
        }
      }
    }

    return {
      ...prev,
      currentPiece: { shape, color, x: startX, y: startY },
    };
  });
}

// Move piece
function movePiece(
  setState: React.Dispatch<React.SetStateAction<TetrisState>>,
  state: TetrisState,
  dx: number,
  dy: number
) {
  const piece = state.currentPiece;
  if (!piece) return;

  const newX = piece.x + dx;
  const newY = piece.y + dy;

  if (canMove(state.board, piece.shape, newX, newY)) {
    setState(prev => ({
      ...prev,
      currentPiece: { ...piece, x: newX, y: newY },
    }));
  } else if (dy < 0) {
    // Piece hit bottom, lock it
    lockPiece(setState, state);
  }
}

// Check if move is valid
function canMove(board: Board, shape: number[][], x: number, y: number): boolean {
  for (let py = 0; py < shape.length; py++) {
    for (let px = 0; px < shape[py].length; px++) {
      if (shape[py][px]) {
        const boardX = x + px;
        const boardY = y + py;

        if (boardX < 0 || boardX >= BOARD_WIDTH || boardY < 0) {
          return false;
        }
        if (boardY < BOARD_HEIGHT && board[boardY][boardX] !== null) {
          return false;
        }
      }
    }
  }
  return true;
}

// Rotate piece
function rotatePiece(setState: React.Dispatch<React.SetStateAction<TetrisState>>, state: TetrisState) {
  const piece = state.currentPiece;
  if (!piece) return;

  const shape = piece.shape;
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated: number[][] = [];

  for (let x = 0; x < cols; x++) {
    rotated[x] = [];
    for (let y = rows - 1; y >= 0; y--) {
      rotated[x][cols - 1 - y] = shape[y][x];
    }
  }

  if (canMove(state.board, rotated, piece.x, piece.y)) {
    setState(prev => ({
      ...prev,
      currentPiece: { ...piece, shape: rotated },
    }));
  }
}

// Hard drop
function hardDrop(setState: React.Dispatch<React.SetStateAction<TetrisState>>, state: TetrisState) {
  const piece = state.currentPiece;
  if (!piece) return;

  let newY = piece.y;
  while (canMove(state.board, piece.shape, piece.x, newY - 1)) {
    newY--;
  }

  setState(prev => {
    const updated = { ...prev, currentPiece: { ...piece, y: newY } };
    lockPiece(() => {}, updated);
    return updated;
  });
}

// Lock piece and check lines
function lockPiece(
  setState: React.Dispatch<React.SetStateAction<TetrisState>>,
  state: TetrisState
) {
  const piece = state.currentPiece;
  if (!piece) return;

  const newBoard = state.board.map(row => [...row]);

  // Place piece on board
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x <piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardY = piece.y + y;
        const boardX = piece.x + x;
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = COLORS.indexOf(piece.color);
        }
      }
    }
  }

  // Check for completed lines
  let linesCleared = 0;
  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    if (newBoard[y].every(cell => cell !== null)) {
      newBoard.splice(y, 1);
      newBoard.unshift(Array(BOARD_WIDTH).fill(null));
      linesCleared++;
      y++; // Check same row again
    }
  }

  // Calculate score
  const lineScores = [0, 100, 300, 500, 800];
  const points = lineScores[linesCleared] * state.level;
  const newLevel = Math.floor((state.lines + linesCleared) / 10) + 1;

  spawnPiece(setState);
  setState(prev => ({
    ...prev,
    board: newBoard,
    currentPiece: null,
    score: prev.score + points,
    level: newLevel,
    lines: prev.lines + linesCleared,
  }));
}

// Export wrapper
export default function TetrisWrapper() {
  return (
    <group>
      <TetrisGame />
      <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 4} />
    </group>
  );
}
