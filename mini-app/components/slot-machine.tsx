'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Share } from '@/components/share';
import { url } from '@/lib/metadata';

const fruits = ['apple', 'banana', 'cherry', 'lemon'];

function getRandomFruit() {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export default function SlotMachine() {
  const [grid, setGrid] = useState<string[][]>(
    Array.from({ length: 3 }, () => Array.from({ length: 3 }, getRandomFruit))
  );
  const [spinning, setSpinning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    intervalRef.current = setInterval(() => {
      setGrid(prev => {
        const newGrid = prev.map(row => [...row]);
        // shift each column down
        for (let col = 0; col < 3; col++) {
          const newCol = [getRandomFruit(), ...prev.slice(0, 2).map(row => row[col])];
          for (let row = 0; row < 3; row++) {
            newGrid[row][col] = newCol[row];
          }
        }
        return newGrid;
      });
    }, 200);
    setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setSpinning(false);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // win condition computed directly in render
  const rowsWin = grid.some(row => row.every(f => f === row[0]));
  const colsWin = [0, 1, 2].some(col => grid.every(row => row[col] === grid[0][col]));
  const win = !spinning && (rowsWin || colsWin);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.flat().map((fruit, idx) => (
          <img key={idx} src={`/${fruit}.png`} alt={fruit} width={64} height={64} />
        ))}
      </div>
      <Button onClick={spin} disabled={spinning}>Spin</Button>
      {win && (
        <div className="flex flex-col items-center gap-2">
          <span className="text-xl font-bold">You win!</span>
          <Share text={`I just won the Fruit Slot Machine! ${url}`} />
        </div>
      )}
    </div>
  );
}
