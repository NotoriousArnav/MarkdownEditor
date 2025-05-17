
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import rehypeRaw from 'rehype-raw';

interface MarkdownPreviewProps {
  markdown: string;
}

export const MarkdownPreview = ({ markdown }: MarkdownPreviewProps) => {
  return (
    <div className="p-4 prose prose-sm md:prose-base max-w-none overflow-auto h-full markdown-preview">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeSanitize, rehypeRaw]}
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
