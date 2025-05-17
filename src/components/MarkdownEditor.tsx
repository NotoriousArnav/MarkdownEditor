
import { useEffect, useState } from "react";
import { MarkdownPreview } from "@/components/MarkdownPreview";
import { EditorToolbar } from "@/components/EditorToolbar";
import { WordCount } from "@/components/WordCount";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { HistoryManager } from "@/utils/historyManager";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Save, Undo, Redo, Palette } from "lucide-react";
import { ThemeSelector } from "@/components/ThemeSelector";
import { MarkdownTheme } from "@/utils/themeOptions";

export const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState<string>(() => {
    const saved = localStorage.getItem("markdown-content");
    return saved || "# Hello World\n\nStart writing your markdown here...";
  });
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [history] = useState(() => new HistoryManager<string>(markdown));
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  const [markdownTheme, setMarkdownTheme] = useState<MarkdownTheme>(() => {
    return (localStorage.getItem("markdown-theme") as MarkdownTheme) || "github";
  });
  
  const { toast } = useToast();

  // Update history control states
  useEffect(() => {
    setCanUndo(history.canUndo());
    setCanRedo(history.canRedo());
  }, [markdown, history]);

  // Save to localStorage whenever markdown changes
  useEffect(() => {
    localStorage.setItem("markdown-content", markdown);
  }, [markdown]);

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem("markdown-theme", markdownTheme);
  }, [markdownTheme]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setMarkdown(newValue);
    history.push(newValue);
  };

  const handleInsertText = (text: string) => {
    const newValue = markdown + text;
    setMarkdown(newValue);
    history.push(newValue);
  };

  const handleToolbarAction = (action: string) => {
    const textarea = document.querySelector("textarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    const beforeSelection = markdown.substring(0, start);
    const afterSelection = markdown.substring(end);
    
    let replacement = "";
    
    switch (action) {
      case "bold":
        replacement = `**${selectedText || "bold text"}**`;
        break;
      case "italic":
        replacement = `*${selectedText || "italic text"}*`;
        break;
      case "heading1":
        replacement = `# ${selectedText || "Heading 1"}`;
        break;
      case "heading2":
        replacement = `## ${selectedText || "Heading 2"}`;
        break;
      case "heading3":
        replacement = `### ${selectedText || "Heading 3"}`;
        break;
      case "link":
        replacement = `[${selectedText || "link text"}](url)`;
        break;
      case "image":
        replacement = `![${selectedText || "alt text"}](image-url)`;
        break;
      case "code":
        replacement = selectedText.includes("\n")
          ? `\`\`\`\n${selectedText || "code block"}\n\`\`\``
          : `\`${selectedText || "inline code"}\``;
        break;
      case "quote":
        replacement = `> ${selectedText || "quote"}`;
        break;
      case "list":
        replacement = `- ${selectedText || "list item"}`;
        break;
      case "orderedList":
        replacement = `1. ${selectedText || "list item"}`;
        break;
      case "clear":
        if (window.confirm("Are you sure you want to clear the editor?")) {
          const newValue = "";
          setMarkdown(newValue);
          history.push(newValue);
        }
        return;
      case "undo":
        const previousState = history.undo();
        if (previousState !== undefined) {
          setMarkdown(previousState);
        }
        return;
      case "redo":
        const nextState = history.redo();
        if (nextState !== undefined) {
          setMarkdown(nextState);
        }
        return;
      case "theme":
        setThemeDialogOpen(true);
        return;
      case "save":
        // Save handled by dropdown menu now
        return;
      default:
        return;
    }
    
    const newValue = beforeSelection + replacement + afterSelection;
    setMarkdown(newValue);
    history.push(newValue);
    
    // After state update, focus and set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + replacement.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleSaveToLocalStorage = () => {
    localStorage.setItem("markdown-content", markdown);
    toast({
      title: "Content Saved",
      description: "Your markdown has been saved to local storage.",
    });
  };

  const handleSaveToFile = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "File Downloaded",
      description: "Your markdown has been saved to disk.",
    });
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-12rem)]">
      <div className="flex justify-between items-center mb-3">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleToolbarAction("undo")}
            disabled={!canUndo}
            title="Undo"
          >
            <Undo size={16} />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleToolbarAction("redo")}
            disabled={!canRedo}
            title="Redo"
          >
            <Redo size={16} />
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleToolbarAction("theme")}
            title="Change theme"
          >
            <Palette size={16} className="mr-1" />
            Theme
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="sm">
                <Save size={16} className="mr-1" />
                Save
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleSaveToLocalStorage}>
                Save to Browser
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSaveToFile}>
                Download .md File
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <EditorToolbar onAction={handleToolbarAction} isPreviewMode={isPreviewMode} />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row flex-1 overflow-hidden">
        {!isPreviewMode && (
          <div className="flex-1 flex flex-col min-w-0">
            <textarea
              value={markdown}
              onChange={handleChange}
              className="flex-1 p-4 resize-none focus:outline-none font-mono text-sm leading-relaxed bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="Start writing your markdown here..."
            />
            <div className="border-t border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-900">
              <WordCount text={markdown} />
            </div>
          </div>
        )}
        
        {(!isPreviewMode && window.innerWidth >= 768) || isPreviewMode ? (
          <div className={`flex-1 ${!isPreviewMode && window.innerWidth >= 768 ? "border-l border-gray-200 dark:border-gray-700" : ""} overflow-auto`}>
            <MarkdownPreview markdown={markdown} theme={markdownTheme} />
          </div>
        ) : null}
      </div>
      
      <div className="mt-3 flex justify-end">
        <Button 
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          variant="outline"
          className="text-sm"
        >
          {isPreviewMode ? "Edit" : "Preview"}
        </Button>
      </div>

      <ThemeSelector 
        isOpen={themeDialogOpen}
        onClose={() => setThemeDialogOpen(false)}
        currentTheme={markdownTheme}
        onThemeChange={setMarkdownTheme}
      />
    </div>
  );
};
