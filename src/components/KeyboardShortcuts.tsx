import { useEffect } from 'react';

interface KeyboardShortcutsProps {
  onGenerate: () => void;
  onCopy: () => void;
}

export default function KeyboardShortcuts({ onGenerate, onCopy }: KeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + G for generate
      if ((event.ctrlKey || event.metaKey) && event.key === 'g') {
        event.preventDefault();
        onGenerate();
      }
      
      // Ctrl/Cmd + C for copy (when not in an input field)
      if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
        const target = event.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          event.preventDefault();
          onCopy();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onGenerate, onCopy]);

  return null;
}
