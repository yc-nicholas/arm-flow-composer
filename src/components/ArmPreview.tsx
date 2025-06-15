
import React from 'react';
import { Task } from '../pages/BuilderPage';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ArmPreviewProps {
  taskList: Task[];
}

const ArmPreview: React.FC<ArmPreviewProps> = ({ taskList }) => {
  return (
    <div className="space-y-4">
      {/* Preview Area */}
      <Card className="p-8 bg-gray-900 text-white min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🦾</div>
          <h3 className="text-xl font-semibold mb-2">[2D Arm Preview Coming Soon]</h3>
          <p className="text-gray-400 text-sm">
            Interactive arm simulation will be displayed here
          </p>
        </div>
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
