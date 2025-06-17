
import React, { useState } from 'react';
import { Task } from '@/schemas/taskSchemas';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Download, FileJson, Copy, Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ExportModalProps {
  taskList: Task[];
}

const ExportModal: React.FC<ExportModalProps> = ({ taskList }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const exportData = {
    version: "1.0",
    timestamp: new Date().toISOString(),
    taskCount: taskList.length,
    tasks: taskList
  };

  const jsonString = JSON.stringify(exportData, null, 2);

  const downloadJSON = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `robotic-arm-tasks-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Export Successful",
      description: "Task list has been downloaded as JSON file.",
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied to Clipboard",
        description: "JSON data has been copied to your clipboard.",
      });
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      toast({
        title: "Copy Failed",
        description: "Unable to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2">
          <FileJson className="h-4 w-4" />
          <span>Export Tasks</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileJson className="h-5 w-5" />
            <span>Export Task List</span>
          </DialogTitle>
          <DialogDescription>
            Export your robotic arm task sequence as a JSON file or copy to clipboard.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Export Summary */}
          <Card className="p-4">
            <h3 className="font-medium text-sm text-gray-700 mb-3">Export Summary</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Total Tasks:</span>
                <div className="font-medium">{taskList.length}</div>
              </div>
              <div>
                <span className="text-gray-500">Export Date:</span>
                <div className="font-medium text-xs">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </Card>

          {/* JSON Preview */}
          <div>
            <h3 className="font-medium text-sm text-gray-700 mb-2">JSON Preview</h3>
            <Card className="p-4 bg-gray-900 text-green-400 max-h-60 overflow-y-auto">
              <pre className="text-xs font-mono whitespace-pre-wrap">
                {jsonString}
              </pre>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between space-x-3">
            <Button
              variant="outline"
              onClick={copyToClipboard}
              className="flex items-center space-x-2"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
            </Button>
            
            <Button
              onClick={downloadJSON}
              className="flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Download JSON</span>
            </Button>
          </div>

          {/* Task List Preview */}
          {taskList.length > 0 && (
            <div>
              <h3 className="font-medium text-sm text-gray-700 mb-2">Tasks to Export</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {taskList.map((task, index) => (
                  <div key={task.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                    <span>{index + 1}. {task.type} - {task.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;
