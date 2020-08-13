import React from "react";

function Preview(props) {
  const { imageUrl } = props;
  return (
    <div>
      <div id="preview-background"></div>
      <div id="preview">
        <img src={imageUrl} alt="非图片附件"></img>
      </div>
    </div>
  );
}

export { Preview };
