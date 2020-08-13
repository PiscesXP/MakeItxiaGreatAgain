import { useState } from "react";
import { buildQueryString } from "UTIL/query";

function useQueryString(qsParseFn) {
  const [qs, setQs] = useState(() => {
    return window.location.search;
  });

  function setQueryString(query) {
    const newQs = buildQueryString(query);
    setQs(newQs);
    const url = window.location.toString().split("?")[0] + newQs;
    window.history.pushState(null, null, url);
  }
  return [qs, setQueryString];
}

export { useQueryString };
