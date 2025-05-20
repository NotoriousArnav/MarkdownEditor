
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Bold, Italic, Heading1, Heading2, Heading3, Link, Image, Code, Quote, List, ListOrdered,
  Trash2, Save, Eye, Edit, Undo, Redo, History, Download, Palette, Keyboard, FileText, Github,
  FolderOpen, CloudDownload, Share, CodeXml
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useToast } from "@/components/ui/use-toast";
interface EditorToolbarProps {
  onAction: (action: string) => void;
  isPreviewMode: boolean;
}

export const EditorToolbar = ({ onAction, isPreviewMode }: EditorToolbarProps) => {

  const { toast } = useToast();

  // Define the toolbar items
  const tools = [
    { icon: <Bold size={24} />, name: "bold", tooltip: "Bold" },
    { icon: <Italic size={24} />, name: "italic", tooltip: "Italic" },
    { icon: <Heading1 size={24} />, name: "heading1", tooltip: "Heading 1" },
    { icon: <Heading2 size={24} />, name: "heading2", tooltip: "Heading 2" },
    { icon: <Heading3 size={24} />, name: "heading3", tooltip: "Heading 3" },
    { icon: <Link size={24} />, name: "link", tooltip: "Link" },
    { icon: <Image size={24} />, name: "image", tooltip: "Image" },
    { icon: <Code size={24} />, name: "code", tooltip: "Code" },
    { icon: <Quote size={24} />, name: "quote", tooltip: "Quote" },
    { icon: <List size={24} />, name: "list", tooltip: "Bullet List" },
    { icon: <ListOrdered size={24} />, name: "orderedList", tooltip: "Numbered List" },
  ];

  const actions = [
    { icon: <Keyboard size={24} />, name: "keybinds", tooltip: "Keyboard Shortcuts" },
    { icon: <Undo size={24} />, name: "undo", tooltip: "Undo" },
    { icon: <Redo size={24} />, name: "redo", tooltip: "Redo" },
    { icon: <History size={24} />, name: "history", tooltip: "History" },
    { icon: <Trash2 size={24} />, name: "clear", tooltip: "Clear Editor", className: "text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300" },
    { icon: <FolderOpen size={24} />, name: "openfile", tooltip: "Open File", className: "text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300" },
    { icon: <CloudDownload size={24} />, name: "openfetch", tooltip: "Open Remote File", className: "text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300" },
    { icon: <Save size={24} />, name: "save", tooltip: "Save to Browser", className: "text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300" },
    { icon: <Download size={24} />, name: "download", tooltip: "Download", className: "text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300" },
  ];

  const extraActions: { icon: JSX.Element; name: string; tooltip: string; className?: string }[] = [
    { icon: <Share size={24} />, name: "share", tooltip: "Share", className: "text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300" },
    { icon: <Palette size={24} />, name: "theme", tooltip: "Change Markdown Theme" },
    { icon: <Eye size={24} />, name: "preview", tooltip: "Preview" },
    { icon: <FileText size={24} />, name: "pdfexport", tooltip: "Export PDF" },
    { icon: <CodeXml size={24} />, name: "htmlexport", tooltip: "Export HTML" },
    { icon: <ThemeToggle />, name: "themeToggle", tooltip: "Toggle Theme", className: "h-8 w-8 p-0" },
  ];

  const previewModeToolbar = [
    { icon: <Edit size={24} />, name: "edit", tooltip: "Edit" },
    { icon: <Download size={24} />, name: "download", tooltip: "Download", className: "text-blue-800 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300" },
    { icon: <FileText size={24} />, name: "pdfexport", tooltip: "Export PDF" },
    { icon: <CodeXml size={24} />, name: "htmlexport", tooltip: "Export HTML" },
    { icon: <Share size={24} />, name: "share", tooltip: "Share", className: "text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300" },
    { icon: <Palette size={24} />, name: "theme", tooltip: "Change Theme" },
    { icon: <ThemeToggle />, name: "themeToggle", tooltip: "Toggle Theme", className: "h-8 w-8 p-0" },
  ];

  if (isPreviewMode) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2 mb-3 flex flex-wrap items-center gap-1">
        <TooltipProvider>
          {previewModeToolbar.map((tool) => (
            <Tooltip key={tool.name}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-8 w-8 p-0 ${tool.className || ""}`}
                  onClick={() => onAction(tool.name)}
                >
                  {tool.icon}
                  <span className="sr-only">{tool.tooltip}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{tool.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
    )
  }

  /* This is Edit mode Toolbar */
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2 mb-3 flex flex-wrap items-center gap-1">

      <TooltipProvider>
        {tools.map((tool) => (
          <Tooltip key={tool.name}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onAction(tool.name)}
              >
                {tool.icon}
                <span className="sr-only">{tool.tooltip}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tool.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}

        <div className="h-8 border-r border-gray-200 dark:border-gray-700 mx-1"></div>

        {actions.map((action) => (
          <Tooltip key={action.name}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 ${action.className || ""}`}
                onClick={() => onAction(action.name)}
              >
                {action.icon}
                <span className="sr-only">{action.tooltip}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{action.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        <div className="h-8 border-r border-gray-200 dark:border-gray-700 mx-1"></div>
        {extraActions.map((action) => (
          <Tooltip key={action.name}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 ${action.className || ""}`}
                onClick={() => onAction(action.name)}
              >
                {action.icon}
                <span className="sr-only">{action.tooltip}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{action.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
      <div className="flex-1">
        <div className="flex items-center justify-end">
          <Button
            variant="secondary"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => {
              toast({
                title: "Made with ❤️ by @NotoriousArnav",
                description: "Click the Button to visit the Repo",
                duration: 5 * 1000,
                action: (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      window.open("https://github.com/NotoriousArnav/MarkdownEditor", "_blank");
                    }}
                  >
                    <Github />
                  </Button>
                ),
              })
            }}
          >
            <Github />
          </Button>
        </div>
      </div>
    </div>
  );
};
