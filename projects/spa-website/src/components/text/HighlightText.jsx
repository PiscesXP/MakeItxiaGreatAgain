import React from "react";
import ReactHighlightWords from "react-highlight-words";

/**
 *
 * @param highlightWords {[string]}
 * @param text {string}
 * */
function HighlightText({ highlightWords = [], text }) {
  return (
    <ReactHighlightWords
      highlightClassName="text-highlight"
      searchWords={highlightWords}
      autoEscape
      caseSensitive={false}
      textToHighlight={text}
    />
  );
}

export { HighlightText };
