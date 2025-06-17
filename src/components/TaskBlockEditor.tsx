import React from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '@/schemas/taskSchemas';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, GripVertical } from 'lucide-react';
import { DESC_FORMAT, getDefaultParams, TaskComponentMap } from '@/components/tasks/UIConfig';

type TaskType = keyof typeof TaskComponentMap;

interface TaskBlockEditorProps {
  taskList: Task[];
  setTaskList: (tasks: Task[]) => void;
}

const TaskBlockEditor: React.FC<TaskBlockEditorProps> = ({ taskList, setTaskList }) => {
  const addTask = (type: TaskType) => {
    const params = getDefaultParams(type);              // deep-clone defaults
    const description = DESC_FORMAT[type](params);      // build first sentence
  
    const newTask: Task = {
      id: Date.now().toString(),
      type,
      parameters: params,
      description,
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

  const updateTask = (newTask: Task) => {
    setTaskList(prev => prev.map(t => (t.id === newTask.id ? newTask : t)));
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
                {(() => {
                  const Comp = TaskComponentMap[task.type as TaskType];
                  return (
                    <Comp task={task} onUpdate={updateTask} />
                  );
                })()}
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
          {Object.keys(TaskComponentMap).map((type) => (
            <Button key={type} onClick={() => addTask(type as TaskType)}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
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
