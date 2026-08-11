"use client";

import React, { useState, useEffect } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number; // ms per character
  delay?: number; // start delay in ms
  onComplete?: () => void;
  className?: string;
  showCursor?: boolean;
}

export function TypewriterText({
  text,
  speed = 30,
  delay = 0,
  onComplete,
  className = "",
  showCursor = false,
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStarted(true);
    }, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;

    if (displayedText.length < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      setIsDone(true);
      if (onComplete) onComplete();
    }
  }, [started, displayedText, text, speed, onComplete]);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && !isDone && <span className="typewriterCursor">|</span>}
    </span>
  );
}