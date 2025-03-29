
import React, { createContext, useContext, useReducer, ReactNode } from "react";

interface UndoRedoState<T> {
  past: T[];
  present: T;
  future: T[];
}

type UndoRedoAction<T> =
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "SET"; newPresent: T }
  | { type: "CLEAR" };

interface UndoRedoContextType<T> {
  state: UndoRedoState<T>;
  canUndo: boolean;
  canRedo: boolean;
  set: (newPresent: T) => void;
  undo: () => void;
  redo: () => void;
  clear: () => void;
}

function undoRedoReducer<T>(state: UndoRedoState<T>, action: UndoRedoAction<T>): UndoRedoState<T> {
  const { past, present, future } = state;

  switch (action.type) {
    case "UNDO": {
      if (past.length === 0) return state;
      
      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);
      
      return {
        past: newPast,
        present: previous,
        future: [present, ...future]
      };
    }
    
    case "REDO": {
      if (future.length === 0) return state;
      
      const next = future[0];
      const newFuture = future.slice(1);
      
      return {
        past: [...past, present],
        present: next,
        future: newFuture
      };
    }
    
    case "SET": {
      if (action.newPresent === present) return state;
      
      return {
        past: [...past, present],
        present: action.newPresent,
        future: []
      };
    }
    
    case "CLEAR": {
      return {
        past: [],
        present: present,
        future: []
      };
    }
  }
}

const UndoRedoContext = createContext<UndoRedoContextType<any> | undefined>(undefined);

interface UndoRedoProviderProps<T> {
  initialState: T;
  children: ReactNode;
}

export function UndoRedoProvider<T>({ initialState, children }: UndoRedoProviderProps<T>) {
  const [state, dispatch] = useReducer(undoRedoReducer, {
    past: [],
    present: initialState,
    future: []
  } as UndoRedoState<T>);
  
  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;
  
  const undo = () => dispatch({ type: "UNDO" });
  const redo = () => dispatch({ type: "REDO" });
  const set = (newPresent: T) => dispatch({ type: "SET", newPresent });
  const clear = () => dispatch({ type: "CLEAR" });
  
  return (
    <UndoRedoContext.Provider value={{ state, canUndo, canRedo, undo, redo, set, clear }}>
      {children}
    </UndoRedoContext.Provider>
  );
}

export function useUndoRedo<T>() {
  const context = useContext(UndoRedoContext);
  if (context === undefined) {
    throw new Error("useUndoRedo must be used within a UndoRedoProvider");
  }
  return context as UndoRedoContextType<T>;
}
