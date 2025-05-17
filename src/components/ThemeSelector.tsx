
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MarkdownTheme, themes } from "@/utils/themeOptions";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ThemeSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: MarkdownTheme;
  onThemeChange: (theme: MarkdownTheme) => void;
}

export const ThemeSelector = ({ 
  isOpen, 
  onClose, 
  currentTheme, 
  onThemeChange 
}: ThemeSelectorProps) => {
  const [selectedTheme, setSelectedTheme] = useState<MarkdownTheme>(currentTheme);

  const handleSave = () => {
    onThemeChange(selectedTheme);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Markdown Theme</DialogTitle>
          <DialogDescription>
            Select a theme for the Markdown preview.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup 
            value={selectedTheme} 
            onValueChange={(value) => setSelectedTheme(value as MarkdownTheme)}
            className="space-y-3"
          >
            {themes.map((theme) => (
              <div key={theme.value} className="flex items-center space-x-2">
                <RadioGroupItem value={theme.value} id={theme.value} />
                <Label htmlFor={theme.value}>{theme.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Apply Theme</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
