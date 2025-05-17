
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
    <div className="text-xs text-gray-500 flex space-x-4">
      <span>{stats.words} words</span>
      <span>{stats.chars} characters</span>
      <span>{stats.readingTime} min read</span>
    </div>
  );
};
