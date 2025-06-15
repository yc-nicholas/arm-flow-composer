import React, { useState, useRef, useEffect } from 'react';
import { Task } from '../pages/BuilderPage';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface ArmPreviewProps {
  taskList: Task[];
}

const ArmPreview: React.FC<ArmPreviewProps> = ({ taskList }) => {
  const [selectedPosition, setSelectedPosition] = useState<[number, number, number]>([0, 0, 0]);

  const meshRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.position.set(...selectedPosition);
    }
  }, [selectedPosition]);

  return (
    <div className="space-y-4">
      {/* Preview Area */}
      <Card className="p-2 bg-black text-white min-h-[300px]">
        <Canvas camera={{ position: [5, 5, 5] }}>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <primitive object={new THREE.GridHelper(10, 10)} />
          <primitive object={new THREE.AxesHelper(5)} />
          <mesh ref={meshRef}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="orange" />
          </mesh>
          <OrbitControls />
        </Canvas>
      </Card>

      {/* Task Execution Status */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Execution Preview:</h3>
        {taskList.length === 0 ? (
          <p className="text-gray-500 text-sm italic">No tasks to preview</p>
        ) : (
          <div className="space-y-2">
            {taskList.map((task, index) => (
              <div
                key={task.id}
                onClick={() => {
                  if (task.type === 'move' && task.parameters) {
                    const { x, y, z } = task.parameters;
                    setSelectedPosition([x || 0, y || 0, z || 0]);
                  }
                }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border cursor-pointer hover:bg-gray-100 transition"
              >
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
              X: {selectedPosition[0]}, Y: {selectedPosition[1]}, Z: {selectedPosition[2]}
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
