import React from "react";
import ReactHighlightWords from "react-highlight-words";

interface HighlightTextProps {
  highlightWords: string[];
  text: string;
}

/**
 *
 * @param highlightWords {[string]}
 * @param text {string}
 * */
export const HighlightText: React.FC<HighlightTextProps> = ({
  highlightWords = [],
  text,
}) => {
  return (
    <ReactHighlightWords
      highlightClassName="text-highlight"
      searchWords={highlightWords}
      autoEscape
      caseSensitive={false}
      textToHighlight={text}
    />
  );
};
