"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  isExpanded?: boolean;
  className?: string;
}

export default function CollapsibleSection({
  title,
  children,
  isExpanded = false,
  className = "",
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(isExpanded);
  const [contentHeight, setContentHeight] = useState<string>("0px");
  const contentRef = useRef<HTMLDivElement>(null);

  // Update content height when expanded/collapsed
  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        setContentHeight(`${contentRef.current.scrollHeight}px`);
      } else {
        setContentHeight("0px");
      }
    }
  }, [isOpen, children]);

  const toggleSection = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleSection();
    }
  };

  return (
    <div className={`border-b border-gray-200 ${className}`}>
      <button
        onClick={toggleSection}
        onKeyDown={handleKeyDown}
        className="w-full flex items-center justify-between py-4 text-left focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded-md"
        aria-expanded={isOpen}
        aria-controls={`content-${title.replace(/\s+/g, "-").toLowerCase()}`}
      >
        <span className="font-medium text-gray-900">{title}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>

      <div
        id={`content-${title.replace(/\s+/g, "-").toLowerCase()}`}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ height: contentHeight }}
      >
        <div ref={contentRef} className="pb-4">
          {children}
        </div>
      </div>
    </div>
  );
}
