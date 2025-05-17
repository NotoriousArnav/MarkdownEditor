
import { useEffect, useState } from "react";
import { calculateStats } from "@/utils/markdownUtils";

interface WordCountProps {
  text: string;
}

export const WordCount = ({ text }: WordCountProps) => {
  const [stats, setStats] = useState({
    words: 0,
    chars: 0,
    readingTime: 0,
  });

  useEffect(() => {
    setStats(calculateStats(text));
  }, [text]);

  return (
    <div className="text-xs text-gray-500 flex space-x-4 items-center">
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-gray-400"><path d="M19 5v14H5V5h14zm0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/><path d="M14.5 11.5h-5"/><path d="M8 8h8"/></svg>
        <span>{stats.words} words</span>
      </div>
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-gray-400"><path d="M17 11l7 7"/><path d="M5.5 11a5.5 5.5 0 1 0 11 0 5.5 5.5 0 1 0-11 0z"/></svg>
        <span>{stats.chars} characters</span>
      </div>
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-gray-400"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <span>{stats.readingTime} min read</span>
      </div>
    </div>
  );
};
