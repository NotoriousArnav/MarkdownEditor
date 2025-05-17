
import { MarkdownEditor } from "@/components/MarkdownEditor";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import "../components/markdown-themes.css";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-violet-500"><path d="M22 9L12 5L2 9L12 13L22 9Z"/><path d="M6 12V17C6 17.6 6.4 18 7 18H17C17.6 18 18 17.6 18 17V12"/></svg>
            Markdown Editor
          </h1>
          <div className="flex items-center gap-3">
            <a 
              href="https://github.com/yourusername/markdown-editor" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
              GitHub
            </a>
            <ThemeToggle />
          </div>
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
