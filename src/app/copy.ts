interface HelpSection {
  title: string;
  description: string;
  bullets: readonly string[];
}

interface CopySchema {
  home: {
    tag: string;
    title: string;
    subtitle: string;
    bullets: readonly string[];
    note: string;
    primary: string;
    ai: string;
    help: string;
  };
  help: {
    tag: string;
    title: string;
    subtitle: string;
    hint: string;
    previous: string;
    next: string;
    primary: string;
    ai: string;
    home: string;
    sections: readonly HelpSection[];
  };
  game: {
    tag: string;
    badge: string;
    keyboardHint: string;
    aiHint: string;
    boardLabel: string;
  };
  hud: {
    score: string;
    best: string;
    moves: string;
    peak: string;
  };
  controls: {
    up: string;
    left: string;
    right: string;
    down: string;
    pause: string;
  };
  settings: {
    title: string;
    subtitle: string;
    resume: string;
    start: string;
    restart: string;
    home: string;
    mode: string;
    aiMode: string;
    manualMode: string;
    takeOver: string;
  };
  result: {
    tag: string;
    title: string;
    subtitle: string;
    primary: string;
    secondary: string;
  };
}

export const zhCN: CopySchema = {
  home: {
    tag: "2048",
    title: "Pocket Merge Lab",
    subtitle: "移动、合并、拉高数字，单屏完成一局节奏。",
    bullets: [
      "4x4 棋盘，操作简单但策略空间很大。",
      "支持手动和 AI 代打两种模式。",
      "首页、帮助、游戏、设置、结算五段体验。",
    ],
    note: "建议竖屏游玩，触控滑动和方向键都可用。",
    primary: "开始挑战",
    ai: "AI 代打",
    help: "玩法说明",
  },
  help: {
    tag: "操作指南",
    title: "合并规则说明",
    subtitle: "三十秒看完，开局不会手忙脚乱。",
    hint: "在帮助页按 Enter 可直接开局，按 A 可 AI 开局。",
    previous: "上一页",
    next: "下一页",
    primary: "开始挑战",
    ai: "AI 代打",
    home: "返回首页",
    sections: [
      {
        title: "基础移动",
        description: "四方向推盘",
        bullets: [
          "上、下、左、右推动整盘数字。",
          "同数值相撞会合并为更大数字。",
          "每次有效移动后会出现一个新砖块。",
        ],
      },
      {
        title: "计分规则",
        description: "合并即得分",
        bullets: [
          "每次合并会累加到本局分数。",
          "最高分会本地保存。",
          "面板同时展示步数和当前最大块。",
        ],
      },
      {
        title: "键盘与触控",
        description: "移动端优先",
        bullets: [
          "方向键可直接操作。",
          "在棋盘上滑动也能触发方向动作。",
          "底部方向按钮适合单手点击。",
        ],
      },
      {
        title: "AI 代打模式",
        description: "自动推进",
        bullets: [
          "首页点 AI 代打可直接自动开局。",
          "游戏内会显示 AUTO MODE 标记。",
          "设置页可一键切回人工接管。",
        ],
      },
      {
        title: "暂停与结算",
        description: "节奏管理",
        bullets: [
          "游戏页可随时进入设置。",
          "当没有合法移动时自动进入结算。",
          "结算页支持再来一局或返回首页。",
        ],
      },
    ],
  },
  game: {
    tag: "当前棋局",
    badge: "AUTO MODE",
    keyboardHint: "键盘支持方向键，Esc / P 打开设置。",
    aiHint: "AI 正在代打中，可在设置页选择人工接管。",
    boardLabel: "2048 棋盘",
  },
  hud: {
    score: "分数",
    best: "最高分",
    moves: "步数",
    peak: "最大块",
  },
  controls: {
    up: "上移",
    left: "左移",
    right: "右移",
    down: "下移",
    pause: "暂停",
  },
  settings: {
    title: "暂停 / 设置",
    subtitle: "可以继续当前局，也可以重开。",
    resume: "继续游戏",
    start: "开始挑战",
    restart: "重新开始",
    home: "返回首页",
    mode: "当前模式",
    aiMode: "AI 代打",
    manualMode: "手动操作",
    takeOver: "人工接管",
  },
  result: {
    tag: "本局结束",
    title: "结算面板",
    subtitle: "再来一局，继续冲更大的数字。",
    primary: "再来一局",
    secondary: "返回首页",
  },
};
