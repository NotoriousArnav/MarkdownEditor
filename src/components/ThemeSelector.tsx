import { useState, useEffect, useRef } from "react";
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

const appThemes = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "external", label: "External Theme (CSS URL)" },
];

export const ThemeSelector = ({
  isOpen,
  onClose,
  currentTheme,
  onThemeChange
}: ThemeSelectorProps) => {
  const [selectedTheme, setSelectedTheme] = useState<MarkdownTheme>(currentTheme);
  const [selectedAppTheme, setSelectedAppTheme] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("appTheme") || "system";
    }
    return "system";
  });
  const [externalThemeUrl, setExternalThemeUrl] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("externalThemeUrl") || "";
    }
    return "";
  });
  const externalLinkRef = useRef<HTMLLinkElement | null>(null);

  useEffect(() => {
    // Remove any previous external theme link
    if (externalLinkRef.current) {
      externalLinkRef.current.remove();
      externalLinkRef.current = null;
    }
    // Apply app theme to <html> element
    const html = document.documentElement;
    html.classList.remove("light", "dark", "yame-bluelight", "yame-nightowl");
    if (selectedAppTheme === "system") {
      html.removeAttribute("data-theme");
    } else {
      html.setAttribute("data-theme", selectedAppTheme);
      if (selectedAppTheme.startsWith("yame.")) {
        html.classList.add(selectedAppTheme.replace(".", "-"));
      } else {
        html.classList.add(selectedAppTheme);
      }
    }
    if (selectedAppTheme === "external" && externalThemeUrl) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = externalThemeUrl;
      link.id = "external-theme-css";
      document.head.appendChild(link);
      externalLinkRef.current = link;
      html.setAttribute("data-theme", "external");
    }
    localStorage.setItem("appTheme", selectedAppTheme);
    if (selectedAppTheme === "external") {
      localStorage.setItem("externalThemeUrl", externalThemeUrl);
    }
  }, [selectedAppTheme, externalThemeUrl]);

  const handleSave = () => {
    onThemeChange(selectedTheme);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Theme</DialogTitle>
          <DialogDescription>
            Select the application and Markdown preview themes.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          <div>
            <div className="mb-2 font-semibold">Application Theme</div>
            <RadioGroup
              value={selectedAppTheme}
              onValueChange={setSelectedAppTheme}
              className="space-y-3"
            >
              {appThemes.map((theme) => (
                <div key={theme.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={theme.value} id={theme.value} />
                  <Label htmlFor={theme.value}>{theme.label}</Label>
                </div>
              ))}
            </RadioGroup>
            {selectedAppTheme === "external" && (
              <div className="mt-3">
                <input
                  type="url"
                  className="w-full border rounded px-2 py-1"
                  placeholder="Enter external CSS URL..."
                  value={externalThemeUrl}
                  onChange={e => setExternalThemeUrl(e.target.value)}
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Paste a direct link to a CSS file to load an external theme.
                </div>
              </div>
            )}
          </div>
          <div>
            <div className="mb-2 font-semibold">Markdown Flavor</div>
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Apply Theme</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
