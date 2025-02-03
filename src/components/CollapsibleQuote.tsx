import { useState } from "react";

const CollapsibleQuote = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-l-4 border-gray-500 pl-4 my-4">
      <button
        className="mb-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <>Hide Quote &#9650;</> : <>Show Quote &#9660;</>}
      </button>
      {isOpen && <>{children}</>}
    </div>
  );
};

export default CollapsibleQuote;

