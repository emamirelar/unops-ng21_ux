import { type ReactNode, useId } from 'react';
import './AiCardBg.css';

export interface AiCardBgProps {
  children?: ReactNode;
  className?: string;
}

export function AiCardBg({ children, className }: AiCardBgProps) {
  const uniqueId = useId();
  const filterId = `uxAiBlur_${uniqueId.replace(/:/g, '')}`;
  const filterUrl = `url(#${filterId})`;

  return (
    <div className={`ux-ai-card-bg block box-border ${className ?? ''}`} data-ai-bg="">
      <svg
        className="ux-ai-card-bg__svg"
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="30" />
          </filter>
        </defs>
        <ellipse
          className="ux-ai-fg ux-ai-fg--1"
          cx="60"
          cy="50"
          rx="120"
          ry="100"
          opacity="0.35"
          filter={filterUrl}
        />
        <ellipse
          className="ux-ai-fg ux-ai-fg--2"
          cx="320"
          cy="80"
          rx="100"
          ry="80"
          opacity="0.3"
          filter={filterUrl}
        />
        <ellipse
          className="ux-ai-fg ux-ai-fg--3"
          cx="200"
          cy="240"
          rx="140"
          ry="90"
          opacity="0.25"
          filter={filterUrl}
        />
      </svg>
      {children}
    </div>
  );
}
