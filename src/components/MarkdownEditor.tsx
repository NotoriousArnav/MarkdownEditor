import { useEffect, useState, useCallback, useRef } from "react";
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
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from "@/components/ui/resizable";
import { Save, Undo, Redo, Palette, History } from "lucide-react";
import { ThemeSelector } from "@/components/ThemeSelector";
import { MarkdownTheme } from "@/utils/themeOptions";
import { HistoryViewer } from "@/components/HistoryViewer";
import { KeybindViewer } from "./KeyboardShortcuts";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useHotkeys } from "@/hooks/useHotkeys";
import { text } from "stream/consumers";

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
  const [historyViewerOpen, setHistoryViewerOpen] = useState(false);
  const [markdownTheme, setMarkdownTheme] = useState<MarkdownTheme>(() => {
    return (localStorage.getItem("markdown-theme") as MarkdownTheme) || "github";
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
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

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Auto-complete functionality
    if (e.key === '`' && e.ctrlKey) {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      
      const newValue = value.substring(0, start) + '```\n\n```' + value.substring(end);
      setMarkdown(newValue);
      history.push(newValue);
      
      // Set cursor position
      setTimeout(() => {
        textarea.selectionStart = start + 4;
        textarea.selectionEnd = start + 4;
        textarea.focus();
      }, 0);
    } else if (e.key === '*' && e.shiftKey) {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      const selectedText = value.substring(start, end);
      
      const newValue = value.substring(0, start) + '**' + selectedText + '**' + value.substring(end);
      setMarkdown(newValue);
      history.push(newValue);
      
      // Set cursor position
      setTimeout(() => {
        if (selectedText.length === 0) {
          textarea.selectionStart = start + 2;
          textarea.selectionEnd = start + 2;
        } else {
          textarea.selectionStart = start + 2 + selectedText.length + 2;
          textarea.selectionEnd = start + 2 + selectedText.length + 2;
        }
        textarea.focus();
      }, 0);
    }
  }, [history]);

  const handleInsertText = (text: string) => {
    const newValue = markdown + text;
    setMarkdown(newValue);
    history.push(newValue);
  };

  const handleToolbarAction = (action: string) => {
    const textarea = textareaRef.current;

    switch (action) {
      case "preview":
        setIsPreviewMode(!isPreviewMode);
        return;
      case "edit":
        setIsPreviewMode(false);
        return;
      case "download":
        handleSaveToFile();
        return;
      case "theme":
        setThemeDialogOpen(true);
        return;
      case "save":
        handleSaveToLocalStorage();
        return;
      default:
        break;
    }

    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.substring(start, end);
    const beforeSelection = markdown.substring(0, start);
    const afterSelection = markdown.substring(end);

    let replacement = "";
    
    switch (action) {
      case "bold":
        if (!textarea) return;
        replacement = `**${selectedText || "bold text"}**`;
        break;
      case "italic":
        if (!textarea) return;
        replacement = `*${selectedText || "italic text"}*`;
        break;
      case "heading1":
        if (!textarea) return;
        replacement = `# ${selectedText || "Heading 1"}`;
        break;
      case "heading2":
        if (!textarea) return;
        replacement = `## ${selectedText || "Heading 2"}`;
        break;
      case "heading3":
        if (!textarea) return;
        replacement = `### ${selectedText || "Heading 3"}`;
        break;
      case "link":
        if (!textarea) return;
        replacement = `[${selectedText || "link text"}](url)`;
        break;
      case "image":
        if (!textarea) return;
        replacement = `![${selectedText || "alt text"}](image-url)`;
        break;
      case "code":
        if (!textarea) return;
        replacement = selectedText.includes("\n")
          ? `\`\`\`\n${selectedText || "code block"}\n\`\`\``
          : `\`${selectedText || "inline code"}\``;
        break;
      case "quote":
        if (!textarea) return;
        replacement = `> ${selectedText || "quote"}`;
        break;
      case "list":
        if (!textarea) return;
        replacement = `- ${selectedText || "list item"}`;
        break;
      case "orderedList":
        if (!textarea) return;
        replacement = `1. ${selectedText || "list item"}`;
        break;
      case "clear":
        if (!textarea) return;
        if (window.confirm("Are you sure you want to clear the editor?")) {
          const newValue = "";
          setMarkdown(newValue);
          history.push(newValue);
        }
        return;
      case "undo":
        if (!textarea) return;
        const previousState = history.undo();
        if (previousState !== undefined) {
          setMarkdown(previousState);
        }
        return;
      case "redo":
        if (!textarea) return;
        const nextState = history.redo();
        if (nextState !== undefined) {
          setMarkdown(nextState);
        }
        return;
      case "history":
        setHistoryViewerOpen(true);
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

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  window.handleToolbarAction = handleToolbarAction; // Expose function to global scope for debugging.
  
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

  // Register keyboard shortcuts
  // TODO: Add more shortcuts
  // TODO: Use for loop to register shortcuts
  useHotkeys('ctrl+s', (e) => {
    e.preventDefault();
    handleSaveToLocalStorage();
  });
  
  useHotkeys('ctrl+z', (e) => {
    e.preventDefault();
    handleToolbarAction("undo");
  });
  
  useHotkeys('ctrl+y', (e) => {
    e.preventDefault();
    handleToolbarAction("redo");
  });
  
  useHotkeys('ctrl+h', (e) => {
    e.preventDefault();
    setHistoryViewerOpen(true);
  });

  useHotkeys('ctrl+e', (e) => {
    e.preventDefault();
    setIsPreviewMode(!isPreviewMode);
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      
      <EditorToolbar onAction={handleToolbarAction} isPreviewMode={isPreviewMode} />
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col flex-1 overflow-hidden">
        {!isPreviewMode ? (
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="flex-1 flex flex-col h-full min-w-0">
                <textarea
                  ref={textareaRef}
                  value={markdown}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  className="flex-1 p-4 resize-none focus:outline-none font-mono text-sm leading-relaxed bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 h-full"
                  placeholder="Start writing your markdown here..."
                />
                <div className="border-t border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-900">
                  <WordCount text={markdown} />
                </div>
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={50} minSize={30}>
              <div className="h-full overflow-auto">
                <MarkdownPreview markdown={markdown} theme={markdownTheme} />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        ) : (
          <div className="flex-1 overflow-auto">
            <MarkdownPreview markdown={markdown} theme={markdownTheme} />
          </div>
        )}
      </div>
      
      {/* <div className="mt-3 flex justify-end">
        <Button 
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          variant="outline"
          className="text-sm"
        >
          {isPreviewMode ? "Edit" : "Preview"}
        </Button>
      </div> */}

      <ThemeSelector 
        isOpen={themeDialogOpen}
        onClose={() => setThemeDialogOpen(false)}
        currentTheme={markdownTheme}
        onThemeChange={setMarkdownTheme}
      />
      
      <HistoryViewer
        isOpen={historyViewerOpen}
        onClose={() => setHistoryViewerOpen(false)}
        history={history}
        currentContent={markdown}
        setContent={(content) => {
          setMarkdown(content);
          history.push(content);
        }}
      />
      <KeybindViewer
        isOpen={false}
        onClose={() => {}}
      />
    </div>
  );
};
