
import { MarkdownEditor } from "@/components/MarkdownEditor";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm py-4 px-6">
        <h1 className="text-xl font-semibold text-gray-800">Markdown Editor</h1>
      </header>
      <main className="flex-1 p-4 md:p-6 overflow-hidden">
        <MarkdownEditor />
      </main>
      <footer className="bg-white py-3 px-6 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Markdown Editor</p>
      </footer>
    </div>
  );
};

export default Index;
