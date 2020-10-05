import React from "react";

interface PreviewProps {
  imageUrl: string;
}

export const Preview: React.FC<PreviewProps> = ({ imageUrl }) => {
  return (
    <div>
      <div id="preview-background" />
      <div id="preview">
        <img src={imageUrl} alt="非图片附件" />
      </div>
    </div>
  );
};
