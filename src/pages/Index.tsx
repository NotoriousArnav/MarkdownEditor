import { MarkdownEditor } from "@/components/MarkdownEditor";
import "../components/markdown-themes.css";

const Index = () => {
  return (
    <main className="flex flex-col h-full p-2 bg-gray-100 dark:bg-gray-900">
      <MarkdownEditor />
    </main>
  );
};

export default Index;
