import React from "react";
/**
 * antd的样式.
 * 放在import前面，避免覆盖自己写的style.
 * */
import "antd/dist/antd.css";
import "./App.css";

import { Main } from "PAGE";

function App() {
  return <Main />;
}

export { App };
