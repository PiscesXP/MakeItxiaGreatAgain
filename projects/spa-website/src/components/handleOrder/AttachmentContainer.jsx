import React from "react";
import { config } from "CONFIG";

export default function(props) {
  const { md5, mimetype, fileName } = props.payload;
  const getImageUrl = (md5, isThumbnail = false) => {
    let url =
      config.network.api.protocol +
      "://" +
      config.network.api.host +
      "/upload/" +
      md5;
    if (isThumbnail) {
      url += "?thumbnail";
    }
    return url;
  };

  return (
    <div className="attachment">
      <a href={getImageUrl(md5)} target="_parent" className="attachment">
        <img src={getImageUrl(md5, true)} alt="非图片附件"></img>
      </a>
      <span>文件名：{fileName}</span>
      <span>类型：{mimetype}</span>
    </div>
  );
}
