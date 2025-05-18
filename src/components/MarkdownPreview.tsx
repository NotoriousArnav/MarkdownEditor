
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeSanitize from 'rehype-sanitize';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { MarkdownTheme } from '@/utils/themeOptions';
import { inlineAllStyles } from '@/lib/utils';

interface MarkdownPreviewProps {
  markdown: string;
  theme: MarkdownTheme;
}

export const MarkdownPreview = ({ markdown, theme }: MarkdownPreviewProps) => {
  const { toast } = useToast();
  
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  window.inlineAllStyles = inlineAllStyles;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code copied",
      description: "Code has been copied to clipboard",
      duration: 2000,
    });
  };
  
  return (
    <div id="mdwindow" className={`p-4 prose prose-sm md:prose-base max-w-none overflow-auto h-full markdown-preview dark:prose-invert markdown-theme-${theme}`}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm, remarkMath]} 
        rehypePlugins={[rehypeSanitize, rehypeRaw, rehypeKatex]}
        components={{
          code({className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '');
            const codeString = String(children).replace(/\n$/, '');
            
            return match ? (
              <div className="relative group">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleCopyCode(codeString)}
                >
                  <Copy size={14} />
                </Button>
                <SyntaxHighlighter
                  style={vscDarkPlus as any}
                  language={match[1]}
                  PreTag="div"
                  className="rounded-md border border-gray-200 dark:border-gray-700 bg-gray-900 p-0 overflow-x-auto"
                  customStyle={{ padding: '1rem', margin: '0.5rem 0' }}
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className={`${className} px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200`} {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {markdown}
      </ReactMarkdown>
      
      {!markdown && (
        <div className="text-gray-400 dark:text-gray-500 italic">
          Preview will appear here.
        </div>
      )}
    </div>
  );
};
