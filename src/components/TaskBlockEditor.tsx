
import React from 'react';
import { Task } from '../pages/BuilderPage';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, GripVertical } from 'lucide-react';

interface TaskBlockEditorProps {
  taskList: Task[];
  setTaskList: (tasks: Task[]) => void;
}

type TaskType = 'move' | 'grip' | 'release' | 'wait';

const defaultParameters: Record<TaskType, any> = {
  move: { x: 0, y: 0, z: 0 },
  grip: { force: 50 },
  release: {},
  wait: { duration: 1 }
};

const TaskBlockEditor: React.FC<TaskBlockEditorProps> = ({ taskList, setTaskList }) => {
  const addTask = (type: TaskType) => {
    const newTask: Task = {
      id: Date.now().toString(),
      type,
      parameters: defaultParameters[type],
      description: `New ${type} task`
    };
    setTaskList([...taskList, newTask]);
  };

  const removeTask = (taskId: string) => {
    setTaskList(taskList.filter(task => task.id !== taskId));
  };

  const taskTypeColors = {
    move: 'bg-blue-100 border-blue-300',
    grip: 'bg-green-100 border-green-300',
    release: 'bg-red-100 border-red-300',
    wait: 'bg-yellow-100 border-yellow-300'
  };

  return (
    <div className="space-y-4">
      {/* Task Block Buttons */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <p className="text-sm font-medium text-gray-600 mb-2">Add Task Block:</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button onClick={() => addTask('move')}>MoveTo</Button>
          <Button onClick={() => addTask('grip')}>Grip</Button>
          <Button onClick={() => addTask('release')}>Release</Button>
          <Button onClick={() => addTask('wait')}>Wait</Button>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Current Tasks:</h3>
        {taskList.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No tasks added yet</p>
        ) : (
          taskList.map((task, index) => (
            <Card 
              key={task.id} 
              className={`p-4 ${taskTypeColors[task.type as keyof typeof taskTypeColors] || 'bg-gray-100 border-gray-300'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-mono bg-white px-2 py-1 rounded">
                        {index + 1}
                      </span>
                      <span className="font-medium text-sm uppercase tracking-wide">
                        {task.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {task.description}
                    </p>
                    <div className="mt-2 space-y-1">
                      {Object.entries(task.parameters).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-2">
                          <label className="text-xs text-gray-600 w-20">{key}</label>
                          <input
                            className="text-sm px-2 py-1 border rounded w-24"
                            type="number"
                            value={value}
                            onChange={(e) => {
                              const newTasks = [...taskList];
                              newTasks[index].parameters[key] = Number(e.target.value);
                              setTaskList(newTasks);
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTask(task.id)}
                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskBlockEditor;
