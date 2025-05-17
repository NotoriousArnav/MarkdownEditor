
import { MarkdownEditor } from "@/components/MarkdownEditor";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm py-4 px-6 border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-violet-500"><path d="M22 9L12 5L2 9L12 13L22 9Z"/><path d="M6 12V17C6 17.6 6.4 18 7 18H17C17.6 18 18 17.6 18 17V12"/></svg>
          Markdown Editor
        </h1>
      </header>
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-hidden max-w-7xl mx-auto w-full">
        <MarkdownEditor />
      </main>
      <footer className="bg-white py-3 px-6 text-center text-sm text-gray-500 border-t border-gray-200">
        <p>© {new Date().getFullYear()} Markdown Editor</p>
      </footer>
    </div>
  );
};

export default Index;
