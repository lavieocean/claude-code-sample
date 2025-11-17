# Claude Code Sample 项目集合

这个仓库包含多个有趣的 Web 应用项目。

## 🎮 项目列表

### 1. 表情符号谚语猜谜游戏

一个使用 Claude AI 的趣味猜谜游戏，将中国谚语翻译成表情符号，让玩家猜测对应的谚语。

**特点**:
- 使用 Claude API 动态生成谚语和表情符号
- AI 智能判断答案正确性（支持近似答案）
- 题目不重复机制
- 提示系统（3次机会）
- 实时计分和统计

**技术栈**: Node.js, Express, Claude API, HTML5, CSS3

**文件**: `emoji-proverb-game.html`, `server.js`, `package.json`

**详细说明**: 查看 [EMOJI_GAME_README.md](./EMOJI_GAME_README.md)

**快速开始**:
```bash
npm install
# 创建 .env 文件并添加 ANTHROPIC_API_KEY
npm start
# 访问 http://localhost:3000
```

---

### 2. MIDI 电子琴

一个基于 Web 的交互式 MIDI 电子琴应用，支持键盘演奏、八度切换和多种音色选择。

**特点**:
- 🎹 完整的12键一个八度键盘（7个白键 + 5个黑键）
- ⌨️ 键盘控制：
  - 白键：`A` `S` `D` `F` `G` `H` `J` (对应 C D E F G A B)
  - 黑键：`W` `E` `T` `Y` `U` (对应 C# D# F# G# A#)
- 🎵 八度切换：支持0-8个八度范围（默认第4八度）
- 🎨 3种合成器音色：正弦波、方波、锯齿波
- 🖱️ 鼠标支持：可以直接点击钢琴键演奏
- 📱 响应式设计：支持移动设备

**技术栈**: HTML5, CSS3, Web Audio API, 原生 JavaScript

**文件**: `index.html`, `style.css`, `script.js`

**无需后端**: 纯前端应用，直接在浏览器中打开 `index.html` 即可使用

**使用方法**:
1. 用浏览器打开 `index.html` 文件
2. 点击页面任意位置或按任意键以启用音频
3. 开始演奏！

键盘映射:
```
黑键:  W   E       T   Y   U
白键: A  S  D  F  G  H  J
音符: C  D  E  F  G  A  B
```

---

## 📁 项目结构

```
.
├── emoji-proverb-game.html    # 表情符号游戏前端
├── server.js                  # 表情符号游戏后端
├── package.json               # Node.js 依赖配置
├── .env.example               # 环境变量示例
├── EMOJI_GAME_README.md       # 表情符号游戏详细文档
├── index.html                 # MIDI 电子琴主文件
├── style.css                  # MIDI 电子琴样式
├── script.js                  # MIDI 电子琴逻辑
├── midi-keyboard.html         # MIDI 电子琴单文件版本
└── README.md                  # 本文件
```

## 🌐 浏览器兼容性

支持所有现代浏览器：
- Chrome/Edge 60+
- Firefox 55+
- Safari 11+
- Opera 47+

**注意**：部分功能需要浏览器支持 Web Audio API

## 📄 许可证

MIT License

## 👨‍💻 作者

Created with Claude Code

---

享受使用这些应用！🎉
