import { useCallback, useEffect, useMemo, useRef } from "react";
import CodeMirror, { type ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { vim, getCM } from "@replit/codemirror-vim";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView, type ViewUpdate } from "@codemirror/view";
import { Prec } from "@codemirror/state";
import type { CursorPos } from "../lessons/types";

export type VimMode = "normal" | "insert" | "visual";

type Props = {
  initialCode: string;
  initialCursor: CursorPos;
  allowedKeys?: string[];
  disabled?: boolean;
  onStateChange: (buffer: string, cursor: CursorPos) => void;
  onKeystroke: (key: string) => void;
  onModeChange: (mode: VimMode) => void;
  onBlockedKey: (key: string) => void;
};

const MODIFIER_KEYS = new Set(["Shift", "Control", "Alt", "Meta", "CapsLock"]);
// Escape must always work so users can never get stuck in Insert mode.
const ALWAYS_ALLOWED = new Set(["Escape"]);

export function VimEditor({
  initialCode,
  initialCursor,
  allowedKeys,
  disabled = false,
  onStateChange,
  onKeystroke,
  onModeChange,
  onBlockedKey,
}: Props) {
  const callbacksRef = useRef({ onKeystroke, onBlockedKey, allowedKeys, disabled });
  callbacksRef.current = { onKeystroke, onBlockedKey, allowedKeys, disabled };

  const extensions = useMemo(
    () => [
      // Key filter runs before Vim sees the event.
      Prec.highest(
        EditorView.domEventHandlers({
          keydown: (event) => {
            const { onKeystroke, onBlockedKey, allowedKeys, disabled } = callbacksRef.current;

            // Ctrl-w is a Vim window command but closes the browser tab.
            if (event.ctrlKey && event.key.toLowerCase() === "w") {
              event.preventDefault();
            }
            if (MODIFIER_KEYS.has(event.key)) return false;
            if (disabled) {
              event.preventDefault();
              return true;
            }
            if (
              allowedKeys &&
              !allowedKeys.includes(event.key) &&
              !ALWAYS_ALLOWED.has(event.key)
            ) {
              event.preventDefault();
              onBlockedKey(event.key);
              return true; // swallow the event
            }
            onKeystroke(event.key);
            return false;
          },
        })
      ),
      vim(), // must come before other keymaps
      javascript(),
    ],
    []
  );

  const editorRef = useRef<ReactCodeMirrorRef>(null);

  // Set the initial cursor and bind the mode listener once the view exists.
  // Runs as an effect (not onCreateEditor) so it survives StrictMode's
  // mount/unmount/remount cycle, where onCreateEditor fires on a view that
  // is immediately destroyed.
  useEffect(() => {
    let cancelled = false;
    const init = () => {
      if (cancelled) return;
      const view = editorRef.current?.view;
      // Wait until the document is actually loaded: the value prop can be
      // applied after view creation, and that replacement moves the cursor,
      // clobbering any selection dispatched too early.
      if (!view || view.state.doc.toString() !== initialCode) {
        requestAnimationFrame(init);
        return;
      }
      const line = view.state.doc.line(
        Math.min(initialCursor.line + 1, view.state.doc.lines)
      );
      const pos = Math.min(line.from + initialCursor.ch, line.to);
      view.dispatch({ selection: { anchor: pos } });
      view.focus();

      const cm = getCM(view);
      if (cm) {
        cm.on("vim-mode-change", (ev: { mode: string }) => {
          onModeChange(ev.mode as VimMode);
        });
      }
    };
    requestAnimationFrame(init);
    return () => {
      cancelled = true;
    };
    // Remounted via key= for every exercise/attempt, so run-once is safe.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdate = useCallback(
    (update: ViewUpdate) => {
      if (!update.docChanged && !update.selectionSet) return;
      const state = update.state;
      const pos = state.selection.main.head;
      const line = state.doc.lineAt(pos);
      onStateChange(state.doc.toString(), {
        line: line.number - 1,
        ch: pos - line.from,
      });
    },
    [onStateChange]
  );

  return (
    <CodeMirror
      ref={editorRef}
      value={initialCode}
      height="320px"
      theme="dark"
      extensions={extensions}
      onUpdate={handleUpdate}
      editable={!disabled}
      basicSetup={{
        lineNumbers: true,
        highlightActiveLine: true,
        foldGutter: false,
        autocompletion: false,
      }}
    />
  );
}
