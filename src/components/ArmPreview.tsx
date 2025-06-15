import React from 'react';
import { Task } from '../pages/BuilderPage';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ArmPreviewProps {
  taskList: Task[];
}

const ArmPreview: React.FC<ArmPreviewProps> = ({ taskList }) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [currentPosition, setCurrentPosition] = React.useState({ x: 0, y: 0, z: 0 });

  // Type guard for move tasks
  const isMoveTask = (task: Task): task is Task & { parameters: { x: number; y: number; z: number } } => {
    return (
      task.type === "move" &&
      typeof task.parameters?.x === "number" &&
      typeof task.parameters?.y === "number" &&
      typeof task.parameters?.z === "number"
    );
  };

  const playTasks = () => {
    if (!taskList.length) return;
    setIsPlaying(true);
    let index = 0;

    const animateMove = (from: { x: number; y: number; z: number }, to: { x: number; y: number; z: number }, duration: number, onComplete: () => void) => {
      const start = performance.now();

      const animate = (time: number) => {
        const elapsed = time - start;
        const progress = Math.min(elapsed / duration, 1);
        const newPos = {
          x: from.x + (to.x - from.x) * progress,
          y: from.y + (to.y - from.y) * progress,
          z: from.z + (to.z - from.z) * progress,
        };
        setCurrentPosition(newPos);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          onComplete();
        }
      };

      requestAnimationFrame(animate);
    };

    const runNextTask = () => {
      if (index >= taskList.length) {
        setIsPlaying(false);
        return;
      }

      const task = taskList[index];
      setCurrentIndex(index);

      if (isMoveTask(task)) {
        animateMove(currentPosition, task.parameters, 1000, () => {
          setCurrentPosition(task.parameters);
          index++;
          setTimeout(runNextTask, 200);
        });
      } else {
        index++;
        setTimeout(runNextTask, 1000);
      }
    };

    runNextTask();
  };

  const resetPreview = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
    setCurrentPosition({ x: 0, y: 0, z: 0 });
  };

  const latestMove = React.useMemo(() => {
    const last = [...taskList]
      .reverse()
      .find((task) => task.type.toLowerCase() === "move");
    if (!last) return null;
    return last.parameters;
  }, [taskList]);
  return (
    <div className="space-y-4">
      {/* Preview Area */}
      <Card className="p-8 bg-gray-900 text-white min-h-[300px] flex flex-col items-center justify-center">
        <div className="flex space-x-4 mb-2">
          <button
            onClick={playTasks}
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={isPlaying}
          >
            Play
          </button>
          <button
            onClick={resetPreview}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Reset
          </button>
        </div>
        <svg width="300" height="300" viewBox="0 0 300 300">
          <circle cx="150" cy="150" r="4" fill="white" />
          {currentIndex !== null && (
            <>
              <line
                x1="150"
                y1="150"
                x2={150 + currentPosition.x}
                y2={150 - currentPosition.y}
                stroke="cyan"
                strokeWidth="4"
              />
              <circle
                cx={150 + currentPosition.x}
                cy={150 - currentPosition.y}
                r="6"
                fill={`rgb(255, ${255 - currentPosition.z * 2}, ${255 - currentPosition.z * 2})`}
              />
              <text
                x={150 + currentPosition.x + 10}
                y={150 - currentPosition.y}
                fontSize="10"
                fill="white"
              >
                Z: {currentPosition.z}
              </text>
            </>
          )}
        </svg>
      </Card>

      {/* Task Execution Status */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Execution Preview:</h3>
        {taskList.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No tasks to preview</p>
        ) : (
          <div className="space-y-2">
            {taskList.map((task, index) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className="text-xs">
                    Step {index + 1}
                  </Badge>
                  <span className="text-sm font-medium">{task.type}</span>
                  <span className="text-xs text-gray-500">{task.description}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  Ready
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Arm Status */}
      <Card className="p-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Arm Status</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Position:</span>
            <div className="font-mono text-xs mt-1">
              X: 0.0, Y: 0.0, Z: 0.0
            </div>
          </div>
          <div>
            <span className="text-gray-500">Status:</span>
            <div className="flex items-center mt-1">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-xs">Ready</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ArmPreview;
