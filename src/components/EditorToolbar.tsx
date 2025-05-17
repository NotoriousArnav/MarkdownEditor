
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Bold, Italic, Heading1, Heading2, Heading3, Link, Image, Code, Quote, List, ListOrdered, 
  Trash2, Save, Eye, Edit
} from "lucide-react";

interface EditorToolbarProps {
  onAction: (action: string) => void;
  isPreviewMode: boolean;
}

export const EditorToolbar = ({ onAction, isPreviewMode }: EditorToolbarProps) => {
  if (isPreviewMode) {
    return (
      <div className="py-2 mb-2 flex justify-between items-center">
        <span className="text-lg font-medium text-gray-700 dark:text-gray-200">Preview Mode</span>
      </div>
    );
  }

  const tools = [
    { icon: <Bold size={16} />, name: "bold", tooltip: "Bold" },
    { icon: <Italic size={16} />, name: "italic", tooltip: "Italic" },
    { icon: <Heading1 size={16} />, name: "heading1", tooltip: "Heading 1" },
    { icon: <Heading2 size={16} />, name: "heading2", tooltip: "Heading 2" },
    { icon: <Heading3 size={16} />, name: "heading3", tooltip: "Heading 3" },
    { icon: <Link size={16} />, name: "link", tooltip: "Link" },
    { icon: <Image size={16} />, name: "image", tooltip: "Image" },
    { icon: <Code size={16} />, name: "code", tooltip: "Code" },
    { icon: <Quote size={16} />, name: "quote", tooltip: "Quote" },
    { icon: <List size={16} />, name: "list", tooltip: "Bullet List" },
    { icon: <ListOrdered size={16} />, name: "orderedList", tooltip: "Numbered List" },
  ];

  const actions = [
    { icon: <Trash2 size={16} />, name: "clear", tooltip: "Clear Editor", className: "text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300" },
    { icon: <Save size={16} />, name: "save", tooltip: "Save", className: "text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300" },
  ];

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
      </TooltipProvider>
    </div>
  );
};
