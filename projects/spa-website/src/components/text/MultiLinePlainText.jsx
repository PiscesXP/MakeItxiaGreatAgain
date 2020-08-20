import React from "react";

/**
 * @param content {string}
 * */
function MultiLinePlainText({ content }) {
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
        <p key={index}>{line}</p>
      ))}
    </div>
  );
}

export { MultiLinePlainText };
