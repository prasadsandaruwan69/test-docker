import { useCallback, useEffect, useState } from 'react';
import './App.css';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  [10, 10],
  [9, 10],
  [8, 10],
];
const DIRECTIONS = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
};

function getRandomFood(snake) {
  const snakePositions = new Set(snake.map(([x, y]) => `${x},${y}`));
  const emptyCells = [];

  for (let x = 0; x < GRID_SIZE; x += 1) {
    for (let y = 0; y < GRID_SIZE; y += 1) {
      if (!snakePositions.has(`${x},${y}`)) {
        emptyCells.push([x, y]);
      }
    }
  }

  if (emptyCells.length === 0) {
    return [0, 0];
  }

  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function isCollision(head, snake) {
  const [x, y] = head;
  return (
    x < 0 ||
    x >= GRID_SIZE ||
    y < 0 ||
    y >= GRID_SIZE ||
    snake.some(([sx, sy]) => sx === x && sy === y)
  );
}

function App() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(DIRECTIONS.ArrowRight);
  const [food, setFood] = useState(() => getRandomFood(INITIAL_SNAKE));
  const [score, setScore] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(DIRECTIONS.ArrowRight);
    setFood(getRandomFood(INITIAL_SNAKE));
    setScore(0);
    setIsRunning(true);
    setGameOver(false);
  }, []);

  const handleKeyDown = useCallback(
    (event) => {
      const nextDirection = DIRECTIONS[event.key];
      if (gameOver && event.key === 'Enter') {
        resetGame();
        return;
      }

      if (!nextDirection) {
        return;
      }

      const [dx, dy] = nextDirection;
      const [cx, cy] = direction;
      if (dx === -cx && dy === -cy) {
        return;
      }

      setDirection(nextDirection);
    },
    [direction, gameOver, resetGame]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (!isRunning || gameOver) {
      return undefined;
    }

    const step = () => {
      setSnake((prevSnake) => {
        const [headX, headY] = prevSnake[0];
        const [dx, dy] = direction;
        const nextHead = [headX + dx, headY + dy];

        if (isCollision(nextHead, prevSnake)) {
          setGameOver(true);
          setIsRunning(false);
          return prevSnake;
        }

        const ateFood = nextHead[0] === food[0] && nextHead[1] === food[1];
        const nextSnake = [nextHead, ...prevSnake];

        if (!ateFood) {
          nextSnake.pop();
        } else {
          setFood(getRandomFood(nextSnake));
          setScore((prevScore) => prevScore + 1);
        }

        return nextSnake;
      });
    };

    const interval = setInterval(step, 120);
    return () => clearInterval(interval);
  }, [direction, food, gameOver, isRunning]);

  const snakeCells = new Set(snake.map(([x, y]) => `${x},${y}`));

  return (
    <div className="App">
      <div className="snake-game">
        <header className="game-header">
          <div>
            <h1>Snake Game</h1>
            <p>Use arrow keys to move. Press Enter to restart after game over.</p>
          </div>
          <div className="game-stats">
            <span>Score: {score}</span>
            <span>{gameOver ? 'Game Over' : isRunning ? 'Running' : 'Paused'}</span>
          </div>
        </header>

        <div className="board" role="grid">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);
            const cellKey = `${x},${y}`;
            const isSnake = snakeCells.has(cellKey);
            const isFood = food[0] === x && food[1] === y;

            return (
              <div
                key={cellKey}
                className={`cell ${isSnake ? 'snake' : ''} ${isFood ? 'food' : ''}`}
              />
            );
          })}
        </div>

        <div className="controls">
          <button type="button" onClick={resetGame}>
            Restart
          </button>
          <div className="control-hint">Press arrow keys to play.</div>
        </div>
      </div>
    </div>
  );
}

export default App;
