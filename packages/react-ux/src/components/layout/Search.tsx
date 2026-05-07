import { useCallback, useEffect, useRef } from 'react';
import { useLayout } from '../../hooks/useLayout';

export function Search() {
  const { layoutState, setLayoutState } = useLayout();
  const inputRef = useRef<HTMLInputElement>(null);

  const close = useCallback(() => {
    setLayoutState({ searchBarActive: false });
  }, [setLayoutState]);

  useEffect(() => {
    if (layoutState.searchBarActive) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [layoutState.searchBarActive]);

  if (!layoutState.searchBarActive) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[20vh]"
      onClick={close}
    >
      <div className="layout-mask !block" />
      <div
        className="search-container relative z-10 w-full max-w-2xl mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <i className="pi pi-search" />
        <input
          ref={inputRef}
          type="text"
          className="p-inputtext search-input"
          placeholder="Search"
          onKeyDown={(e) => e.key === 'Enter' && close()}
        />
      </div>
    </div>
  );
}
