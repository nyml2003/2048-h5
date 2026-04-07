# 2048 H5

一个移动端单屏 H5 `2048` 项目，使用 React 19、TypeScript 和原生 CSS 实现，包含手动游玩与 AI 代打模式。

当前目标：

- 竖屏单屏布局，不依赖页面滚动
- 四屏结构：首页、帮助页、游戏页、暂停/设置页、结算页
- `src/app` 与 `src/game` 分层，规则引擎和 AI 保持纯 TypeScript
- 提供 `lint`、`typecheck`、`vitest` 与 `playwright` 验证

## 运行命令

- `pnpm dev`：启动本地开发
- `pnpm build`：类型检查并构建产物
- `pnpm preview`：预览生产构建
- `pnpm lint`：运行 ESLint
- `pnpm typecheck`：运行 TypeScript 检查
- `pnpm test`：运行测试
- `pnpm test:e2e`：运行 Playwright 端到端测试

## 计划中的操作方式

- 触控滑动：向上、下、左、右移动棋盘
- 键盘映射：
  - `ArrowLeft` / `ArrowRight`：左右移动
  - `ArrowUp` / `ArrowDown`：上下移动
  - `Enter`：开始或继续
  - `P` / `Escape`：打开暂停与设置
  - `H`：进入帮助
  - `A`：从首页或帮助页直接进入 AI 代打

## 目录说明

- `src/app`：页面壳、文案、路由状态、交互 hook、布局样式
- `src/game`：2048 规则、AI 搜索与纯逻辑测试
- `tests/app`：应用层和 hook 测试
- `tests/game`：规则与 AI 测试
- `tests/e2e`：移动端主路径测试
