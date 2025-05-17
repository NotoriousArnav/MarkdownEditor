
export type MarkdownTheme = 'github' | 'notion' | 'medium' | 'devto';

export const themes: { label: string; value: MarkdownTheme }[] = [
  { label: 'GitHub', value: 'github' },
  { label: 'Notion', value: 'notion' },
  { label: 'Medium', value: 'medium' },
  { label: 'Dev.to', value: 'devto' }
];
