
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-violet-500"><path d="M22 9L12 5L2 9L12 13L22 9Z"/><path d="M6 12V17C6 17.6 6.4 18 7 18H17C17.6 18 18 17.6 18 17V12"/></svg>
            Markdown Editor
          </h1>
          <ThemeToggle />
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-hidden max-w-7xl mx-auto w-full">
        <MarkdownEditor />
      </main>
      <footer className="bg-white dark:bg-gray-800 py-3 px-6 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        <p>© {new Date().getFullYear()} Markdown Editor - Open Source</p>
      </footer>
    </div>
  );
};

export default Index;
