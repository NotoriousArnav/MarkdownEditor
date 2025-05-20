
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HistoryManager } from "@/utils/historyManager";
import { ScrollArea } from "@/components/ui/scroll-area";

interface HistoryViewerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryManager<string>;
  currentContent: string;
  setContent: (content: string) => void;
}

export const HistoryViewer = ({ isOpen, onClose, history, currentContent, setContent }: HistoryViewerProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Get all history items
  const historyItems = history.getHistory();

  const handleRestore = () => {
    if (selectedIndex !== null && historyItems[selectedIndex]) {
      setContent(historyItems[selectedIndex]);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit History</DialogTitle>
        </DialogHeader>

        <div className="flex flex-1 gap-4 min-h-0 overflow-hidden">
          <div className="w-1/3 border rounded-md">
            <ScrollArea className="h-full">
              <div className="p-2">
                {historyItems.map((item, index) => (
                  <div
                    key={index}
                    className={`p-2 mb-1 cursor-pointer rounded truncate hover:bg-gray-100 dark:hover:bg-gray-700 ${selectedIndex === index ? 'bg-gray-200 dark:bg-gray-600' : ''}`}
                    onClick={() => setSelectedIndex(index)}
                  >
                    <div className="font-medium">Version {index + 1}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {item.substring(0, 100)}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div className="w-2/3 border rounded-md">
            <ScrollArea className="h-full">
              {selectedIndex !== null ? (
                <pre className="p-4 font-mono text-sm whitespace-pre-wrap">
                  {historyItems[selectedIndex]}
                </pre>
              ) : (
                <div className="p-4 text-gray-400 dark:text-gray-500 flex items-center justify-center h-full">
                  Select a version to preview
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleRestore}
            disabled={selectedIndex === null}
          >
            Restore This Version
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
