import * as aiModule from "@/game/tetrisAi";
import * as engineModule from "@/game/tetrisEngine";
import type { GameState as EngineGameState } from "@/game/types";

type RuntimeMap = Record<string, unknown>;

export type ControlAction = "up" | "down" | "left" | "right";
export type GameStatus = "idle" | "running" | "paused" | "gameOver";
export type GameState = EngineGameState;

function asRuntimeMap(value: unknown): RuntimeMap {
  return value as RuntimeMap;
}

function asControlAction(value: unknown): ControlAction | null {
  return value === "up" || value === "down" || value === "left" || value === "right"
    ? value
    : null;
}

function callEngine(name: string, ...args: unknown[]): GameState {
  const runtime = asRuntimeMap(engineModule);
  const fn = runtime[name];

  if (typeof fn !== "function") {
    throw new Error(`Game engine method '${name}' is not available.`);
  }

  return (fn as (...innerArgs: unknown[]) => GameState)(...args);
}

export function createGameState(): GameState {
  return callEngine("createGameState");
}

export function restartGame(randomValues?: readonly number[]): GameState {
  return callEngine("restartGame", randomValues);
}

export function beginGame(state: GameState): GameState {
  return callEngine("beginGame", state);
}

export function togglePause(state: GameState): GameState {
  return callEngine("togglePause", state);
}

export function applyGameAction(
  state: GameState,
  action: ControlAction,
  randomValues?: readonly number[]
): GameState {
  return callEngine("applyAction", state, action, randomValues);
}

export function canMove(state: GameState): boolean {
  const runtime = asRuntimeMap(engineModule);
  const method = runtime.canMove;

  if (typeof method === "function") {
    return (method as (innerState: GameState) => boolean)(state);
  }

  return state.status !== "gameOver";
}

export function planAiAction(state: GameState): ControlAction | null {
  const runtime = asRuntimeMap(aiModule);
  const method = runtime.planAiMove;

  if (typeof method !== "function") {
    return null;
  }

  const result = (method as (innerState: GameState) => unknown)(state);
  const direct = asControlAction(result);

  if (direct) {
    return direct;
  }

  if (!result || typeof result !== "object") {
    return null;
  }

  const actions = (result as { actions?: unknown }).actions;

  if (!Array.isArray(actions)) {
    return null;
  }

  for (const action of actions) {
    const parsed = asControlAction(action);

    if (parsed) {
      return parsed;
    }
  }

  return null;
}
