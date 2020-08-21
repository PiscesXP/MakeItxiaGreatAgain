import React from "react";
import { HighlightText } from "COMPONENTS/text/HighlightText";

/**
 * @param content {string}
 * @param highlightWords {[string]?}
 * */
function MultiLinePlainText({ content, highlightWords }) {
  if (!!!content || content === "") {
    return null;
  }
  //解析转义字符
  content = content.replace(/&gt;/g, ">");
  content = content.replace(/&lt;/g, "<");
  content = content.replace(/&nbsp;/g, " ");
  content = content.replace(/<br\s*\/>/g, "\n");
  return (
    <div className="multiline-text-container">
      {content.split("\n").map((line, index) => (
        <p key={index}>
          {Array.isArray(highlightWords) ? (
            <HighlightText text={line} highlightWords={highlightWords} />
          ) : (
            line
          )}
        </p>
      ))}
    </div>
  );
}

export { MultiLinePlainText };
