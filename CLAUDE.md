# CLAUDE.md - balatro-v6

## 项目定位
Balatro 风格扑克牌游戏，基于 Docs-v6 三件套（01-PRD / 02-DESIGN / 03-实施指引）实现第 1 轮核心循环。

## 技术栈
- Vue 3 Composition API + `<script setup>` SFCs
- Vite
- Tailwind CSS v4（通过 @tailwindcss/vite plugin）

## 关键规范（来自 PRD §10 硬约束）
1. sidebar 必须真的渲染（App.vue 挂 `<SideBar />` 且接通 8 块内容）
2. main-area 不要 padding-right
3. 整页 100vh 100vw overflow:hidden，flex 横排
4. Pages 部署用 workflow 模式（不用 legacy gh-pages）
5. 每次 commit 前 `npm run build` 必须通过

## 常用命令
```bash
npm run dev     # 本地开发
npm run build   # 构建（先 build 再 commit）
```

## 文件结构
```
src/
  utils/
    poker.js       # 牌型识别
    scoring.js     # 计分公式
  config/
    jokers.js      # 6 张 Joker 定义
    blinds.js      # 3 关盲注
    constants.js   # 关键常量
  components/
    SideBar.vue    # 左 sidebar（8 块）
    JokerArea.vue  # 右第 1 段 Joker 槽
    PlayArea.vue   # 右第 2 段出牌区
    HandArea.vue   # 右第 3 段手牌 + 按钮
    DeckPile.vue   # fixed 右下牌堆
    ShopView.vue   # 商店覆盖层
    EndView.vue    # 通关/失败覆盖层
  App.vue          # 根组件 + 游戏状态机
  main.js
  style.css
```
