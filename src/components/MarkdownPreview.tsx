
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypeRaw from 'rehype-raw';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface MarkdownPreviewProps {
  markdown: string;
}

export const MarkdownPreview = ({ markdown }: MarkdownPreviewProps) => {
  return (
    <div className="p-4 prose prose-sm md:prose-base max-w-none overflow-auto h-full markdown-preview">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeSanitize, rehypeRaw]}
        components={{
          code({node, inline, className, children, ...props}) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={match[1]}
                PreTag="div"
                className="rounded-md border border-gray-200 bg-gray-900"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={`${className} px-1 py-0.5 rounded bg-gray-100 text-gray-800`} {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {markdown}
      </ReactMarkdown>
      
      {!markdown && (
        <div className="text-gray-400 italic">
          Preview will appear here.
        </div>
      )}
    </div>
  );
};
