
import React from 'react';
import { Task } from '../pages/BuilderPage';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, GripVertical } from 'lucide-react';

interface TaskBlockEditorProps {
  taskList: Task[];
  setTaskList: (tasks: Task[]) => void;
}

const TaskBlockEditor: React.FC<TaskBlockEditorProps> = ({ taskList, setTaskList }) => {
  const addTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      type: 'move',
      parameters: { x: 0, y: 0, z: 0 },
      description: 'New move task'
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
      {/* Drag and Drop Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <div className="text-gray-500 mb-4">
          <Plus className="mx-auto h-12 w-12 mb-2" />
          <p className="text-lg font-medium">Drag & Drop Interface</p>
          <p className="text-sm">Coming soon - Full drag and drop functionality</p>
        </div>
        <Button onClick={addTask} className="mt-4">
          <Plus className="h-4 w-4 mr-2" />
          Add Task Block
        </Button>
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
                    <p className="text-xs text-gray-500 mt-1">
                      {JSON.stringify(task.parameters)}
                    </p>
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
