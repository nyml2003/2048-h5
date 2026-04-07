import { usePressRepeat } from "@/app/hooks/usePressRepeat";
import type {
  ActionButtonProps,
  ControlButtonProps,
  GameScreenProps,
  HelpScreenProps,
  HomeScreenProps,
  ResultScreenProps,
  SettingsScreenProps,
} from "@/app/shell/types";

function ActionButton({
  label,
  onPress,
  variant = "primary",
  disabled = false,
}: ActionButtonProps) {
  return (
    <button
      type="button"
      className={`action-button action-button--${variant}`}
      onClick={onPress}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

function ControlButton({
  label,
  onPress,
  disabled = false,
}: ControlButtonProps) {
  const pressBind = usePressRepeat(onPress, {
    disabled,
  });

  return (
    <button
      type="button"
      className="control-button"
      aria-label={label}
      disabled={disabled}
      {...pressBind}
    >
      {label}
    </button>
  );
}

export function HomeScreen({
  tag,
  title,
  subtitle,
  bullets,
  note,
  startLabel,
  aiLabel,
  helpLabel,
  onStart,
  onAiStart,
  onHelp,
}: HomeScreenProps) {
  return (
    <section className="app-screen app-screen--home" data-testid="screen-home">
      <div className="screen-card screen-card--hero" data-testid="home-card">
        <span className="screen-tag">{tag}</span>
        <h1 className="screen-title">{title}</h1>
        <p className="screen-subtitle">{subtitle}</p>

        <ul className="screen-list">
          {bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <p className="home-note">{note}</p>
      </div>

      <div className="screen-actions" data-testid="home-actions">
        <ActionButton label={startLabel} onPress={onStart} />
        <ActionButton label={aiLabel} onPress={onAiStart} variant="secondary" />
        <ActionButton label={helpLabel} onPress={onHelp} variant="secondary" />
      </div>
    </section>
  );
}

export function HelpScreen({
  tag,
  title,
  subtitle,
  hint,
  sections,
  currentPage,
  totalPages,
  previousLabel,
  nextLabel,
  startLabel,
  aiLabel,
  homeLabel,
  onPrevious,
  onNext,
  onStart,
  onAiStart,
  onHome,
}: HelpScreenProps) {
  return (
    <section className="app-screen app-screen--panel" data-testid="screen-help">
      <div className="screen-card screen-card--panel" data-testid="help-panel">
        <span className="screen-tag">{tag}</span>
        <h2 className="screen-title screen-title--panel">{title}</h2>
        <p className="screen-subtitle screen-subtitle--panel">{subtitle}</p>

        <div className="help-grid" data-testid="help-grid">
          {sections.map((section) => (
            <article key={section.title} className="help-card" data-testid="help-card">
              <div className="help-card__header">
                <strong className="help-card__title">{section.title}</strong>
                <span className="help-card__meta">{section.description}</span>
              </div>
              <ul className="help-card__list">
                {section.bullets.map((item) => (
                  <li key={`${section.title}-${item}`}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="help-footer" data-testid="help-footer">
          <div className="help-pagination" data-testid="help-pagination">
            <ActionButton
              label={previousLabel}
              onPress={onPrevious}
              variant="secondary"
              disabled={currentPage <= 0}
            />
            <span className="help-pagination__status" data-testid="help-pagination-status">
              第 {currentPage + 1} / {totalPages} 页
            </span>
            <ActionButton
              label={nextLabel}
              onPress={onNext}
              variant="secondary"
              disabled={currentPage >= totalPages - 1}
            />
          </div>

          <p className="help-hint">{hint}</p>
        </div>
      </div>

      <div className="screen-actions" data-testid="help-actions">
        <ActionButton label={startLabel} onPress={onStart} />
        <ActionButton label={aiLabel} onPress={onAiStart} variant="secondary" />
        <ActionButton label={homeLabel} onPress={onHome} variant="secondary" />
      </div>
    </section>
  );
}

export function GameScreen({
  tag,
  boardLabel,
  pauseLabel,
  modeBadge,
  keyboardHint,
  stats,
  boardCanvasRef,
  swipeBind,
  controls,
  controlsDisabled,
  onPause,
}: GameScreenProps) {
  return (
    <section className="app-screen app-screen--game" data-testid="screen-game">
      <header className="game-topbar" data-testid="game-topbar">
        <div className="game-topbar__head">
          <div className="game-topbar__title">
            <span className="screen-tag">{tag}</span>
            {modeBadge ? (
              <span className="header-pill header-pill--ai" data-testid="game-mode-badge">
                {modeBadge}
              </span>
            ) : null}
          </div>

          <button
            type="button"
            className="header-pill header-pill--action"
            onClick={onPause}
            aria-label={pauseLabel}
          >
            {pauseLabel}
          </button>
        </div>

        <div className="stats-row" data-testid="stats-row">
          {stats.map((item) => (
            <article key={item.testId ?? item.label} className="stat-chip" data-testid={item.testId}>
              <span className="stat-chip__label">{item.label}</span>
              <strong className="stat-chip__value">{item.value}</strong>
            </article>
          ))}
        </div>
      </header>

      <div className="game-stage" data-testid="game-stage">
        <div className="board-shell">
          <canvas
            ref={boardCanvasRef}
            className="board-canvas"
            aria-label={boardLabel}
            data-testid="board-grid"
            {...swipeBind}
          />
        </div>
      </div>

      <footer className="game-footer" data-testid="game-footer">
        <div className="controls-grid">
          {controls.map((control) => (
            <ControlButton
              key={control.key}
              label={control.label}
              onPress={control.onPress}
              disabled={controlsDisabled}
            />
          ))}
        </div>

        <p className="game-hint">{keyboardHint}</p>
      </footer>
    </section>
  );
}

export function SettingsScreen({
  title,
  subtitle,
  items,
  stats,
  primaryLabel,
  takeOverLabel,
  restartLabel,
  homeLabel,
  onPrimary,
  onTakeOver,
  onRestart,
  onHome,
}: SettingsScreenProps) {
  return (
    <section className="app-screen app-screen--panel" data-testid="screen-settings">
      <div className="screen-card screen-card--panel" data-testid="settings-panel">
        <span className="screen-tag">暂停 / 设置</span>
        <h2 className="screen-title screen-title--panel">{title}</h2>
        <p className="screen-subtitle screen-subtitle--panel">{subtitle}</p>

        <div className="settings-list" data-testid="settings-list">
          {items.map((item) => (
            <article key={item.label} className="settings-item">
              <span className="settings-item__label">{item.label}</span>
              <strong className="settings-item__value">{item.value}</strong>
            </article>
          ))}
        </div>

        <div className="result-stats result-stats--compact">
          {stats.map((item) => (
            <article key={item.label} className="result-stat">
              <span className="result-stat__label">{item.label}</span>
              <strong className="result-stat__value">{item.value}</strong>
            </article>
          ))}
        </div>
      </div>

      <div className="screen-actions" data-testid="settings-actions">
        <ActionButton label={primaryLabel} onPress={onPrimary} />
        {takeOverLabel && onTakeOver ? (
          <ActionButton label={takeOverLabel} onPress={onTakeOver} variant="secondary" />
        ) : null}
        <ActionButton label={restartLabel} onPress={onRestart} variant="secondary" />
        <ActionButton label={homeLabel} onPress={onHome} variant="secondary" />
      </div>
    </section>
  );
}

export function ResultScreen({
  tag,
  title,
  subtitle,
  stats,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
}: ResultScreenProps) {
  return (
    <section className="app-screen app-screen--panel" data-testid="screen-result">
      <div className="screen-card screen-card--result" data-testid="result-card">
        <span className="screen-tag">{tag}</span>
        <h2 className="screen-title screen-title--panel">{title}</h2>
        <p className="screen-subtitle screen-subtitle--panel">{subtitle}</p>

        <div className="result-stats">
          {stats.map((item) => (
            <article key={item.label} className="result-stat">
              <span className="result-stat__label">{item.label}</span>
              <strong className="result-stat__value">{item.value}</strong>
            </article>
          ))}
        </div>
      </div>

      <div className="screen-actions screen-actions--dual" data-testid="result-actions">
        <ActionButton label={primaryLabel} onPress={onPrimary} />
        <ActionButton label={secondaryLabel} onPress={onSecondary} variant="secondary" />
      </div>
    </section>
  );
}
