
import { useEffect, useState } from "react";
import { MarkdownPreview } from "@/components/MarkdownPreview";
import { EditorToolbar } from "@/components/EditorToolbar";
import { WordCount } from "@/components/WordCount";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export const MarkdownEditor = () => {
  const [markdown, setMarkdown] = useState<string>(() => {
    const saved = localStorage.getItem("markdown-content");
    return saved || "# Hello World\n\nStart writing your markdown here...";
  });
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const { toast } = useToast();

  // Save to localStorage whenever markdown changes
  useEffect(() => {
    localStorage.setItem("markdown-content", markdown);
  }, [markdown]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
  };

  const handleInsertText = (text: string) => {
    setMarkdown((prev) => prev + text);
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
          setMarkdown("");
        }
        return;
      case "save":
        toast({
          title: "Content Saved",
          description: "Your markdown has been saved to local storage.",
        });
        return;
      default:
        return;
    }
    
    setMarkdown(beforeSelection + replacement + afterSelection);
    
    // After state update, focus and set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + replacement.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-12rem)]">
      <EditorToolbar onAction={handleToolbarAction} isPreviewMode={isPreviewMode} />
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col md:flex-row flex-1 overflow-hidden">
        {!isPreviewMode && (
          <div className="flex-1 flex flex-col min-w-0">
            <textarea
              value={markdown}
              onChange={handleChange}
              className="flex-1 p-4 resize-none focus:outline-none font-mono text-sm leading-relaxed"
              placeholder="Start writing your markdown here..."
            />
            <div className="border-t border-gray-200 p-2 bg-gray-50">
              <WordCount text={markdown} />
            </div>
          </div>
        )}
        
        {(!isPreviewMode && window.innerWidth >= 768) || isPreviewMode ? (
          <div className={`flex-1 ${!isPreviewMode && window.innerWidth >= 768 ? "border-l border-gray-200" : ""} overflow-auto`}>
            <MarkdownPreview markdown={markdown} />
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
    </div>
  );
};
