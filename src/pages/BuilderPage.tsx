
import React, { useState } from 'react';
import TaskBlockEditor from '../components/TaskBlockEditor';
import ArmPreview from '../components/ArmPreview';
import ExportModal from '../components/ExportModal';
import { Task } from '@/interfaces/Task';
import { DESC_FORMAT, getDefaultParams } from '@/components/tasks/UIConfig';

const BuilderPage = () => {
  const [taskList, setTaskList] = useState<Task[]>([
    {
      id: '1',
      type: 'move',
      parameters: getDefaultParams('move'),
      description: DESC_FORMAT.move(getDefaultParams('move'))
    },
    {
      id: '2',
      type: 'grip',
      parameters: getDefaultParams('grip'),
      description: DESC_FORMAT.grip(getDefaultParams('grip'))
    }
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">
              Robotic Arm Builder
            </h1>
            <ExportModal taskList={taskList} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-12rem)]">
          {/* Left Column - Task Block Editor */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Task Editor
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Drag and drop blocks to create robot tasks
              </p>
            </div>
            <div className="p-6">
              <TaskBlockEditor taskList={taskList} setTaskList={setTaskList} />
            </div>
          </div>

          {/* Right Column - Arm Preview */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Arm Preview
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Real-time visualization of arm movements
              </p>
            </div>
            <div className="p-6">
              <ArmPreview taskList={taskList} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderPage;
