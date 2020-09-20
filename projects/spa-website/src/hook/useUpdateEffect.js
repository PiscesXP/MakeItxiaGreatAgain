import { useEffect, useRef } from "react";

/**
 * @param {function} effect
 * @param {Array?} deps
 * */
function useUpdateEffect(effect, deps) {
  const ref = useRef(false);

  useEffect(() => {
    if (!ref.current) {
      ref.current = true;
    } else {
      return effect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export { useUpdateEffect };
