import { useRef } from "react";

type UndoEntry = any;

export default function useUndo() {
  const stackRef = useRef<Array<UndoEntry>>([]);

  const push = (entry: UndoEntry) => {
    stackRef.current.push(entry);
  };

  const undo = (): UndoEntry | undefined => {
    if (stackRef.current.length === 0) return undefined;
    return stackRef.current.pop();
  };

  const canUndo = () => stackRef.current.length > 0;

  return { stackRef, push, undo, canUndo };
}
