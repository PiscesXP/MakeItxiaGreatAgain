import { useState } from "react";

function useToggle(initValue = false) {
  const [toggleValue, setToggleValue] = useState(initValue);

  function toggle() {
    setToggleValue(!toggleValue);
  }

  return [toggleValue, toggle];
}

export { useToggle };
