
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface KeybindsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeybindViewer = ({ isOpen, onClose}: KeybindsProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);


  return (
    <div></div>
  );
};
