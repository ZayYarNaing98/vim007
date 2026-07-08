import type { VimMode } from "./VimEditor";

type Props = {
  mode: VimMode;
  keystrokes: number;
  par: number;
};

export function VimStatusBar({ mode, keystrokes, par }: Props) {
  return (
    <div className="vim-status-bar">
      <span className={`vim-mode vim-mode-${mode}`}>-- {mode.toUpperCase()} --</span>
      <span className="vim-keystrokes">
        keystrokes: <strong>{keystrokes}</strong> / par {par}
      </span>
    </div>
  );
}
