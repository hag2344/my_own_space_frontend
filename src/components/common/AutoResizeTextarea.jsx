import "./AutoResizeTextarea.css";

import { useRef, useEffect } from "react";

const AutoResizeTextarea = ({ value, onChange, ...props }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = ref.current.scrollHeight - 25 + "px";
  }, [value]);

  return <textarea ref={ref} value={value} onChange={onChange} {...props} />;
};

export default AutoResizeTextarea;
