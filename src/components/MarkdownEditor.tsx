import { useEffect, useState, useCallback, useRef, lazy, Suspense } from "react";
import { EditorToolbar } from "@/components/EditorToolbar";
import { WordCount } from "@/components/WordCount";
import { Loading } from "@/components/ui/loading";
import { useToast } from "@/components/ui/use-toast";
import { HistoryManager } from "@/utils/historyManager";
import { Button } from "@/components/ui/button";
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
import { Github } from "lucide-react";
import { MarkdownTheme } from "@/utils/themeOptions";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useHotkeys } from "@/hooks/useHotkeys";
import { inlineAllStyles, fetchFromUrl, shareFile } from "@/lib/utils";
import { ShareDialog } from "@/components/ShareDialog"; // Import the ShareDialog component

// Dynamically import components that aren't needed on initial load
const MarkdownPreview = lazy(() => import("@/components/MarkdownPreview").then(module => ({ default: module.MarkdownPreview })));
const ThemeSelector = lazy(() => import("@/components/ThemeSelector").then(module => ({ default: module.ThemeSelector })));
const HistoryViewer = lazy(() => import("@/components/HistoryViewer").then(module => ({ default: module.HistoryViewer })));
const FetchFromHTTP = lazy(() => import("@/components/FetchFromHTTP").then(module => ({ default: module.FetchFromHTTP })));

export const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState<string>(() => {
    const saved = localStorage.getItem("markdown-content");
    return saved || "# Hello World\n\nStart writing your markdown here...";
  });
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isFetchDialogOpen, setShowFetchDialog] = useState(false);
  const [history] = useState(() => new HistoryManager<string>(markdown));
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  const [historyViewerOpen, setHistoryViewerOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false); // Add state for ShareDialog
  const [markdownTheme, setMarkdownTheme] = useState<MarkdownTheme>(() => {
    return (localStorage.getItem("markdown-theme") as MarkdownTheme) || "github";
  });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { toast } = useToast();

  //Check if url has ?preview=true
  const url = new URL(window.location.href);
  useEffect(() => {
    if (url.searchParams.get("preview") === "true") {
      setIsPreviewMode(true);
    }
  }, []);

  //Check if User added fetchFrom=some.url
  useEffect(() => {
    const fetchFrom = url.searchParams.get("fetchFrom");
    if (fetchFrom) {
      fetchFromUrl(fetchFrom)
        .then((data) => {
          setMarkdown(data);
        })
        .catch((error) => {
          alert(`Could not fetch document from ${fetchFrom}`);
          console.error("Error fetching data:", error);
        })
    }
  }, []);


  // Check if first time user
  useEffect(() => {
    const firstTime = localStorage.getItem("firstTime");
    if (firstTime === null) {
      toast({
        title: 'Welcome to Yame!',
        description: 'We hope you enjoy using Yame. If you have any feedback or suggestions, please let us know!',
        duration: 5000,
        action: (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              window.open("https://github.com/NotoriousArnav/MarkdownEditor/issues", "_blank");
            }}
          >
            <Github className="m-2 h-4 w-4" />
          </Button>
        )
      })
      localStorage.setItem("firstTime", "false");
    }
  }, []);


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

  const handleExportPDF = async (filename?: string, dnd?: boolean) => {
    const el = document.getElementById("mdwindow");
    if (!el) return;

    const htmlString = inlineAllStyles(el);

    // Dynamically import html2pdf.js only when needed
    const html2pdfModule = await import('html2pdf.js');
    const html2pdf = html2pdfModule.default;

    const opt = {
      margin: 0.5,
      filename: filename || 'markdown.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`<html><body>${htmlString}</body></html>`);
      doc.close();

      html2pdf().set(opt).from(doc.body).save().then(() => {
        iframe.remove();
        if (dnd) return dnd;
        toast({
          title: 'PDF Exported',
          description: 'Your markdown has been exported as a PDF.',
        })
      });
    }
  };

  const handleExportHTML = (filename?: string, dnd?: boolean) => {
    const el = document.getElementById("mdwindow");
    if (!el) return;
    const htmlString = inlineAllStyles(el);
    const blob = new Blob([htmlString], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'yame-document.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    if (dnd) return dnd;
    toast({
      title: 'HTML Exported',
      description: 'Your markdown has been exported as an HTML file.',
    })
  }

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
      case "pdfexport":
        handleExportPDF();
        return;
      case "share":
        setShareDialogOpen(true);
        return;
      case "htmlexport":
        handleExportHTML();
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
      case "keybinds":
        alert(`Keyboard Shortcuts:
          Ctrl + S: Save to Local Storage
          Ctrl + Z: Undo
          Ctrl + Y: Redo
          Ctrl + H: Show History
          Ctrl + E: Toggle Preview
          Ctrl + B: Bold
          Ctrl + I: Italic
          Ctrl + 1: Heading 1
          Ctrl + 2: Heading 2
          Ctrl + 3: Heading 3
          Ctrl + L: Link
          Ctrl + Shift + I: Image
          Ctrl + \`: Code
          Ctrl + Q: Quote
          
          `)
        return;
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
      case "openfetch":
        setShowFetchDialog(true);
        return;
      case "openfile":
        const inputElement = document.querySelector('#fileOpen');
        if (inputElement) {
          inputElement.click();
        }
        return;
      case "fetch":
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

  const handleSaveToLocalStorage = (dnd?: boolean) => {
    localStorage.setItem("markdown-content", markdown);
    if (dnd) return dnd;
    toast({
      title: "Content Saved",
      description: "Your markdown has been saved to local storage.",
    });
    return dnd;
  };

  var intervalId = setInterval(() => {
    handleSaveToLocalStorage(true)
  }, 5000);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (window.confirm("Are you sure you want to replace the current content with the uploaded file?")) {
          setMarkdown(content);
        }
      };
      reader.readAsText(file);
    }
  }

  const handleFetchFromUrl = (url: string) => {
    setShowFetchDialog(false);
    if (!url) return;
    fetchFromUrl(url)
      .then((data) => {
        setMarkdown(data);
      })
      .catch((error) => {
        alert(`Could not fetch document from ${url}`);
        console.error("Error fetching data:", error);
      })
    console.log("url:", url);
  }

  const handleSaveToFile = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'yame-document.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "File Downloaded",
      description: "Your markdown has been saved to disk.",
    });
  };

  // Handle the ShareDialog share action
  const handleShareDocument = async (filename: string, duration: number): Promise<string> => {
    try {
      const data = markdown;
      const link = await shareFile(data, filename, duration.toString(), toast);
      return link;
    } catch (error) {
      console.error("Error sharing file:", error);
      toast({
        title: "Share Failed",
        description: "There was an error generating the share link.",
      });
      throw error;
    }
  };

  // Handle share dialog close action
  const handleShareDialogClose = (action: string) => {
    setShareDialogOpen(false);

    if (action.startsWith("copy")) {
      toast({
        title: "Link Copied",
        description: "The share link has been copied to your clipboard.",
      });
    }
  };

  // Register keyboard shortcuts
  useHotkeys('ctrl+s', (e) => {
    e.preventDefault();
    handleSaveToLocalStorage();
  });

  useHotkeys('ctrl+shift+s', (e) => {
    e.preventDefault();
    handleSaveToFile();
  })

  useHotkeys('ctrl+shift+e', (e) => {
    e.preventDefault();
    setShareDialogOpen(true);
  })

  useHotkeys('ctrl+b', (e) => {
    e.preventDefault();
    handleToolbarAction("bold");
  });
  useHotkeys('ctrl+i', (e) => {
    e.preventDefault();
    handleToolbarAction("italic");
  });

  useHotkeys('ctrl+1', (e) => {
    e.preventDefault();
    handleToolbarAction("heading1");
  });
  useHotkeys('ctrl+2', (e) => {
    e.preventDefault();
    handleToolbarAction("heading2");
  });
  useHotkeys('ctrl+3', (e) => {
    e.preventDefault();
    handleToolbarAction("heading3");
  });

  useHotkeys('ctrl+l', (e) => {
    e.preventDefault();
    handleToolbarAction("link");
  });

  useHotkeys('ctrl+shift+i', (e) => {
    e.preventDefault();
    handleToolbarAction("image");
  });

  useHotkeys('ctrl+`', (e) => {
    e.preventDefault();
    handleToolbarAction("code");
  });

  useHotkeys('ctrl+q', (e) => {
    e.preventDefault();
    handleToolbarAction("quote");
  });

  useHotkeys('ctrl+shift+8', (e) => {
    e.preventDefault();
    handleToolbarAction("list");
  });

  useHotkeys('ctrl+shift+7', (e) => {
    e.preventDefault();
    handleToolbarAction("orderedList");
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

  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  window.yame = {
    handleToolbarAction,
    handleSaveToLocalStorage,
    handleExportPDF,
    handleSaveToFile,
    handleExportHTML,
    handleShareDocument,
    fetchFromUrl,
    shareFile
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-col h-full overflow-hidden">

        <EditorToolbar onAction={handleToolbarAction} isPreviewMode={isPreviewMode} />

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col flex-1 overflow-hidden">
          {!isPreviewMode ? (
            <ResizablePanelGroup direction="horizontal" className="flex-1">
              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="flex-1 flex flex-col h-full min-w-0">
                  <textarea
                    ref={textareaRef}
                    role="editor"
                    value={markdown}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="flex-1 p-4 resize-none focus:outline-none font-mono text-sm leading-relaxed bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 h-full"
                    placeholder="Start writing your markdown here..."
                  />
                  <div className="border-t border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-900">
                    <WordCount role="wordcount" text={markdown} />
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={50} minSize={30}>
                <div className="h-full overflow-auto">
                  <MarkdownPreview role="preview" markdown={markdown} theme={markdownTheme} />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          ) : (
            <div className="flex-1 overflow-auto">
              <MarkdownPreview role="preview" markdown={markdown} theme={markdownTheme} />
            </div>
          )}
        </div>

        <ThemeSelector
          isOpen={themeDialogOpen}
          currentTheme={markdownTheme}
          onThemeChange={setMarkdownTheme}
          onClose={() => setThemeDialogOpen(false)}
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

        <FetchFromHTTP
          isOpen={isFetchDialogOpen}
          onClose={handleFetchFromUrl}
        />

        {/* Add ShareDialog component */}
        <ShareDialog
          isOpen={shareDialogOpen}
          onClose={handleShareDialogClose}
          onShare={handleShareDocument}
          initialFilename={`yame-document-${Math.random().toString(36).substring(2, 8)}.md`}
        />

        <input id="fileOpen" type="file" accept=".md" onChange={handleFileUpload} style={{ display: "none" }} />
      </div>
    </Suspense>
  );
};
