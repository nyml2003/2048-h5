import type { PointerEventHandler, RefObject } from "react";

export interface ActionButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

export interface ControlButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export interface HelpSection {
  title: string;
  description: string;
  bullets: readonly string[];
}

export interface ScreenStat {
  label: string;
  value: string;
  testId?: string;
}

export interface SettingsItem {
  label: string;
  value: string;
}

export interface GameControl {
  key: string;
  label: string;
  onPress: () => void;
}

export interface SwipeHandlers {
  onPointerDown: PointerEventHandler<HTMLElement>;
  onPointerUp: PointerEventHandler<HTMLElement>;
  onPointerCancel: PointerEventHandler<HTMLElement>;
}

export interface HomeScreenProps {
  tag: string;
  title: string;
  subtitle: string;
  bullets: readonly string[];
  note: string;
  startLabel: string;
  aiLabel: string;
  helpLabel: string;
  onStart: () => void;
  onAiStart: () => void;
  onHelp: () => void;
}

export interface HelpScreenProps {
  tag: string;
  title: string;
  subtitle: string;
  hint: string;
  sections: readonly HelpSection[];
  currentPage: number;
  totalPages: number;
  previousLabel: string;
  nextLabel: string;
  startLabel: string;
  aiLabel: string;
  homeLabel: string;
  onPrevious: () => void;
  onNext: () => void;
  onStart: () => void;
  onAiStart: () => void;
  onHome: () => void;
}

export interface GameScreenProps {
  tag: string;
  boardLabel: string;
  pauseLabel: string;
  modeBadge: string | null;
  keyboardHint: string;
  stats: readonly ScreenStat[];
  boardCanvasRef: RefObject<HTMLCanvasElement | null>;
  swipeBind: SwipeHandlers;
  controls: readonly GameControl[];
  controlsDisabled: boolean;
  onPause: () => void;
}

export interface SettingsScreenProps {
  title: string;
  subtitle: string;
  items: readonly SettingsItem[];
  stats: readonly ScreenStat[];
  primaryLabel: string;
  takeOverLabel?: string;
  restartLabel: string;
  homeLabel: string;
  onPrimary: () => void;
  onTakeOver?: () => void;
  onRestart: () => void;
  onHome: () => void;
}

export interface ResultScreenProps {
  tag: string;
  title: string;
  subtitle: string;
  stats: readonly ScreenStat[];
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  onSecondary: () => void;
}
