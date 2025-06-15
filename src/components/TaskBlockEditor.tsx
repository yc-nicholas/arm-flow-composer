import React from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../pages/BuilderPage';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, GripVertical } from 'lucide-react';

const InputField: React.FC<{
  taskIndex: number;
  paramKey: string;
  paramValue: number;
  onChange: (taskIndex: number, key: string, value: number) => void;
}> = ({ taskIndex, paramKey, paramValue, onChange }) => {
  const [inputValue, setInputValue] = React.useState<string>(
    ['x', 'y', 'z'].includes(paramKey) ? String(paramValue * 1000) : String(paramValue)
  );

  React.useEffect(() => {
    setInputValue(
      ['x', 'y', 'z'].includes(paramKey) ? String(paramValue * 1000) : String(paramValue)
    );
  }, [paramKey, paramValue]);

  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-gray-600 w-28">
        {paramKey}
        {paramKey === 'x' || paramKey === 'y' || paramKey === 'z'
          ? ' (mm)'
          : paramKey === 'force'
          ? ' (%)'
          : paramKey === 'duration'
          ? ' (sec)'
          : ''}
      </label>
      <input
        className="text-sm px-2 py-1 border rounded w-24"
        type="number"
        step="any"
        inputMode="decimal"
        value={inputValue}
        onChange={(e) => {
          const value = e.target.value;
          setInputValue(value);
        }}
        onBlur={() => {
          const numericValue = Number(inputValue);
          if (!isNaN(numericValue)) {
            const finalValue = ['x', 'y', 'z'].includes(paramKey) ? numericValue / 1000 : numericValue;
            onChange(taskIndex, paramKey, finalValue);
          }
        }}
        onKeyDown={(e) => {
          // Allow characters typically used in numeric input
          const allowedKeys = [
            '-', '.', 'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab',
          ];
          if (allowedKeys.includes(e.key) || /^[0-9]$/.test(e.key)) {
            e.stopPropagation();
          } else {
            e.preventDefault();
          }
        }}
        onPointerDown={(e) => e.stopPropagation()}
      />
    </div>
  );
};

interface TaskBlockEditorProps {
  taskList: Task[];
  setTaskList: (tasks: Task[]) => void;
}

type TaskType = 'move' | 'grip' | 'release' | 'wait';

const defaultParameters: Record<TaskType, Record<string, number>> = {
  move: { x: 0, y: 0, z: 0 },
  grip: { force: 50 },
  release: {},
  wait: { duration: 1 }
};

const TaskBlockEditor: React.FC<TaskBlockEditorProps> = ({ taskList, setTaskList }) => {
  const addTask = (type: TaskType) => {
    let description = '';
    if (type === 'move') {
      description = `Move to Position (${defaultParameters.move.x}, ${defaultParameters.move.y}, ${defaultParameters.move.z})`;
    } else if (type === 'grip') {
      description = `Grip with ${defaultParameters.grip.force} force`;
    } else if (type === 'release') {
      description = `Release gripper`;
    } else if (type === 'wait') {
      description = `Wait for ${defaultParameters.wait.duration} sec`;
    }
    const newTask: Task = {
      id: Date.now().toString(),
      type,
      parameters: defaultParameters[type],
      description
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



  // Drag-and-drop logic
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = taskList.findIndex(t => t.id === active.id);
      const newIndex = taskList.findIndex(t => t.id === over.id);
      setTaskList(arrayMove(taskList, oldIndex, newIndex));
    }
  };

  const handleParameterChange = (
    taskIndex: number,
    key: string,
    value: number
  ) => {
    const newTasks = [...taskList];
    const updatedParams = {
      ...newTasks[taskIndex].parameters,
      [key]: value
    };
    let updatedDescription = '';
    switch (newTasks[taskIndex].type) {
      case 'move':
        updatedDescription = `Move to Position (${updatedParams.x}, ${updatedParams.y}, ${updatedParams.z})`;
        break;
      case 'grip':
        updatedDescription = `Grip with ${updatedParams.force} force`;
        break;
      case 'wait':
        updatedDescription = `Wait for ${updatedParams.duration} sec`;
        break;
      case 'release':
        updatedDescription = 'Release gripper';
        break;
    }
    newTasks[taskIndex] = {
      ...newTasks[taskIndex],
      parameters: updatedParams,
      description: updatedDescription
    };
    setTaskList(newTasks);
  };

  // Sortable Task Card
  const SortableTaskCard: React.FC<{ task: Task; index: number }> = ({ task, index }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({ id: task.id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
    return (
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
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
                {Object.entries(task.parameters).map(([key, value]) => {
                  return (
                    <InputField
                      key={key}
                      taskIndex={index}
                      paramKey={key}
                      paramValue={value}
                      onChange={handleParameterChange}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation(); // Prevent drag conflict
              removeTask(task.id);
            }}
            onPointerDown={(e) => e.stopPropagation()} // Prevent drag conflict on pointer down
            className="text-red-600 hover:text-red-800 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    );
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
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={taskList.map(t => t.id)} strategy={verticalListSortingStrategy}>
              {taskList.map((task, index) => (
                <SortableTaskCard key={task.id} task={task} index={index} />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
};

export default TaskBlockEditor;
